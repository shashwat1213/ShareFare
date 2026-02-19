import React from 'react';
import '../styles/Home.css';
import Layout from '../layouts/MainLayout';
import Card from '../components/Card';

const Home = () => {
  return (
    <Layout>
      <div className="home-container">
        <section className="hero">
          <h1>Welcome to SHAREFAR.AI</h1>
          <p>A production-ready Node.js + React application</p>
        </section>

        <section className="features">
          <Card title="Backend" className="feature-card">
            <p>Node.js + Express server running on http://localhost:5000</p>
            <p>PostgreSQL database integration with connection pooling</p>
          </Card>

          <Card title="Frontend" className="feature-card">
            <p>React 18 with modern hooks and functional components</p>
            <p>Clean, scalable architecture with modular structure</p>
          </Card>

          <Card title="API Integration" className="feature-card">
            <p>Axios-based API client with interceptors</p>
            <p>Navigate to Dashboard to test API endpoints</p>
          </Card>
        </section>

        <section className="cta">
          <h2>Get Started</h2>
          <p>Navigate to the Dashboard to test your API connection</p>
          <a href="/dashboard" className="link-button">Go to Dashboard →</a>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
