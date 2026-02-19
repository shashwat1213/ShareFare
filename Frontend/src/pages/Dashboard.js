import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import Layout from '../layouts/MainLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { getHealth, testDatabase } from '../services/api';

const Dashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [dbTestData, setDbTestData] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [loadingDb, setLoadingDb] = useState(false);
  const [errorHealth, setErrorHealth] = useState(null);
  const [errorDb, setErrorDb] = useState(null);

  // Fetch health endpoint
  const handleHealthCheck = async () => {
    setLoadingHealth(true);
    setErrorHealth(null);
    setHealthData(null);
    try {
      const response = await getHealth();
      setHealthData(response.data);
    } catch (err) {
      setErrorHealth(err.message || 'Failed to fetch health data');
      console.error('Health check error:', err);
    } finally {
      setLoadingHealth(false);
    }
  };

  // Fetch database test endpoint
  const handleDbTest = async () => {
    setLoadingDb(true);
    setErrorDb(null);
    setDbTestData(null);
    try {
      const response = await testDatabase();
      setDbTestData(response.data);
    } catch (err) {
      setErrorDb(err.message || 'Failed to test database');
      console.error('Database test error:', err);
    } finally {
      setLoadingDb(false);
    }
  };

  // Auto-fetch on component mount
  useEffect(() => {
    handleHealthCheck();
    handleDbTest();
  }, []);

  return (
    <Layout>
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <p className="subtitle">Test your backend API endpoints</p>

        <div className="dashboard-grid">
          {/* Health Check Card */}
          <Card title="🏥 Server Health Check" className="dashboard-card">
            <p className="endpoint-label">GET /api/health</p>
            
            {loadingHealth && <p className="status-loading">⏳ Loading...</p>}
            
            {errorHealth && (
              <div className="status-error">
                <p>❌ Error: {errorHealth}</p>
              </div>
            )}
            
            {healthData && (
              <div className="status-success">
                <p>✅ Status: {healthData.status}</p>
                <div className="data-display">
                  <p><strong>Uptime:</strong> {healthData.uptime.toFixed(2)}s</p>
                  <p><strong>Environment:</strong> {healthData.environment}</p>
                  <p><strong>Timestamp:</strong> {new Date(healthData.timestamp).toLocaleString()}</p>
                  <p><strong>Message:</strong> {healthData.message}</p>
                </div>
              </div>
            )}
            
            <div className="button-group">
              <Button 
                onClick={handleHealthCheck}
                disabled={loadingHealth}
              >
                {loadingHealth ? 'Testing...' : 'Test Health'}
              </Button>
            </div>
          </Card>

          {/* Database Test Card */}
          <Card title="🗄️ Database Connection Test" className="dashboard-card">
            <p className="endpoint-label">GET /api/db-test</p>
            
            {loadingDb && <p className="status-loading">⏳ Loading...</p>}
            
            {errorDb && (
              <div className="status-error">
                <p>❌ Error: {errorDb}</p>
              </div>
            )}
            
            {dbTestData && (
              <div className="status-success">
                <p>✅ Status: {dbTestData.status}</p>
                <div className="data-display">
                  <p><strong>Database:</strong> {dbTestData.database}</p>
                  <p><strong>Host:</strong> {dbTestData.host}</p>
                  <p><strong>Message:</strong> {dbTestData.message}</p>
                </div>
              </div>
            )}
            
            <div className="button-group">
              <Button 
                onClick={handleDbTest}
                disabled={loadingDb}
              >
                {loadingDb ? 'Testing...' : 'Test Database'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Raw Response Display */}
        <Card title="📋 Raw API Response" className="response-card">
          <div className="response-container">
            <div className="response-section">
              <h3>/api/health</h3>
              <pre>
                {healthData ? 
                  JSON.stringify(healthData, null, 2) : 
                  'No data yet'}
              </pre>
            </div>
            
            <div className="response-section">
              <h3>/api/db-test</h3>
              <pre>
                {dbTestData ? 
                  JSON.stringify(dbTestData, null, 2) : 
                  'No data yet'}
              </pre>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
