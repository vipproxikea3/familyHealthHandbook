const router = require('express').Router();
const multer = require('multer');
const usersController = require('../app/controllers/usersController');
const fileUploader = require('../app/middleware/uploadMiddleware');

router.post(
    '/register',
    fileUploader.single('avatar'),
    usersController.register
);
router.post('/login', usersController.login);
router.get('/', usersController.getAll);

module.exports = router;
