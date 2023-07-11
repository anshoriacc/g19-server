const express = require('express');
const router = express.Router();

const { verifyJWT, upload, cloudinaryUpload } = require('../middlewares');
const { profileController } = require('../controllers');

router.patch(
  '/',
  verifyJWT,
  upload.single,
  cloudinaryUpload('profiles', false),
  profileController.update
);

module.exports = router;
