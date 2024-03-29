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
router.put(
    '/update',
    auth,
    fileUploader.single('avatar'),
    usersController.update
);
router.use(multer().none());
router.post('/login', usersController.login);
router.post('/join', auth, usersController.joinGroup);
router.post('/leave', auth, usersController.leaveGroup);
router.get('/my-groups', auth, usersController.getMyGroup);
router.get('/joined-groups', auth, usersController.getJoinedGroup);
router.get('/health-records', auth, usersController.getMyHealthRecord);
router.get('/posts', auth, usersController.getMyPost);
router.get('/notifications', auth, usersController.getMyNotification);
router.post('/help-me', auth, usersController.helpMe);
router.get('/me', auth, usersController.getMe);
router.get('/:id', usersController.getById);
router.get('/', usersController.getAll);

module.exports = router;
