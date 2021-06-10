const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const HealthRecord = new Schema(
    {
        idUser: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        sickness: { type: Schema.Types.ObjectId, ref: 'Sickness' },
        images: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true, collection: 'healthRecords' }
);

HealthRecord.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('HealthRecord', HealthRecord);
