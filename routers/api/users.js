// login & register
const express = require('express');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../../models/User');
const secret = require('../../config/store').secretOrKey;
 
/**
 * params: 
 * return: 
 * $route POST /api/users/register
 * @desc register user
 * @access Public
 */
router.post('/register', (req, res) => {
    const data = req.body;
    User.findOne({email: data.email})
        .then((user) => {
            if(user){
                res.status(400).json( "The mailbox is occupied")
            }else{
                const avatar = gravatar.url(data.email, {s: '200', r: 'pg', d: 'mm'});
                const newUser = new User({
                    name: data.name,
                    email: data.email,
                    avatar: avatar,
                    identity: data.identity,
                    password: data.password,
                    date: new Date(),
                    lastLoginTime: null,
                })
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    });
                });
            }
        })
})

/**
 * params: 
 * return: 
 * $route POST /api/users/register
 * @desc Login user
 * @access Public
 */
router.post('/login', (req, res) => {
    const data = req.body;
    User.findOne({email: data.email}) 
        .then(user => {
            if(!user){
                res.status(400).json("The user doesn't exist");
            }
            bcrypt.compare(data.password, user.password)
                .then(isMacth => {
                    if(isMacth){
                        const rule = { 
                            id: user.id, 
                            name: user.name,
                            avatar: user.avatar,
                            identity: user.identity,
                            email: user.email,
                        };
                        jwt.sign(rule, secret, {expiresIn: 3600*3}, (err, token) => {
                            if(err) throw err;
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        })
                    }else{
                        return res.status(400).json("Password is wrong");
                    }
                });
        })
})

/**
 * params: 
 * return: 
 * $route GET /api/users/current
 * @desc return current user
 * @access Private
 */
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    }) 
})


/**
 * $route POST /api/users/edit/:id
 * @desc update user's info 
 * @access Private
 */
router.post('/edit/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const data = req.body;
    const propery = {};
    propery[data.name] = data.value;
    User.findOneAndUpdate(
        {_id: req.params.id},
        {$set: propery},
        {new: true}
    ).then(user => res.json(user))
})

module.exports = router;