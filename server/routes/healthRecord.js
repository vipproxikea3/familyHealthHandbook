const router = require('express').Router();
const multer = require('multer');
const healthRecordController = require('../app/controllers/healthRecordController');
const fileUploader = require('../app/middleware/uploadMiddleware');
const auth = require('../app/middleware/auth');

router.post(
    '/',
    fileUploader.array('images', 10),
    auth,
    healthRecordController.create
);
router.use(multer().none());
router.get('/:id', healthRecordController.getById);
router.get('/', healthRecordController.getAll);

module.exports = router;
