require('module-alias/register')
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const apiRoutes = require('./routes/index');
const errorMiddleware = require('./utils/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const path = require('path');
global.__basedir = path.resolve(__dirname);

// Middleware
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Error handler middleware
app.use(errorMiddleware);

app.use(errorHandler);


const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));