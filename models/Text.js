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
        default: new Date(),
    }
})

module.exports = Text = mongoose.model('texts', TextSchema);

