const Group = require('../models/Group');
const Post = require('../models/Post');

const groupController = {
    getAll: async (req, res) => {
        try {
            const groups = await Group.find({});
            return res.json(groups);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getById: async (req, res) => {
        try {
            const id = req.params.id;
            const group = await Group.findOne({ _id: id });
            if (!group)
                return res.status(500).json({ msg: 'This group not exist' });
            return res.json(group);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getPost: async (req, res) => {
        try {
            const idUser = req.query.idUser;
            console.log(idUser);
            const idGroup = req.params.idGroup;
            if (!idUser || idUser == '') {
                var posts = await Post.find({ idGroup: idGroup });
                return res.json({ posts: posts });
            } else {
                var posts = await Post.find({
                    idGroup: idGroup,
                    idUser: idUser,
                });
                return res.json({ posts: posts });
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    create: async (req, res) => {
        try {
            const { name, description } = req.body;
            const master = req.user._id;

            var members = [];
            members.push(master);

            const avatar = req.file.path;

            const group = new Group({
                master: master,
                name: name,
                description: description,
                avatar: avatar,
                members: members,
            });

            await group.save();

            return res.json({ group: group });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    kick: async (req, res) => {
        try {
            const { idGroup, idUser } = req.body;
            const master = req.user._id;

            var group = await Group.findById(idGroup).exec();
            if (!group) return res.status(500).json({ msg: 'Group not exist' });
            if (group.master != master)
                return res.status(500).json({
                    msg: 'You need permission to perform this action',
                });
            if (group.master == idUser)
                return res.status(500).json({ msg: 'Can not kick master' });
            var members = group.members;
            if (members.indexOf(idUser) == -1)
                return res
                    .status(500)
                    .json({ msg: 'This user not in this group' });
            members.splice(members.indexOf(idUser), 1);
            group.members = members;
            await group.save();
            return res.json({ group: group });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    transferPermission: async (req, res) => {
        try {
            const { idGroup, idUser } = req.body;
            const master = req.user._id;

            var group = await Group.findById(idGroup).exec();
            if (!group) return res.status(500).json({ msg: 'Group not exist' });
            if (group.master != master)
                return res.status(500).json({
                    msg: 'You need permission to perform this action',
                });
            if (group.master == idUser)
                return res.status(500).json({ msg: 'You are master already' });
            group.master = idUser;
            await group.save();
            return res.json({ group: group });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = groupController;
