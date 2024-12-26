// routes/pastPaperRouter.js
const express = require('express');
const router = express.Router();
const { fetchPapers, createPaper, createCheckoutSession, downloadPaper } = require('../controllers/papersController');

// Route to fetch past papers based on filters
router.get('/papers', fetchPapers);

// Route to create a new past paper (optional, for admin usage)
router.post('/papers', createPaper);

// Route to create a Stripe checkout session
router.post('/create-checkout-session', createCheckoutSession);

// Route to download a past paper (triggered after successful payment)
router.get('/download/:paperId', downloadPaper);

module.exports = router;
