const Group = require('../models/Group');

const groupController = {
    getAll: async (req, res) => {
        try {
            const groups = await Group.find({});
            return res.json(groups);
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

            group.save();

            return res.json({ group: group });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = groupController;
