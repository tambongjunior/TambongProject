const express = require('express');
const router = express.Router();
const { 
    getProperties, 
    getPropertyById, 
    getMyProperties, 
    createProperty, 
    updateProperty, 
    deleteProperty 
} = require('../controllers/property.controller');
const auth = require('../middleware/auth.middleware');

// Public routes
router.get('/', getProperties);
router.get('/detail/:id', getPropertyById);

// Protected routes
router.get('/mine', auth, getMyProperties);
router.post('/', auth, createProperty);
router.put('/:id', auth, updateProperty);
router.delete('/:id', auth, deleteProperty);

module.exports = router;
