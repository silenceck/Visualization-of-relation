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
    gender: {
        type: Boolean,
        required: true
    },
    identity: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    lastLoginTime:{
        type: Date,
        required: true
    }
})

module.exports = User = mongoose.model('users', UserSchema);