const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Sickness = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true, collection: 'sicknesses' }
);

module.exports = mongoose.model('Sickness', Sickness);
