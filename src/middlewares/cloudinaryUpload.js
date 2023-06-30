const { cloudinary } = require('../config');
const dataUriParser = require('datauri/parser');
const path = require('path');

const cloudinaryUpload = async (req, res, next) => {
  const { file, files, user } = req;

  if (!file && !files) {
    next();
  }

  if (file) {
    console.log('start uploading image to cloudinary');

    try {
      const parser = new dataUriParser();
      const buffer = file.buffer;
      const ext = path.extname(file.originalname).toString();
      const datauri = parser.format(ext, buffer);

      const upload = await cloudinary.uploader.upload(datauri.content, {
        public_id: user.id,
        folder: 'images',
      });

      const uploadedImage = upload.url;
      req.image = uploadedImage;

      console.log('image uploaded');

      next();
    } catch (err) {
      console.log('upload cloudinary error', err);

      return res.error();
    }
  } else if (files) {
    console.log('start uploading images to cloudinary');
    req.images = [];

    const uploadPromises = files.map(async (file) => {
      const parser = new dataUriParser();
      const buffer = file.buffer;
      const ext = path.extname(file.originalname).toString();
      const datauri = parser.format(ext, buffer);

      const upload = await cloudinary.uploader.upload(datauri.content, {
        public_id: `${Math.floor(Math.random() * 10e9)}`,
        folder: 'products',
      });

      return upload.url;
    });

    try {
      const uploadedImages = await Promise.all(uploadPromises);
      req.images = uploadedImages;

      console.log('images uploaded');

      next();
    } catch (err) {
      console.log('upload cloudinary error', err);

      return res.error();
    }
  }
};

module.exports = cloudinaryUpload;
