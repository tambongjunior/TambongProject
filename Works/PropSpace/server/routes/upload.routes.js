const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// POST /api/upload - Upload multiple property images
router.post('/', auth, (req, res) => {
    upload.array('images', 6)(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File too large. Max 5MB per image.' });
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({ message: 'Too many files. Max 6 images.' });
            }
            return res.status(400).json({ message: err.message });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const urls = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);

        res.status(201).json({ urls });
    });
});

module.exports = router;
