const router = require('express').Router();
const multer = require('multer');
const notificationController = require('../app/controllers/notificationController');
const auth = require('../app/middleware/auth');

router.use(multer().none());
router.get('/:id', notificationController.getById);
router.get('/', notificationController.getAll);

module.exports = router;
