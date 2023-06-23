const express = require('express');
const router = express.Router();

const { verifyJWT, upload, cloudinaryUpload } = require('../middlewares');
const { profileController } = require('../controllers');

router.patch(
  '/:id',
  verifyJWT,
  upload.single,
  cloudinaryUpload,
  profileController.update
);

module.exports = router;
