const mongoose = require('mongoose');
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
        sickness: {
            type: number,
            required: true,
        },
        images: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true, collection: 'healthRecords' }
);

module.exports = mongoose.model('HealthRecord', HealthRecord);
