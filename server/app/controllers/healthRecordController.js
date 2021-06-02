const HealthRecord = require('../models/HealthRecord');

const healthRecordController = {
    getAll: async (req, res) => {
        try {
            const healthRecords = await HealthRecord.find({});
            return res.json(healthRecords);
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

            healthRecord.save();

            return res.json({ healthRecord: healthRecord });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = healthRecordController;
