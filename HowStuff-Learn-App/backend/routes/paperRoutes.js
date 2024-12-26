// routes/pastPaperRouter.js

const express = require('express');
const { fetchPapers, createPaper } = require('../controllers/papersController');
const router = express.Router();

// Route to fetch past papers based on filters
router.get('/papers', fetchPapers);

// Route to create a new past paper (optional, for admin usage)
router.post('/papers', createPaper);

module.exports = router;
