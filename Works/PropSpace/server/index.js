const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/properties', require('./routes/property.routes'));
app.use('/api/upload', require('./routes/upload.routes'));

app.get('/', (req, res) => {
    res.send('PropSpace API is running...');
});

// Database Connection
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/propspace';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        console.log('🚀 Registered API Routes:');
        
        // Print all routes including sub-routers
        if (app._router && app._router.stack) {
            app._router.stack.forEach(middleware => {
                if (middleware.route) { // routes registered directly on the app
                    console.log(`- ${Object.keys(middleware.route.methods).join(',').toUpperCase()} ${middleware.route.path}`);
                } else if (middleware.name === 'router') { // router middleware 
                    const base = middleware.regexp.toString().replace('/^\\', '').replace('\\/?(?=\\/|$)/i', '').replace(/\\\//g, '/');
                    middleware.handle.stack.forEach(handler => {
                        if (handler.route) {
                            const path = handler.route.path;
                            const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
                            console.log(`- ${methods} ${base}${path}`);
                        }
                    });
                }
            });
        }
        
        app.listen(PORT, () => {
            console.log(`📡 Server is LIVE on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('The server will not start without a database connection.');
    });
