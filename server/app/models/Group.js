const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Group = new Schema(
    {
        master: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        inviteCode: {
            type: String,
            unique: true,
            default: shortid.generate,
        },
        members: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true, collection: 'groups' }
);

module.exports = mongoose.model('Group', Group);
