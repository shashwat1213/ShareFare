import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// App Pages
import DashboardPage from './pages/app/Dashboard';
import AddExpense from './pages/app/AddExpense';
import ExpensesList from './pages/app/ExpensesList';
import Groups from './pages/app/Groups';
import GroupDetails from './pages/app/GroupDetails';
import SettleUp from './pages/app/SettleUp';
import Profile from './pages/app/Profile';

// Other
import JoinGroup from './pages/JoinGroup';
import NotFound from './pages/NotFound';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  };

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />

        {/* Public Route - Join Group (requires auth to join) */}
        <Route path="/join/:token" element={isAuthenticated && currentUser ? <JoinGroup currentUser={currentUser} /> : <Navigate to="/login" />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <>
            <Route path="/" element={<DashboardPage currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/app/dashboard" element={<DashboardPage currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/app/add-expense" element={<AddExpense currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/app/expenses" element={<ExpensesList currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/app/groups" element={<Groups currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/app/groups/:groupId" element={<GroupDetails currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/app/settle-up" element={<SettleUp currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/app/profile" element={<Profile currentUser={currentUser} onLogout={handleLogout} />} />

            {/* Backward compatibility for old routes */}
            <Route path="/dashboard" element={<DashboardPage currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/add-expense" element={<AddExpense currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/expenses" element={<ExpensesList currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/groups" element={<Groups currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/settle-up" element={<SettleUp currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/profile" element={<Profile currentUser={currentUser} onLogout={handleLogout} />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/app/*" element={<Navigate to="/login" />} />
            <Route path="/dashboard" element={<Navigate to="/login" />} />
            <Route path="/add-expense" element={<Navigate to="/login" />} />
            <Route path="/expenses" element={<Navigate to="/login" />} />
            <Route path="/groups" element={<Navigate to="/login" />} />
            <Route path="/settle-up" element={<Navigate to="/login" />} />
            <Route path="/profile" element={<Navigate to="/login" />} />
          </>
        )}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
