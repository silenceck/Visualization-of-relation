const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TextSchema = new Schema({
    username: {
        type: String,
        default: "admin"
    },
    content: {
        type: String,
        required: true
    },
    field: {
        type: String,
        require: true
    },
    time: {
        type: Date,
        required: true
    }
})

module.exports = Text = mongoose.model('texts', TextSchema);

