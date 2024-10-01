const express = require('express');
const router = express.Router();
const QuorumManagementController = require('../controllers/quorumManagementController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to check if a lecture has enough participants to proceed
router.get('/:id/check', authMiddleware, QuorumManagementController.checkQuorum);

// Route to notify participants if quorum is not met
router.post('/:id/notify-failure', authMiddleware, QuorumManagementController.notifyQuorumFailure);

// Route to set a minimum number of participants required for a lecture
router.patch('/:id/min-participants', authMiddleware, QuorumManagementController.setMinParticipants);

// Route to get a list of participants for a specific lecture
router.get('/:id/participants', authMiddleware, QuorumManagementController.getParticipants);

// Route to reschedule a lecture if quorum is not met
router.post('/reschedule', authMiddleware, QuorumManagementController.rescheduleLecture);

// Route to retrieve quorum history
router.get('/:id/quorum-history', authMiddleware, QuorumManagementController.getQuorumHistory);

// Route to adjust minimum participants based on current participants
router.patch('/:id/adjust-min-participants', authMiddleware, QuorumManagementController.adjustMinParticipants);

// Route to get a summary of quorum checks
router.get('/summary', authMiddleware, QuorumManagementController.getQuorumSummary);

// Route to schedule a check for quorum before the lecture starts
router.post('/:id/schedule-check', authMiddleware, QuorumManagementController.scheduleQuorumCheck);

module.exports = router;

