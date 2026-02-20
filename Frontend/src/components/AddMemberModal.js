import React, { useState } from 'react';
import '../styles/Modal.css'; // We'll create this

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AddMemberModal = ({ groupId, onClose, onMemberAdded }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/members/add/${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          requestedByEmail: localStorage.getItem('userEmail') || ''
        }),
      });

      const data = await response.json();
      
      if (data.status === 'SUCCESS') {
        setSuccess(true);
        setEmail('');
        setTimeout(() => {
          onMemberAdded();
          onClose();
        }, 1000);
      } else {
        setError(data.message || 'Failed to add member');
      }
    } catch (err) {
      console.error('Error adding member:', err);
      setError('Failed to add member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Member to Group</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">Member added successfully!</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                disabled={loading || success}
              />
              <small>Enter the email of the person you want to add</small>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || success}
              >
                {loading ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
