const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NetworkSchema = new Schema({
    username: {
        type: String,
        default: "admin"
    },
    field: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
})

module.exports = Network = mongoose.model('networks', NetworkSchema);

