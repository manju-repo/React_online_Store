const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Images/'); // Define the destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Define the filename
  }
});

// Create multer instance with storage configuration
const upload = multer({storage});
console.log('upload defined');
const multipleUpload = multer({ storage }).fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  { name: 'image5', maxCount: 1 }
]);
console.log('multiple upload defined');

module.exports = {upload, multipleUpload};
