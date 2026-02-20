import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../layouts/MainLayout';
import '../../styles/JoinGroup.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const JoinGroup = ({ currentUser }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (!currentUser || !currentUser.email) {
      setError('Please log in to join a group');
      setLoading(false);
      return;
    }

    joinGroup();
  }, [token, currentUser]);

  const joinGroup = async () => {
    if (!token) {
      setError('Invalid invite link');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/members/join/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: currentUser.email,
        }),
      });

      const data = await response.json();

      if (data.status === 'SUCCESS') {
        setGroupName(data.data.groupName);
        setSuccess(true);

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/app/groups');
        }, 2000);
      } else {
        setError(data.message || 'Failed to join group');
      }
    } catch (err) {
      console.error('Error joining group:', err);
      setError('An error occurred while joining the group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="join-group-container">
        <div className="join-group-card">
          {loading && (
            <div className="join-group-state">
              <div className="spinner"></div>
              <h2>Joining group...</h2>
              <p>Please wait while we process your request</p>
            </div>
          )}

          {error && !loading && (
            <div className="join-group-state">
              <div className="icon-error">❌</div>
              <h2>Unable to Join Group</h2>
              <p className="error-message">{error}</p>
              <div className="action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/app/groups')}
                >
                  Go to Groups
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/app/home')}
                >
                  Go Home
                </button>
              </div>
            </div>
          )}

          {success && !loading && (
            <div className="join-group-state">
              <div className="icon-success">✅</div>
              <h2>Successfully Joined!</h2>
              <p>You have been added to <strong>{groupName}</strong></p>
              <p className="redirect-message">Redirecting to groups page...</p>
              <div className="action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/app/groups')}
                >
                  View Groups
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default JoinGroup;
