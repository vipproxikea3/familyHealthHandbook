const router = require('express').Router();
const multer = require('multer');
const newsController = require('../server/controllers/newsController');

router.use(multer().none());
// slug in ['tin-tuc', 'tu-van', 'dinh-duong', 'khoe-dep', 'dan-ong', 'cac-benh']
router.get('/:slug', newsController.getBySlug);
router.get('/', newsController.getAll);

module.exports = router;
