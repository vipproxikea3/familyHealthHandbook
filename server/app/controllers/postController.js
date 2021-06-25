const Post = require('../models/Post');
const HealthRecord = require('../models/HealthRecord');
const Group = require('../models/Group');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { json } = require('express');
const Pusher = require('pusher');

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});

const postController = {
    getAll: async (req, res) => {
        try {
            const posts = await Post.find({})
                .populate('user', 'name avatar')
                .populate({
                    path: 'healthRecord',
                    select: 'location images createdAt',
                    model: 'HealthRecord',
                    populate: { path: 'sickness', model: 'Sickness' },
                });
            return res.json(posts);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getById: async (req, res) => {
        try {
            const id = req.params.id;
            const post = await Post.findOne({ _id: id })
                .populate('user', 'name avatar')
                .populate({
                    path: 'healthRecord',
                    select: 'location images createdAt',
                    model: 'HealthRecord',
                    populate: { path: 'sickness', model: 'Sickness' },
                });
            if (!post)
                return res.status(500).json({ msg: 'This post not exist' });
            return res.json(post);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    create: async (req, res) => {
        try {
            const { idGroup, idHealthRecord } = req.body;

            let results = await Promise.all([
                await Group.findOne({ _id: idGroup }),
                await HealthRecord.findOne({
                    _id: idHealthRecord,
                }),
                await User.findOne({ _id: req.user._id }),
                await Post.findOne({
                    idGroup: idGroup,
                    healthRecord: idHealthRecord,
                }),
            ]);

            let group = results[0];
            let healthRecord = results[1];
            let user = results[2];
            let checkPost = results[3];

            if (!group)
                return res.status(500).json({ msg: 'This group is not exist' });

            if (!healthRecord)
                return res
                    .status(500)
                    .json({ msg: 'This health record is not exist' });

            if (checkPost)
                return res.status(500).json({ msg: 'This post is exist' });

            const post = new Post({
                user: req.user._id,
                idGroup: idGroup,
                healthRecord: idHealthRecord,
            });

            post.save();

            const notification = new Notification({
                user: req.user._id,
                group: idGroup,
                action: 0,
            });

            notification.save();

            pusher.trigger('group-channel', 'createPost-event', {
                type: 0,
                information: {
                    user: user,
                    group: group,
                    action: 0,
                },
            });

            return res.json(post);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const idUser = req.user._id;

            var post = await Post.findOne({ _id: id });
            if (!post)
                return res.status(500).json({ msg: 'This post not exist' });

            if (post.idUser != idUser)
                return res.status(500).json({
                    msg: 'You need permission to perform this action',
                });
            await Post.deleteOne({ _id: id });
            return res.json({ msg: 'delete successfully' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = postController;
