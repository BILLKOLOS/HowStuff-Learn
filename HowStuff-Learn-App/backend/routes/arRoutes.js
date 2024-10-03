const express = require('express');
const router = express.Router();
const { getAllARContent, logARInteraction } = require('../controllers/ARController');

router.get('/content', getAllARContent);
router.post('/interaction', logARInteraction);

module.exports = router;
