import React from 'react';
import '../styles/NotFound.css';
import Layout from '../layouts/MainLayout';

const NotFound = () => {
  return (
    <Layout>
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2>Page Not Found</h2>
          <p>Sorry, the page you're looking for doesn't exist.</p>
          
          <div className="not-found-actions">
            <a href="/" className="link-button">← Back to Home</a>
            <a href="/dashboard" className="link-button">Go to Dashboard</a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
