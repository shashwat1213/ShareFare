import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../layouts/MainLayout';
import AddMemberModal from '../../components/AddMemberModal';
import apiClient from '../../services/api';
import '../../styles/GroupDetails.css';

const GroupDetails = ({ currentUser, onLogout }) => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Fetch group details on mount
  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const fetchGroupDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/groups/${groupId}`);
      if (response.data.status === 'SUCCESS') {
        setGroup(response.data.data);
        setMembers(response.data.data.members || []);
      } else {
        setError(response.data.message || 'Failed to fetch group details');
      }
    } catch (err) {
      console.error('Error fetching group details:', err);
      setError(err.response?.data?.message || 'Failed to fetch group details');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteLink = async () => {
    try {
      const response = await apiClient.get(`/groups/${groupId}/invite`);
      if (response.data.status === 'SUCCESS') {
        navigator.clipboard.writeText(response.data.data.inviteLink);
        alert('Invite link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error copying invite link:', err);
      alert('Failed to copy invite link');
    }
  };

  const handleMemberAdded = async () => {
    // Refresh members list after adding
    await fetchGroupDetails();
  };

  if (loading) {
    return (
      <Layout onLogout={onLogout}>
        <div className="app-container">
          <div className="loading">Loading group details...</div>
        </div>
      </Layout>
    );
  }

  if (error || !group) {
    return (
      <Layout onLogout={onLogout}>
        <div className="app-container">
          <div className="error-state">
            <p>{error || 'Group not found'}</p>
            <button className="btn btn-primary" onClick={() => navigate('/app/groups')}>
              Back to Groups
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onLogout={onLogout}>
      <div className="app-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/app/groups')}>← Back</button>
          <h1>👥 {group.name}</h1>
          <button className="btn btn-primary" onClick={() => setShowAddMemberModal(true)}>
            + Add Member
          </button>
        </div>

        {/* Group Info Section */}
        <div className="group-info-card">
          <div className="section">
            <h3>Group Information</h3>
            <div className="info-row">
              <label>Group ID:</label>
              <span>{group.id}</span>
            </div>
            <div className="info-row">
              <label>Created:</label>
              <span>{new Date(group.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="info-row">
              <label>Invite Link:</label>
              <button 
                className="btn btn-secondary btn-small"
                onClick={handleCopyInviteLink}
              >
                📋 Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="members-section">
          <div className="section-header">
            <h3>Members ({members.length})</h3>
          </div>

          {members.length > 0 ? (
            <div className="members-list">
              {members.map(member => (
                <div key={member.id} className="member-item">
                  <div className="member-info">
                    <div className="member-name">
                      {member.email === currentUser?.email ? (
                        <span className="you-badge">You</span>
                      ) : null}
                      <span>{member.name}</span>
                    </div>
                    <div className="member-email">{member.email}</div>
                    <div className="member-joined">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-members">
              <p>No members in this group yet.</p>
            </div>
          )}
        </div>

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <AddMemberModal
            groupId={groupId}
            onClose={() => setShowAddMemberModal(false)}
            onMemberAdded={handleMemberAdded}
          />
        )}
      </div>
    </Layout>
  );
};

export default GroupDetails;
