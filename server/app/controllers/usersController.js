const User = require('../models/User');
const Group = require('../models/Group');
const HealthRecord = require('../models/HealthRecord');
const bcrypt = require('bcrypt');

const userController = {
    getAll: async (req, res) => {
        try {
            const users = await User.find({});
            return res.json(users);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    register: async (req, res) => {
        try {
            const { name, email, password, gender, yearOfBirth } = req.body;

            let user = await User.findOne({ email });

            if (user)
                return res
                    .status(400)
                    .json({ msg: 'This email or username is exist' });

            const newUser = new User({
                name: name,
                email: email,
                password: password,
                gender: gender,
                yearOfBirth: yearOfBirth,
            });

            if (req.file) newUser.avatar = req.file.path;

            await newUser.save();

            return res.json({ user: newUser });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res
                    .status(400)
                    .json({ msg: 'Invalid login credentials' });
            } else if (!bcrypt.compare(password, user.password)) {
                return res
                    .status(400)
                    .json({ msg: 'Invalid login credentials' });
            }
            const token = await user.generateAuthToken();
            const check = await bcrypt.compare(password, user.password);
            return res.json({
                user,
                token,
                check,
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    joinGroup: async (req, res) => {
        try {
            const { inviteCode } = req.body;

            var group = await Group.findOne({ inviteCode });
            if (!group) return res.status(500).json({ msg: 'group not exist' });

            const idUser = req.user._id;
            var members = group.members;
            console.log(idUser);
            console.log(members.find((member) => member == idUser));
            if (members.find((member) => member == idUser) != undefined)
                return res.status(500).json({ msg: 'User joined' });
            members.push(idUser);
            group.members = members;
            await group.save();
            return res.json({ group: group });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getMyGroup: async (req, res) => {
        try {
            const idUser = req.user._id;
            var groups = await Group.find({ master: idUser }).exec();
            return res.json({ groups: groups });
        } catch (err) {
            return res.status(500).join({ msg: err.message });
        }
    },
    getJoinedGroup: async (req, res) => {
        try {
            const idUser = req.user._id;
            var groups = await Group.find({});
            var joinedGroup = groups.filter((group) => {
                const members = group.members;
                return members.find((member) => member == idUser) != undefined;
            });
            return res.json({ groups: joinedGroup });
        } catch (err) {
            return res.status(500).join({ msg: err.message });
        }
    },
    getMyHealthRecord: async (req, res) => {
        try {
            const idUser = req.user._id;
            var healthRecords = await HealthRecord.find({
                idUser: idUser,
            }).exec();
            return res.json({ healthRecords: healthRecords });
        } catch (err) {
            return res.status(500).join({ msg: err.message });
        }
    },
};

module.exports = userController;
