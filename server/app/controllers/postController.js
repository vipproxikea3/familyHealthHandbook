const Post = require('../models/Post');

const postController = {
    getAll: async (req, res) => {
        try {
            const posts = await Post.find({});
            return res.json(posts);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    create: async (req, res) => {
        try {
            const { idGroup, idHealthRecord } = req.body;

            const post = new Post({
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
