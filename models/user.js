const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    identity: {
        type: String,
        required: true,
    },
    // user creation time 
    date: {
        type: Date,
        default: Date.now()
    },
    lastLoginTime:{
        type: Date,
    }
})

module.exports = User = mongoose.model('users', UserSchema);