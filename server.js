require('module-alias/register');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const apiRoutes = require('./routes/index');
const errorMiddleware = require('./utils/errorMiddleware');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
global.__basedir = path.resolve(__dirname);

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('Hello B group Pvt. Ltd');
});

// Routes
app.use('/api/v1', apiRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
    console.error('Error stack:', err.stack);
    console.error('Error message:', err.message);
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
