const cloudinary = require('cloudinary').v2;

// lay anh tu client gui len
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// luu files and upload
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAM,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params : {
    allowedFormats: ['jpg', 'png'],
    folder : "cuahangdientu"
  }
});
const uploadCloud = multer({ storage });

module.exports = uploadCloud;
