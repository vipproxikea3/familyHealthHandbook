const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Post = new Schema(
    {
        idGroup: {
            type: String,
            required: true,
        },
        idHealthRecord: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, collection: 'posts' }
);

module.exports = mongoose.model('Post', Post);