const express = require('express');
const router = express.Router();

const { bannerController } = require('../controllers');

const { verifyJWT, authorize, cloudinaryUpload } = require('../middlewares');

router.get('/', verifyJWT, authorize.admin, bannerController.getList);
router.post(
  '/',
  verifyJWT,
  authorize.admin,
  cloudinaryUpload('banners', true),
  bannerController.create
);
router.patch(
  '/:id',
  verifyJWT,
  authorize.admin,
  cloudinaryUpload('banners', true),
  bannerController.update
);
router.delete('/:id', verifyJWT, authorize.admin, bannerController.remove);

module.exports = router;
