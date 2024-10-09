// app.js

// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Session management
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: false }, // Set to true for HTTPS
}));

// Import routes
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const userRoutes = require('./routes/userRoutes'); // User management
const contentRoutes = require('./routes/contentRoutes'); // Educational content management
const feedbackRoutes = require('./routes/feedbackRoutes'); // Feedback handling
const learningPathRoutes = require('./routes/learningPathRoutes'); // Learning paths management
const virtualLectureRoutes = require('./routes/virtualLectureRoutes'); // Virtual lecture management
const paymentRoutes = require('./routes/paymentRoutes'); // Payment handling
const projectRoutes = require('./routes/projectRoutes'); // Project management
const collaborationRoutes = require('./routes/collaborationRoutes'); // Collaboration features
const communityRoutes = require('./routes/communityRoutes'); // Community interactions

// Routes
app.use('/auth', authRoutes); // For authentication-related routes
app.use('/users', userRoutes); // Handles user registration and profiles
app.use('/content', contentRoutes); // Fetch and manage educational content
app.use('/feedback', feedbackRoutes); // Handle feedback from students/teachers
app.use('/learning-path', learningPathRoutes); // Learning paths for different users
app.use('/virtual-lectures', virtualLectureRoutes); // Virtual lecture management
app.use('/payments', paymentRoutes); // For handling payments (MPESA, PayPal)
app.use('/projects', projectRoutes); // For managing projects
app.use('/collaboration', collaborationRoutes); // For collaboration features
app.use('/community', communityRoutes); // For community interactions

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'An internal server error occurred!' });
});

// 404 Error handling
app.use((req, res, next) => {
    res.status(404).send({ message: 'Route not found!' });
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
