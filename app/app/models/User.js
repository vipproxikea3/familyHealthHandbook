const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        gender: {
            type: Number,
            // 0. Another | 1. Male | 2. Female
            default: 0,
        },
        yearOfBirth: {
            type: Number,
            required: true,
        },
        permission: {
            // Normal. 0 | Admin. 1
            type: Number,
            default: 0,
        },
        avatar: {
            type: String,
        },
    },
    { timestamps: true, collection: 'users' }
);

User.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

User.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
        expiresIn: '1h',
    });
    return token;
};

module.exports = mongoose.model('User', User);
