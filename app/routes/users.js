const router = require('express').Router();
const multer = require('multer');
const usersController = require('../server/controllers/usersController');
const fileUploader = require('../server/middleware/uploadMiddleware');

router.post(
    '/register',
    fileUploader.single('avatar'),
    usersController.register
);
router.use(multer().none());
router.post('/login', usersController.login);
router.get('/', usersController.getAll);

module.exports = router;
