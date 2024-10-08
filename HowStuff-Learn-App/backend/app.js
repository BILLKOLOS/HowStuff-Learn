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
const userRoutes = require('./routes/userRoutes');
const contentRoutes = require('./routes/contentRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const learningPathRoutes = require('./routes/learningPathRoutes');
const learningGoalsRoutes = require('./routes/learningGoalsRoutes');
const virtualLectureRoutes = require('./routes/virtualLectureRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');

// Routes
app.use('/api/auth', authRoutes); // For authentication-related routes
app.use('/api/users', userRoutes); // Handles user registration and profiles
app.use('/api/content', contentRoutes); // Fetch and manage educational content
app.use('/api/feedback', feedbackRoutes); // Handle feedback from students/teachers
app.use('/api/learning-path', learningPathRoutes); // Learning paths for different users
app.use('/api/learning-goals', learningGoalsRoutes); // Set and track learning goals
app.use('/api/virtual-lectures', virtualLectureRoutes); // Virtual lecture management
app.use('/api/payments', paymentRoutes); // For handling payments (MPESA, PayPal)

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
