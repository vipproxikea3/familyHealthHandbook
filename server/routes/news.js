const router = require('express').Router();
const multer = require('multer');
const newsController = require('../app/controllers/newsController');

router.use(multer().none());
router.get('/', newsController.getAll);

module.exports = router;
