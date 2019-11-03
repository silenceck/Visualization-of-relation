const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SearchHistorySchema = new Schema({
    username: {
        type: String,
        required: true
    },
    record: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
})

module.exports = SearchHistory = mongoose.model('historys', SearchHistorySchema);

