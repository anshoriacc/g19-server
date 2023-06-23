const express = require('express');
const router = express.Router();

const { productController } = require('../controllers');

const {
  verifyJWT,
  upload,
  authorize,
  cloudinaryUpload,
} = require('../middlewares');

router.get('/:type', productController.getList);
router.get('/:type/:id', productController.getDetail);

module.exports = router;
