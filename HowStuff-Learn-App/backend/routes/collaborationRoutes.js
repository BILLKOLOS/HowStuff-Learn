const express = require('express');
const router = express.Router();
const CollaborationController = require('../controllers/CollaborationController');

// Create a study group
router.post('/study-groups', CollaborationController.createStudyGroup);

// Add resources to a study group
router.post('/study-groups/:id/resources', CollaborationController.addStudyGroupResources);

// Get resources for a study group
router.get('/study-groups/:id/resources', CollaborationController.getStudyGroupResources);

// Create a poll for a study group
router.post('/study-groups/:id/polls', CollaborationController.createPoll);

// Get all polls for a study group
router.get('/study-groups/:id/polls', CollaborationController.getPolls);

// Vote on a poll
router.post('/study-groups/:id/polls/:pollIndex/vote', CollaborationController.voteOnPoll);

// Get poll results
router.get('/study-groups/:id/polls/:pollIndex/results', CollaborationController.getPollResults);

// Archive a study group
router.patch('/study-groups/:id/archive', CollaborationController.archiveStudyGroup);

// Unarchive a study group
router.patch('/study-groups/:id/unarchive', CollaborationController.unarchiveStudyGroup);

// Get archived study groups
router.get('/study-groups/archived', CollaborationController.getArchivedStudyGroups);

module.exports = router;

