const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TextSchema = new Schema({
    username: {
        type: String,
        required: "admin"
    },
    content: {
        type: String,
        required: true
    },
    keyword1: {
        type: String,
        require: true
    },
    keyword2: {
        type: String,
        require: true
    },
    relation: {
        type: String,
        require: true
    },
    time: {
        type: Date,
        required: true
    }
})

module.exports = Text = mongoose.model('texts', TextSchema);

