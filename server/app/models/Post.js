const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Post = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        healthRecord: { type: Schema.Types.ObjectId, ref: 'HealthRecord' },
        idGroup: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, collection: 'posts' }
);

Post.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Post', Post);
