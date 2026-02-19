import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/MainLayout';
import '../../styles/AppPages.css';

const Dashboard = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({
    totalSpent: 0,
    youOwe: 0,
    oweYou: 0,
  });

  const calculateBalances = useCallback((allExpenses) => {
    let totalSpent = 0;
    let youOwe = 0;
    let userOweYou = 0;

    allExpenses.forEach(expense => {
      if (expense.paidBy === currentUser.email) {
        totalSpent += expense.amount;
      }
      if (expense.splitWith && expense.splitWith.includes(currentUser.email) && expense.paidBy !== currentUser.email) {
        youOwe += expense.amount / (expense.splitWith.length + 1);
      }
    });

    setBalances({
      totalSpent,
      youOwe: parseFloat(youOwe.toFixed(2)),
      oweYou: parseFloat((totalSpent - youOwe).toFixed(2)),
    });
  }, [currentUser.email]);

  useEffect(() => {
    // Load expenses from localStorage
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      const allExpenses = JSON.parse(storedExpenses);
      setExpenses(allExpenses);
      calculateBalances(allExpenses);
    }
  }, [calculateBalances]);

  const recentExpenses = expenses.slice(0, 5);

  return (
    <Layout onLogout={onLogout}>
      <div className="app-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome, {currentUser.name}!</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/add-expense')}>
            + Add Expense
          </button>
        </div>

        {/* Balance Cards */}
        <div className="balance-grid">
          <div className="balance-card total">
            <div className="balance-icon">💰</div>
            <div className="balance-info">
              <p className="balance-label">Total Spent</p>
              <p className="balance-amount">₹{balances.totalSpent.toFixed(2)}</p>
            </div>
          </div>

          <div className="balance-card owe">
            <div className="balance-icon">📤</div>
            <div className="balance-info">
              <p className="balance-label">You Owe</p>
              <p className="balance-amount red">₹{balances.youOwe.toFixed(2)}</p>
            </div>
          </div>

          <div className="balance-card owed">
            <div className="balance-icon">📥</div>
            <div className="balance-info">
              <p className="balance-label">Owed to You</p>
              <p className="balance-amount green">₹{balances.oweYou.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="recent-section">
          <div className="section-header">
            <h2>Recent Expenses</h2>
            <a href="/expenses" className="link-text">View All</a>
          </div>

          {recentExpenses.length > 0 ? (
            <div className="expense-list">
              {recentExpenses.map(expense => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-icon">
                    {expense.category === 'food' && '🍕'}
                    {expense.category === 'travel' && '🚗'}
                    {expense.category === 'utilities' && '🏠'}
                    {expense.category === 'entertainment' && '🎬'}
                    {expense.category === 'other' && '📌'}
                  </div>
                  <div className="expense-details">
                    <p className="expense-description">{expense.description}</p>
                    <p className="expense-meta">{expense.paidBy}</p>
                  </div>
                  <div className="expense-amount">
                    <p className="amount">₹{expense.amount.toFixed(2)}</p>
                    {expense.paidBy === currentUser.email ? (
                      <p className="status you-paid">You paid</p>
                    ) : (
                      <p className="status you-owe">You owe</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No expenses yet. Start by adding an expense!</p>
              <button className="btn btn-primary" onClick={() => navigate('/add-expense')}>
                Add Your First Expense
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="action-btn" onClick={() => navigate('/add-expense')}>
            <span className="icon">➕</span>
            <span>Add Expense</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/settle-up')}>
            <span className="icon">✅</span>
            <span>Settle Up</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/groups')}>
            <span className="icon">👥</span>
            <span>Groups</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/expenses')}>
            <span className="icon">📋</span>
            <span>Expenses</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
