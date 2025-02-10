const express = require('express'); 
const router = express.Router();
const searchController = require('../controllers/searchController');

// Change POST to GET for search
router.get('/search', searchController.search); // ✅ Correct function name

module.exports = router;
