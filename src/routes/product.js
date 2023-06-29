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
router.post(
  '/:type',
  verifyJWT,
  authorize.admin,
  upload.multiple,
  cloudinaryUpload,
  productController.create
);
router.patch(
  '/:type/:id',
  verifyJWT,
  authorize.admin,
  upload.multiple,
  cloudinaryUpload,
  productController.update
);
router.delete(
  '/:type/:id',
  verifyJWT,
  authorize.admin,
  productController.remove
);

module.exports = router;
