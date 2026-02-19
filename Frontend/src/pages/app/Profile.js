import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/MainLayout';
import '../../styles/AppPages.css';

const Profile = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <Layout onLogout={onLogout}>
      <div className="app-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <h1>Profile</h1>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">👤</div>
          <div className="profile-info">
            <h2>{currentUser.name}</h2>
            <p className="profile-email">{currentUser.email}</p>
            <p className="profile-joined">Joined {new Date(currentUser.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="profile-actions">
            <button className="btn btn-secondary btn-full">Edit Profile</button>
            <button className="btn btn-secondary btn-full">Change Password</button>
            <button className="btn btn-danger btn-full" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Settings Section */}
        <div className="settings-section">
          <h3>Settings</h3>
          <div className="setting-item">
            <div className="setting-info">
              <p className="setting-label">Notifications</p>
              <p className="setting-desc">Get notified about expenses</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <p className="setting-label">Dark Mode</p>
              <p className="setting-desc">Enable dark theme</p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
