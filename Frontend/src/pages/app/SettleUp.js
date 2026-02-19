import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/MainLayout';
import '../../styles/AppPages.css';

const SettleUp = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    // Calculate settlements
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      const expenses = JSON.parse(storedExpenses);
      const settleMap = {};

      expenses.forEach(expense => {
        if (expense.paidBy !== currentUser.email && expense.splitWith.includes(currentUser.email)) {
          const split = expense.amount / (expense.splitWith.length + 1);
          if (!settleMap[expense.paidBy]) {
            settleMap[expense.paidBy] = 0;
          }
          settleMap[expense.paidBy] += split;
        } else if (expense.paidBy === currentUser.email && expense.splitWith.length > 0) {
          const split = expense.amount / (expense.splitWith.length + 1);
          expense.splitWith.forEach(member => {
            if (!settleMap[member]) {
              settleMap[member] = 0;
            }
            settleMap[member] -= split;
          });
        }
      });

      const settleList = Object.entries(settleMap)
        .map(([person, amount]) => ({
          person,
          amount: parseFloat(amount.toFixed(2))
        }))
        .filter(item => item.amount !== 0);

      setSettlements(settleList);
    }
  }, [currentUser]);

  const handleSettle = (person) => {
    const updatedSettlements = settlements.filter(s => s.person !== person);
    setSettlements(updatedSettlements);
    alert(`Payment marked as settled with ${person}`);
  };

  return (
    <Layout onLogout={onLogout}>
      <div className="app-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <h1>Settle Up</h1>
        </div>

        {settlements.length > 0 ? (
          <div className="settle-section">
            <div className="settle-header">
              <h2>Pending Settlements</h2>
              <p>Amount you owe or others owe you</p>
            </div>

            <div className="settlement-list">
              {settlements.map((settlement, idx) => (
                <div key={idx} className="settlement-item">
                  <div className="settlement-left">
                    <div className="avatar">👤</div>
                    <div className="settlement-info">
                      <p className="person-name">{settlement.person}</p>
                      {settlement.amount > 0 ? (
                        <p className="settlement-type">You owe ₹{Math.abs(settlement.amount).toFixed(2)}</p>
                      ) : (
                        <p className="settlement-type owes-you">They owe you ₹{Math.abs(settlement.amount).toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                  <div className="settlement-action">
                    <p className={`amount ${settlement.amount > 0 ? 'red' : 'green'}`}>
                      ₹{Math.abs(settlement.amount).toFixed(2)}
                    </p>
                    <button
                      className="btn btn-success"
                      onClick={() => handleSettle(settlement.person)}
                    >
                      Mark Settled
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">✨</div>
            <h2>All Settled!</h2>
            <p>You don't have any pending settlements. Great job!</p>
            <button className="btn btn-primary" onClick={() => navigate('/add-expense')}>
              Add Expense
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SettleUp;
