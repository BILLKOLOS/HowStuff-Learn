const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware'); // To protect routes

// Get dashboard data
router.get('/dashboard', authMiddleware.verifyToken, dashboardController.getDashboard);

// Get parent dashboard data
router.get('/dashboard/parent', 
    authMiddleware.verifyToken,  // Verify the token
    authMiddleware.verifyParent,  // Verify that the user is a parent
    dashboardController.getParentDashboard
);

module.exports = router;
