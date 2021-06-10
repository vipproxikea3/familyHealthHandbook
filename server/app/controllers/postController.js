const Post = require('../models/Post');
const HealthRecord = require('../models/HealthRecord');
const { json } = require('express');

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

            const idUser = req.user._id;

            const post = new Post({
                user: idUser,
                idGroup: idGroup,
                healthRecord: idHealthRecord,
            });

            await post.save();

            return res.json({ post: post });
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
