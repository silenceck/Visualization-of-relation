// login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../models/Profile');

/**
 * @route GET /api/profile/test
 * @description 接口测试
 * @access 
 */
router.get('/test', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({ msg: 'profile works'});
})

/**
 * @route POST /api/profiles/
 * @description 添加profile
 * @access private
 */
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const data = req.body;
    const profileFields = {};
    if(data.type) profileFields.type = data.type;
    if(data.desc) profileFields.desc = data.desc;
    if(data.income) profileFields.income = data.income;
    if(data.expend) profileFields.expend = data.expend;
    if(data.cash) profileFields.cash = data.cash;
    if(data.remark) profileFields.remark = data.remark;
    const profile = Profile(profileFields);
    profile.save().then( profile => {
        res.json(profile);
    })
})

/**
 * @route get /api/profiles/
 * @description 获取所有的profile
 * @access private
 */
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.find()
        .then(profiles => {
            console.log("profiles:", profiles)
            if(!profiles) res.status(404).json("不存在profile");
            res.json(profiles);
        })
        .catch(err => {
            res.status(404).json(err);
        });

    // 下面的代码会出现 TypeError: Converting circular structure to JSON
    // console.log('profiles:', Profile.find());
    // res.json(Profile.find());
})

/**
 * @route get /api/profiles/:id
 * @description 获取单个profile
 * @access private
 */
router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({_id: req.params.id})
        .then(profile => {
            if(!profile) res.status(404).json("不存在profile");
            res.json(profile);
        })
        .catch(err => {
            res.status(404).json(err);
        });

    
})

/**
 * @route POST /api/profiles/edit/:id
 * @description 
 * @access public
 */
router.post('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const data = req.body;
    const profileFields = {};
    if(data.type) profileFields.type = data.type;
    if(data.desc) profileFields.desc = data.desc;
    if(data.income) profileFields.income = data.income;
    if(data.expend) profileFields.expend = data.expend;
    if(data.cash) profileFields.cash = data.cash;
    if(data.remark) profileFields.remark = data.remark;

    Profile.findOneAndUpdate(
        {_id: req.params.id},
        {$set: profileFields},
        {new: true}
    ).then(profile => res.json(profile))
})

/**
 * @route delete /api/profiles/:id
 * @description 获取所有的profile
 * @access private
 */
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOneAndRemove({_id: req.params.id})
        .then(profile => {
            profile.save().then(profile => res.json(profile))
        })
        .catch(err => {
            res.status(404).json(err);
        });

    
})

module.exports = router;