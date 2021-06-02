const router = require('express').Router();
const multer = require('multer');
const sicknessController = require('../app/controllers/sicknessController');

router.use(multer().none());
router.get('/', sicknessController.getAll);
router.get('/:id', sicknessController.getById);
router.get('/search', sicknessController.searchByName);

module.exports = router;
