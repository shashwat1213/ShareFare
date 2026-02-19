import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/MainLayout';
import '../../styles/AppPages.css';

const AddExpense = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'food',
    paidBy: currentUser.email,
    splitWith: [],
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock list of friends/users
  const friends = ['john@example.com', 'jane@example.com', 'mike@example.com', 'sarah@example.com'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSplitChange = (email) => {
    setFormData(prev => ({
      ...prev,
      splitWith: prev.splitWith.includes(email)
        ? prev.splitWith.filter(e => e !== email)
        : [...prev.splitWith, email]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.description || !formData.amount || formData.splitWith.length === 0) {
        setError('Please fill in all fields and select at least one person to split with');
        setLoading(false);
        return;
      }

      // Create expense
      const expense = {
        id: Date.now(),
        ...formData,
        amount: parseFloat(formData.amount),
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const storedExpenses = localStorage.getItem('expenses');
      const allExpenses = storedExpenses ? JSON.parse(storedExpenses) : [];
      allExpenses.push(expense);
      localStorage.setItem('expenses', JSON.stringify(allExpenses));

      navigate('/dashboard');
    } catch (err) {
      setError('Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout onLogout={onLogout}>
      <div className="app-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <h1>Add Expense</h1>
        </div>

        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Lunch at restaurant"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount">Amount (₹)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="food">🍕 Food</option>
                  <option value="travel">🚗 Travel</option>
                  <option value="utilities">🏠 Utilities</option>
                  <option value="entertainment">🎬 Entertainment</option>
                  <option value="other">📌 Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="paidBy">Paid By</label>
              <select name="paidBy" value={formData.paidBy} onChange={handleChange}>
                <option value={currentUser.email}>{currentUser.name} (You)</option>
                {friends.map(friend => (
                  <option key={friend} value={friend}>{friend}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Split With</label>
              <div className="checkbox-group">
                {friends.map(friend => (
                  <label key={friend} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.splitWith.includes(friend)}
                      onChange={() => handleSplitChange(friend)}
                    />
                    <span>{friend}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddExpense;
