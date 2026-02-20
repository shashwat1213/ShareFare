const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

/**
 * POST /api/members/add/:groupId
 * Add a member to a group
 * Body: { email, requestedByEmail }
 */
router.post('/add/:groupId', memberController.addMember);

/**
 * POST /api/members/join/:token
 * Join group via invite token
 * Body: { userEmail }
 */
router.post('/join/:token', memberController.joinGroupByToken);

/**
 * DELETE /api/members/:groupId/:userId
 * Remove member from group
 * Body: { requestedByEmail }
 */
router.delete('/:groupId/:userId', memberController.removeMember);

/**
 * GET /api/members/:groupId
 * Get all members of a group
 */
router.get('/:groupId', memberController.getGroupMembers);

module.exports = router;
