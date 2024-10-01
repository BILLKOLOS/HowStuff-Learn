const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Search resources
router.post('/search', searchController.searchResources);

module.exports = router;
