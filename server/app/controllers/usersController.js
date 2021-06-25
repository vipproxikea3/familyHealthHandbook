const User = require('../models/User');
const Group = require('../models/Group');
const HealthRecord = require('../models/HealthRecord');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const bcrypt = require('bcrypt');
const { json } = require('express');
const Pusher = require('pusher');

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});

const userController = {
    getAll: async (req, res) => {
        try {
            const users = await User.find({});
            return res.json(users);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getById: async (req, res) => {
        try {
            const id = req.params.id;
            const user = await User.findOne({ _id: id });
            if (!user)
                return res.status(500).json({ msg: 'This user not exist' });
            return res.json(user);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getMe: async (req, res) => {
        try {
            const id = req.user._id;
            const user = await User.findOne({ _id: id });
            if (!user)
                return res.status(500).json({ msg: 'This user not exist' });
            return res.json(user);
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
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ msg: 'Invalid login credentials' });
            }
            const token = await user.generateAuthToken();
            return res.json({
                user,
                token,
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    update: async (req, res) => {
        try {
            const { name, gender, yearOfBirth } = req.body;
            var user = await User.findOne({ _id: req.user._id });
            user.name = name;
            user.gender = gender;
            user.yearOfBirth = yearOfBirth;
            if (req.file) user.avatar = req.file.path;

            await user.save();

            return res.json({ user });
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

            var user = await User.findOne({ _id: idUser });

            var members = group.members;
            if (members.find((member) => member == idUser) != undefined)
                return res.status(500).json({ msg: 'User joined' });
            members.push(idUser);
            group.members = members;
            await group.save();

            const notification = new Notification({
                user: req.user._id,
                group: group._id,
                action: 1,
            });

            notification.save();

            pusher.trigger('group-channel', 'joinGroup-event', {
                group: group._id,
                type: 0,
                message: user.name + ' vừa tham gia vào nhóm ' + group.name,
            });

            return res.json(group);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    leaveGroup: async (req, res) => {
        try {
            const { idGroup } = req.body;
            var group = await Group.findOne({ _id: idGroup });
            const idUser = req.user._id;
            var user = await User.findOne({ _id: idUser });

            if (!group)
                return res.status(500).json({ msg: 'This group not exist' });

            var members = group.members;

            if (members.indexOf(idUser) == -1)
                return res
                    .status(500)
                    .json({ msg: 'You are not in this group' });

            const notification = new Notification({
                user: req.user._id,
                group: group._id,
                action: 2,
            });

            notification.save();

            pusher.trigger('group-channel', 'leaveGroup-event', {
                group: idGroup,
                type: 0,
                message: user.name + ' vừa rời khỏi nhóm ' + group.name,
            });

            if (group.master != idUser) {
                members.splice(members.indexOf(idUser), 1);
                group.members = members;
                await group.save();
                return res.json(group);
            }

            if (group.master == idUser && members.length != 1) {
                return res.status(500).json({
                    msg: 'You need transfer permission to another member',
                });
            }

            await Group.deleteOne({ _id: idGroup });

            return res.json({ msg: 'Leave successfully' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getMyGroup: async (req, res) => {
        try {
            const idUser = req.user._id;
            var groups = await Group.find({ master: idUser }).exec();
            return res.json(groups);
        } catch (err) {
            return res.status(500).join({ msg: err.message });
        }
    },
    getJoinedGroup: async (req, res) => {
        try {
            const idUser = req.user._id;
            let groups = await Group.find({});
            let joinedGroup = groups.filter((group) => {
                const members = group.members;
                return (
                    members.find(
                        (member) => String(member) == String(idUser)
                    ) != undefined
                );
            });
            return res.json(joinedGroup);
        } catch (err) {
            return res.status(500).join({ msg: err.message });
        }
    },
    getMyHealthRecord: async (req, res) => {
        try {
            const idUser = req.user._id;
            var healthRecords = await HealthRecord.find({
                idUser: idUser,
            }).populate('sickness', 'name');
            return res.json(healthRecords);
        } catch (err) {
            return res.status(500).join({ msg: err.message });
        }
    },
    getMyPost: async (req, res) => {
        try {
            const idUser = req.user._id;
            var posts = await Post.find({
                user: idUser,
            })
                .populate('user', 'name avatar')
                .populate({
                    path: 'healthRecord',
                    select: 'location images createdAt',
                    model: 'HealthRecord',
                    populate: { path: 'sickness', model: 'Sickness' },
                });

            return res.json(posts);
        } catch (err) {
            return res.status(500).join({ msg: err.message });
        }
    },
    getMyNotification: async (req, res) => {
        try {
            const idUser = req.user._id;
            let groups = await Group.find({});
            let joinedGroup = groups.filter((group) => {
                const members = group.members;
                return (
                    members.find(
                        (member) => String(member) == String(idUser)
                    ) != undefined
                );
            });
            var notifications = await Notification.find({
                user: { $ne: idUser },
                group: { $in: joinedGroup },
            })
                .sort({ createdAt: -1 })
                .populate('user', 'name avatar')
                .populate('group', 'name avatar');

            // const newNotifications = notifications.filter((item) => {
            //     if (
            //         joinedGroup.find((element) => {
            //             return element == item.group._id;
            //         }) != undefined &&
            //         item.user._id != idUser
            //     )
            //         return true;
            // });

            return res.json(notifications);
        } catch (err) {
            return res.status(500).join({ msg: err.message });
        }
    },
    // helpMe: async (req, res) => {
    //     const user = User.findById(req.user._id);
    // },
};

module.exports = userController;
