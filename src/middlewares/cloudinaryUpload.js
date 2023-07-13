const dataUriParser = require('datauri/parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const { cloudinary } = require('../config');

const cloudinaryUpload = (folderName, random) => async (req, res, next) => {
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
        public_id: random ? uuidv4() : user.id,
        folder: folderName,
      });

      const uploadedImage = `https${upload.url.slice(4)}`;
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
        public_id: uuidv4(),
        folder: folderName,
      });

      return `https${upload.url.slice(4)}`;
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
