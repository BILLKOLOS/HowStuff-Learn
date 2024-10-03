const express = require('express');
const router = express.Router();
const { getAllVRContent, logVRInteraction } = require('../controllers/VRController');

router.get('/content', getAllVRContent);
router.post('/interaction', logVRInteraction);

module.exports = router;
