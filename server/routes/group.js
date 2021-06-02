const router = require('express').Router();
const multer = require('multer');
const groupController = require('../app/controllers/groupController');
const fileUploader = require('../app/middleware/uploadMiddleware');
const auth = require('../app/middleware/auth');

router.post('/', fileUploader.single('avatar'), auth, groupController.create);
router.use(multer().none());
router.post('/kick', auth, groupController.kick);
router.post('/transfer-permission', auth, groupController.transferPermission);
router.get('/', groupController.getAll);

module.exports = router;