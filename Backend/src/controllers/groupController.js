const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Generate secure token
const generateInviteToken = () => uuidv4();

// Create a new group
exports.createGroup = async (req, res) => {
  const { name, userEmail } = req.body;

  if (!name || !userEmail) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Group name and user email are required'
    });
  }

  try {
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

    // Create group with invite token
    const inviteToken = generateInviteToken();
    const groupResult = await db.query(
      'INSERT INTO groups (name, created_by, invite_token) VALUES ($1, $2, $3) RETURNING id, name, created_by, invite_token, created_at',
      [name, userId, inviteToken]
    );

    const group = groupResult.rows[0];

    // Add creator as member
    await db.query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)',
      [group.id, userId]
    );

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Group created successfully',
      data: {
        id: group.id,
        name: group.name,
        createdBy: group.created_by,
        inviteToken: group.invite_token,
        createdAt: group.created_at
      }
    });
  } catch (err) {
    console.error('Error creating group:', err);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to create group',
      error: err.message
    });
  }
};

// Get group details with members
exports.getGroupDetails = async (req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Group ID is required'
    });
  }

  try {
    // Get group info
    const groupResult = await db.query(
      'SELECT id, name, created_by, invite_token, created_at FROM groups WHERE id = $1',
      [groupId]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Group not found'
      });
    }

    const group = groupResult.rows[0];

    // Get members
    const membersResult = await db.query(
      `SELECT u.id, u.name, u.email, gm.joined_at 
       FROM group_members gm
       JOIN users u ON gm.user_id = u.id
       WHERE gm.group_id = $1`,
      [groupId]
    );

    const members = membersResult.rows;

    res.json({
      status: 'SUCCESS',
      data: {
        id: group.id,
        name: group.name,
        createdBy: group.created_by,
        inviteToken: group.invite_token,
        members: members.map(m => ({
          id: m.id,
          name: m.name,
          email: m.email,
          joinedAt: m.joined_at
        })),
        createdAt: group.created_at
      }
    });
  } catch (err) {
    console.error('Error fetching group details:', err);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch group details',
      error: err.message
    });
  }
};

// Get all groups for user
exports.getUserGroups = async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'User email is required'
    });
  }

  try {
    const result = await db.query(
      `SELECT DISTINCT g.id, g.name, g.created_by, g.invite_token, g.created_at
       FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       JOIN users u ON gm.user_id = u.id
       WHERE u.email = $1
       ORDER BY g.created_at DESC`,
      [userEmail]
    );

    const groups = result.rows;

    res.json({
      status: 'SUCCESS',
      data: {
        groups: groups.map(g => ({
          id: g.id,
          name: g.name,
          createdBy: g.created_by,
          inviteToken: g.invite_token,
          createdAt: g.created_at
        }))
      }
    });
  } catch (err) {
    console.error('Error fetching user groups:', err);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch groups',
      error: err.message
    });
  }
};

// Get invite link for group
exports.getInviteLink = async (req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Group ID is required'
    });
  }

  try {
    const result = await db.query(
      'SELECT invite_token FROM groups WHERE id = $1',
      [groupId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Group not found'
      });
    }

    const inviteToken = result.rows[0].invite_token;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const inviteLink = `${frontendUrl}/join/${inviteToken}`;

    res.json({
      status: 'SUCCESS',
      data: {
        inviteLink,
        inviteToken
      }
    });
  } catch (err) {
    console.error('Error fetching invite link:', err);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch invite link',
      error: err.message
    });
  }
};
