const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

/**
 * POST /api/groups
 * Create a new group
 * Body: { name, userEmail }
 */
router.post('/', groupController.createGroup);

/**
 * GET /api/groups/user?userEmail=email
 * Get all groups for a user
 */
router.get('/user', groupController.getUserGroups);

/**
 * GET /api/groups/:groupId
 * Get group details with members
 */
router.get('/:groupId', groupController.getGroupDetails);

/**
 * GET /api/groups/:groupId/invite
 * Get invite link for group
 */
router.get('/:groupId/invite', groupController.getInviteLink);

module.exports = router;
