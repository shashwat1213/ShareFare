const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const memberController = require('../controllers/memberController');

/**
 * POST /api/groups
 * Create a new group
 * Body: { name }
 */
router.post('/', groupController.createGroup);

/**
 * GET /api/groups/user
 * Get all groups for authenticated user
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

/**
 * POST /api/groups/:groupId/members
 * Add member to group by email
 * Body: { email }
 */
router.post('/:groupId/members', memberController.addMember);

module.exports = router;
