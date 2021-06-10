const HealthRecord = require('../models/HealthRecord');
const Post = require('../models/Post');
const User = require('../models/User');

const healthRecordController = {
    getAll: async (req, res) => {
        try {
            const healthRecords = await HealthRecord.find({}).populate(
                'sickness'
            );
            return res.json(healthRecords);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getById: async (req, res) => {
        try {
            const id = req.params.id;
            const healthRecord = await HealthRecord.findOne({ _id: id });
            if (!healthRecord)
                return res
                    .status(500)
                    .json({ msg: 'This health record not exist' });
            return res.json(healthRecord);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    create: async (req, res) => {
        try {
            const { location, sickness } = req.body;
            const idUser = req.user._id;

            const images = req.files.map((item) => {
                return item.path;
            });

            const healthRecord = new HealthRecord({
                idUser: idUser,
                location: location,
                sickness: sickness,
                images: images,
            });

            await healthRecord.save();

            return res.json({ healthRecord: healthRecord });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const idUser = req.user._id;

            var healthRecord = await HealthRecord.findOne({ _id: id });
            if (!healthRecord)
                return res
                    .status(500)
                    .json({ msg: 'This health record not exist' });

            if (healthRecord.idUser != idUser)
                return res.status(500).json({
                    msg: 'You need permission to perform this action',
                });
            await HealthRecord.deleteOne({ _id: id });
            await Post.deleteMany({ healthRecord: id });
            return res.json({ msg: 'delete successfully' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = healthRecordController;
