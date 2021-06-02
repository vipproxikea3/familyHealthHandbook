const Post = require('../models/Post');
const HealthRecord = require('../models/HealthRecord');

const postController = {
    getAll: async (req, res) => {
        try {
            const posts = await Post.find({});
            return res.json(posts);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getById: async (req, res) => {
        try {
            const id = req.params.id;
            const post = await Post.findOne({ _id: id });
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

            const healthRecord = await HealthRecord.findOne({
                _id: idHealthRecord,
            });

            const post = new Post({
                idUser: healthRecord.idUser,
                idGroup: idGroup,
                idHealthRecord: idHealthRecord,
            });

            await post.save();

            return res.json({ post: post });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = postController;
