const Notification = require('../models/Notification');
const { json } = require('express');

const postController = {
    getAll: async (req, res) => {
        try {
            const notifications = await Notification.find({})
                .populate('user', 'name avatar')
                .populate('group', 'name avatar');
            return res.json(notifications);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getById: async (req, res) => {
        try {
            const id = req.params.id;
            const notification = await Notification.findOne({ _id: id })
                .populate('user', 'name avatar')
                .populate('group', 'name avatar');
            if (!notification)
                return res
                    .status(500)
                    .json({ msg: 'This notification not exist' });
            return res.json(notification);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = postController;
