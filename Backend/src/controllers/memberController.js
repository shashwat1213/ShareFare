const db = require('../config/db');

// Add member to group
exports.addMember = async (req, res) => {
  const { groupId } = req.params;
  const { email, requestedByEmail } = req.body;

  if (!groupId || !email) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Group ID and email are required'
    });
  }

  try {
    // Get group info
    const groupResult = await db.query(
      'SELECT id, created_by FROM groups WHERE id = $1',
      [groupId]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Group not found'
      });
    }

    const group = groupResult.rows[0];

    // Verify requester is group member or creator
    if (requestedByEmail) {
      const requesterResult = await db.query(
        `SELECT u.id FROM users u
         LEFT JOIN group_members gm ON u.id = gm.user_id AND gm.group_id = $1
         WHERE u.email = $2`,
        [groupId, requestedByEmail]
      );

      if (requesterResult.rows.length === 0) {
        return res.status(403).json({
          status: 'ERROR',
          message: 'You are not a member of this group'
        });
      }
    }

    // Check if user exists
    let userResult = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'User with this email does not exist'
      });
    }

    const userId = userResult.rows[0].id;

    // Check if user is already a member
    const memberCheck = await db.query(
      'SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );

    if (memberCheck.rows.length > 0) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'User is already a member of this group'
      });
    }

    // Add member
    await db.query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)',
      [groupId, userId]
    );

    res.json({
      status: 'SUCCESS',
      message: 'Member added successfully',
      data: {
        groupId,
        userId,
        email
      }
    });
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to add member',
      error: err.message
    });
  }
};

// Join group via invite token
exports.joinGroupByToken = async (req, res) => {
  const { token } = req.params;
  const { userEmail } = req.body;

  if (!token || !userEmail) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Token and user email are required'
    });
  }

  try {
    // Verify token and get group
    const groupResult = await db.query(
      'SELECT id FROM groups WHERE invite_token = $1',
      [token]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Invalid or expired invite token'
      });
    }

    const groupId = groupResult.rows[0].id;

    // Get or create user
    let userResult = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [userEmail]
    );

    let userId;
    if (userResult.rows.length === 0) {
      const createUserResult = await db.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
        [userEmail.split('@')[0], userEmail]
      );
      userId = createUserResult.rows[0].id;
    } else {
      userId = userResult.rows[0].id;
    }

    // Check if already a member
    const memberCheck = await db.query(
      'SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );

    if (memberCheck.rows.length > 0) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'You are already a member of this group'
      });
    }

    // Add user to group
    await db.query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)',
      [groupId, userId]
    );

    // Get group details
    const groupDetailsResult = await db.query(
      'SELECT id, name FROM groups WHERE id = $1',
      [groupId]
    );

    res.json({
      status: 'SUCCESS',
      message: 'Successfully joined group',
      data: {
        groupId,
        groupName: groupDetailsResult.rows[0].name,
        userEmail
      }
    });
  } catch (err) {
    console.error('Error joining group:', err);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to join group',
      error: err.message
    });
  }
};

// Remove member from group
exports.removeMember = async (req, res) => {
  const { groupId, userId } = req.params;
  const { requestedByEmail } = req.body;

  if (!groupId || !userId) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Group ID and user ID are required'
    });
  }

  try {
    // Verify requester is group creator
    const groupResult = await db.query(
      'SELECT created_by FROM groups WHERE id = $1',
      [groupId]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Group not found'
      });
    }

    if (requestedByEmail) {
      const requesterResult = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [requestedByEmail]
      );

      if (requesterResult.rows.length === 0 || requesterResult.rows[0].id !== groupResult.rows[0].created_by) {
        return res.status(403).json({
          status: 'ERROR',
          message: 'Only group creator can remove members'
        });
      }
    }

    // Remove member
    await db.query(
      'DELETE FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );

    res.json({
      status: 'SUCCESS',
      message: 'Member removed successfully'
    });
  } catch (err) {
    console.error('Error removing member:', err);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to remove member',
      error: err.message
    });
  }
};

// Get group members
exports.getGroupMembers = async (req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Group ID is required'
    });
  }

  try {
    const result = await db.query(
      `SELECT u.id, u.name, u.email, gm.joined_at
       FROM group_members gm
       JOIN users u ON gm.user_id = u.id
       WHERE gm.group_id = $1
       ORDER BY gm.joined_at ASC`,
      [groupId]
    );

    res.json({
      status: 'SUCCESS',
      data: {
        members: result.rows.map(m => ({
          id: m.id,
          name: m.name,
          email: m.email,
          joinedAt: m.joined_at
        }))
      }
    });
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch members',
      error: err.message
    });
  }
};
