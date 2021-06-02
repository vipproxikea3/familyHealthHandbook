const router = require('express').Router();
const multer = require('multer');
const postController = require('../app/controllers/postController');
const auth = require('../app/middleware/auth');

router.use(multer().none());
router.post('/', auth, postController.create);
router.get('/', postController.getAll);

module.exports = router;
