const router = require('express').Router();
const multer = require('multer');
const ncovController = require('../app/controllers/ncovController');

router.use(multer().none());
router.get('/', ncovController.getAll);

module.exports = router;
