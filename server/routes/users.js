const router = require('express').Router();
const multer = require('multer');
const usersController = require('../app/controllers/usersController');
const fileUploader = require('../app/middleware/uploadMiddleware');
const auth = require('../app/middleware/auth');

router.post(
    '/register',
    fileUploader.single('avatar'),
    usersController.register
);
router.use(multer().none());
router.post('/login', usersController.login);
router.post('/join', auth, usersController.joinGroup);
router.get('/my-groups', auth, usersController.getMyGroup);
router.get('/joined-groups', auth, usersController.getJoinedGroup);
router.get('/my-health-records', auth, usersController.getMyHealthRecord);
router.get('/', usersController.getAll);

module.exports = router;
