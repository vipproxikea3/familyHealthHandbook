const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Notification = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        group: { type: Schema.Types.ObjectId, ref: 'Group' },
        // 0. Create post | 1. Join group
        action: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true, collection: 'notifications' }
);

Notification.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Notification', Notification);
