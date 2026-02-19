import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/MainLayout';
import '../../styles/AppPages.css';

const Groups = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    members: []
  });

  const availableMembers = ['john@example.com', 'jane@example.com', 'mike@example.com', 'sarah@example.com'];

  useEffect(() => {
    // Load groups from localStorage
    const storedGroups = localStorage.getItem('groups');
    if (storedGroups) {
      setGroups(JSON.parse(storedGroups));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberChange = (member) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(member)
        ? prev.members.filter(m => m !== member)
        : [...prev.members, member]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || formData.members.length === 0) {
      alert('Please fill in all fields');
      return;
    }

    const newGroup = {
      id: Date.now(),
      name: formData.name,
      members: [currentUser.email, ...formData.members],
      createdAt: new Date().toISOString(),
      createdBy: currentUser.email
    };

    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));

    setFormData({ name: '', members: [] });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const updatedGroups = groups.filter(g => g.id !== id);
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
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
                />
              </div>

              <div className="form-group">
                <label>Add Members</label>
                <div className="checkbox-group">
                  {availableMembers.map(member => (
                    <label key={member} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.members.includes(member)}
                        onChange={() => handleMemberChange(member)}
                      />
                      <span>{member}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
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
                  <p className="group-info"><strong>Members:</strong> {group.members.length}</p>
                  <div className="members-list">
                    {group.members.map(member => (
                      <span key={member} className="member-badge">
                        {member === currentUser.email ? 'You' : member}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="btn btn-primary btn-full">View Expenses</button>
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
      </div>
    </Layout>
  );
};

export default Groups;
