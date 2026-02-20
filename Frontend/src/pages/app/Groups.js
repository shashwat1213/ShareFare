import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/MainLayout';
import AddMemberModal from '../../components/AddMemberModal';
import '../../styles/AppPages.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Groups = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
  });

  // Fetch user groups on mount
  useEffect(() => {
    fetchUserGroups();
  }, [currentUser]);

  const fetchUserGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/groups/user?userEmail=${currentUser.email}`
      );
      const data = await response.json();
      if (data.status === 'SUCCESS') {
        setGroups(data.data.groups || []);
      } else {
        setError(data.message || 'Failed to fetch groups');
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Please enter a group name');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          userEmail: currentUser.email,
        }),
      });

      const data = await response.json();
      if (data.status === 'SUCCESS') {
        setFormData({ name: '' });
        setShowForm(false);
        await fetchUserGroups();
      } else {
        setError(data.message || 'Failed to create group');
      }
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        setGroups(groups.filter(g => g.id !== groupId));
        // Note: Add actual delete API call when backend endpoint is ready
      } catch (err) {
        console.error('Error deleting group:', err);
      }
    }
  };

  const handleAddMember = (groupId) => {
    setSelectedGroupId(groupId);
    setShowAddMemberModal(true);
  };

  const handleCopyInviteLink = async (groupId) => {
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}/invite`);
      const data = await response.json();
      if (data.status === 'SUCCESS') {
        navigator.clipboard.writeText(data.data.inviteLink);
        alert('Invite link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error copying invite link:', err);
      alert('Failed to copy invite link');
    }
  };

  return (
    <Layout onLogout={onLogout}>
      <div className="app-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <h1>Groups</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Close' : '+ New Group'}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {loading && <div className="alert alert-info">Loading...</div>}

        {/* Create Group Form */}
        {showForm && (
          <div className="form-wrapper">
            <form onSubmit={handleSubmit} className="group-form">
              <div className="form-group">
                <label htmlFor="name">Group Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Trip to Goa"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Groups List */}
        {groups.length > 0 ? (
          <div className="groups-grid">
            {groups.map(group => (
              <div key={group.id} className="group-card">
                <div className="group-header">
                  <h3>👥 {group.name}</h3>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(group.id)}
                    title="Delete group"
                  >
                    🗑️
                  </button>
                </div>
                <div className="group-body">
                  <p className="group-info"><strong>ID:</strong> {group.id}</p>
                  <div className="group-actions">
                    <button 
                      className="btn btn-secondary btn-small"
                      onClick={() => handleAddMember(group.id)}
                    >
                      + Add Member
                    </button>
                    <button 
                      className="btn btn-secondary btn-small"
                      onClick={() => handleCopyInviteLink(group.id)}
                    >
                      📋 Copy Link
                    </button>
                  </div>
                </div>
                <button className="btn btn-primary btn-full">View Details</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No groups yet. Create one to start splitting expenses!</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Create Your First Group
            </button>
          </div>
        )}

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <AddMemberModal
            groupId={selectedGroupId}
            onClose={() => setShowAddMemberModal(false)}
            onMemberAdded={fetchUserGroups}
          />
        )}
      </div>
    </Layout>
  );
};

export default Groups;
