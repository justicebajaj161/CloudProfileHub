const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// POST /api/upload/profile-picture - Upload profile picture
router.post('/profile-picture', upload.single('profilePicture'), uploadController.uploadProfilePicture);

// POST /api/upload/signed-url - Get signed URL for direct upload
router.post('/signed-url', uploadController.getSignedUrl);

module.exports = router;