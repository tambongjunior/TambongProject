const Property = require('../models/property.model');

// Get all properties (Public)
exports.getProperties = async (req, res) => {
    try {
        const { city, minPrice, maxPrice, type } = req.query;
        let query = {};

        if (city) query['location.city'] = { $regex: city, $options: 'i' };
        if (type) query.propertyType = type;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const properties = await Property.find(query).populate('author', 'username email');
        res.json(properties);
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get single property
exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('author', 'username email');
        if (property) {
            res.json(property);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get user's properties (Private)
exports.getMyProperties = async (req, res) => {
    try {
        const properties = await Property.find({ author: req.user._id });
        res.json(properties);
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Create property
exports.createProperty = async (req, res) => {
    try {
        const { title, description, price, city, country, propertyType, imageUrls } = req.body;
        if (!title || !description || price == null || !city || !country || !propertyType) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const property = await Property.create({
            title,
            description,
            price,
            location: { city, country },
            propertyType,
            imageUrls,
            author: req.user._id
        });
        res.status(201).json(property);
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update property
exports.updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Ownership check
        if (property.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to update this listing' });
        }

        const { city, country, ...restBody } = req.body;
        const updateData = { ...restBody, author: req.user._id };

        if (city || country) {
            updateData.location = {
                city: city || property.location.city,
                country: country || property.location.country
            };
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        res.json(updatedProperty);
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete property
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Ownership check
        if (property.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to delete this listing' });
        }

        await property.deleteOne();
        res.json({ message: 'Property removed' });
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
