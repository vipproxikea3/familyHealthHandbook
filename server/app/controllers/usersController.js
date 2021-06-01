const User = require('../models/User');
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
};

module.exports = userController;
