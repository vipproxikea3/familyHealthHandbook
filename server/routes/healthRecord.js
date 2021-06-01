const router = require('express').Router();
const multer = require('multer');
const healthRecordController = require('../app/controllers/healthRecordController');
const fileUploader = require('../app/middleware/uploadMiddleware');

router.post('/', fileUploader.single('avatar'), usersController.register);
router.use(multer().none());
router.post('/login', usersController.login);
router.get('/', usersController.getAll);

module.exports = router;
