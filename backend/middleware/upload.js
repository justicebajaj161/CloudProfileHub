const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store in memory for S3 upload

const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

const uploadMiddleware = {
  // Single file upload for profile pictures
  profilePicture: multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
      files: 1
    },
    fileFilter: fileFilter
  }).single('profilePicture'),

  // Multiple file upload (for future use)
  multipleImages: multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB per file
      files: 5 // Maximum 5 files
    },
    fileFilter: fileFilter
  }).array('images', 5),

  // Custom validation middleware
  validateFile: (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Additional file validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum size is 5MB.'
      });
    }

    // Check file dimensions (optional)
    // You could use sharp library here to check image dimensions

    next();
  },

  // Error handling for multer
  handleUploadError: (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File too large. Maximum size is 5MB.'
        });
      }
      
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          error: 'Too many files. Maximum is 5 files.'
        });
      }
      
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          success: false,
          error: 'Unexpected field name for file upload.'
        });
      }
    }
    
    if (err.message.includes('Invalid file type')) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    
    next(err);
  }
};

module.exports = uploadMiddleware;