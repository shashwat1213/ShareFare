import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/MainLayout';
import '../../styles/AppPages.css';

const ExpensesList = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Load expenses from localStorage
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses).reverse());
    }
  }, []);

  const handleDelete = (id) => {
    const updatedExpenses = expenses.filter(e => e.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'you-paid') return expense.paidBy === currentUser.email;
    if (filter === 'you-owe') return expense.splitWith && expense.splitWith.includes(currentUser.email);
    return true;
  });

  return (
    <Layout onLogout={onLogout}>
      <div className="app-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <h1>All Expenses</h1>
          <button className="btn btn-primary" onClick={() => navigate('/add-expense')}>
            + Add Expense
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`tab ${filter === 'you-paid' ? 'active' : ''}`}
            onClick={() => setFilter('you-paid')}
          >
            You Paid
          </button>
          <button
            className={`tab ${filter === 'you-owe' ? 'active' : ''}`}
            onClick={() => setFilter('you-owe')}
          >
            You Owe
          </button>
        </div>

        {/* Expenses List */}
        {filteredExpenses.length > 0 ? (
          <div className="expense-list detailed">
            {filteredExpenses.map(expense => (
              <div key={expense.id} className="expense-item-detailed">
                <div className="expense-left">
                  <div className="expense-icon">
                    {expense.category === 'food' && '🍕'}
                    {expense.category === 'travel' && '🚗'}
                    {expense.category === 'utilities' && '🏠'}
                    {expense.category === 'entertainment' && '🎬'}
                    {expense.category === 'other' && '📌'}
                  </div>
                  <div className="expense-details">
                    <p className="expense-description">{expense.description}</p>
                    <p className="expense-date">{new Date(expense.date).toLocaleDateString()}</p>
                    <p className="expense-meta">Paid by {expense.paidBy}</p>
                  </div>
                </div>

                <div className="expense-right">
                  <div className="expense-amount">
                    <p className="amount">₹{expense.amount.toFixed(2)}</p>
                    {expense.paidBy === currentUser.email ? (
                      <p className="status you-paid">You paid</p>
                    ) : (
                      <p className="status you-owe">
                        You owe ₹{(expense.amount / (expense.splitWith.length + 1)).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(expense.id)}
                    title="Delete expense"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No expenses found</p>
            <button className="btn btn-primary" onClick={() => navigate('/add-expense')}>
              Add Your First Expense
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExpensesList;
