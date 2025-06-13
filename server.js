const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/index');

// Error handler middleware
const errorHandler = require('./middleware/error');
const errorMiddleware = require('./utils/errorMiddleware');
const errorHandler2 = require('./middleware/errorHandler_v1');


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
app.get('/', (req, res) => {
    res.send('Welcome to my Node.js backend!');
});
app.use('/api/v1', apiRoutes);

// Error handler middleware
// app.use(errorMiddleware);
// app.use(errorHandler);
app.use(errorHandler2)

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Unhandled Rejection: ${err.message}`);
    // Log to database
    const ErrorLogger = require('./utils/errorLogger_V1');
    ErrorLogger.logError(err, null, { errorType: 'UnhandledRejection' });

    // Close server & exit process
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`Uncaught Exception: ${err.message}`);
    // Log to database
    const ErrorLogger = require('./utils/errorLogger_V1');
    ErrorLogger.logError(err, null, { errorType: 'UncaughtException' });

    console.log('Shutting down due to uncaught exception');
    process.exit(1);
});