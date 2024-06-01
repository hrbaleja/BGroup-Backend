const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const apiRoutes = require('./routes/index');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));