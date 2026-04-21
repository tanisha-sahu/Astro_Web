const express = require('express');
const upload = require('../../middlewares/uploadMiddleware');
const { protect } = require('../../middlewares/authMiddleware');

const router = express.Router();

// @desc    Upload an image
// @route   POST /api/v1/upload
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload a file');
    }

    // Return the relative path to the file
    // Example: /uploads/image-12345.jpg
    const filePath = `/uploads/${req.file.filename}`;
    
    res.status(200).json({
        message: 'File uploaded successfully',
        url: filePath
    });
});

module.exports = router;
