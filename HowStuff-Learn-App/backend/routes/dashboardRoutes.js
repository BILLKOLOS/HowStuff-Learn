const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware'); // To protect routes

// Get dashboard data
router.get('/dashboard', authMiddleware.verifyToken, dashboardController.getDashboard);

module.exports = router;
