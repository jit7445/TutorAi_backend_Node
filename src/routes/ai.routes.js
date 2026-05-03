const express = require('express');
const multer = require('multer');
const aiController = require('../controllers/ai.controller');
const path = require('path');
const os = require('os');

const router = express.Router();

// Configure Multer for temporary storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir()); // Use system temp directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

const { verifyInternalSecret, protect } = require('../middlewares/auth.middleware');

// Route: POST /api/v1/ai/jobs
router.post('/jobs', protect, upload.single('file'), aiController.createJob);

// Route: POST /api/v1/ai/callback (Called by FastAPI)
router.post('/callback', verifyInternalSecret, aiController.handleCallback);

module.exports = router;
