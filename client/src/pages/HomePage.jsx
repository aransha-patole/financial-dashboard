import React from 'react';
import Navbar from '../components/Navbar';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#010A26', // darkest blue
        fontFamily: 'Segoe UI, Roboto, sans-serif',
      }}
    >
      {/* Opaque Navbar */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(6px)',
          padding: '1rem 2rem',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.2rem',
        }}
      >
        <Navbar />
      </div>

      {/* Main Card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 80px)',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // opaque box
            padding: '3rem',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            maxWidth: '700px',
            width: '100%',
          }}
        >
          <h1
            style={{
              fontSize: '2.5rem',
              color: '#010A26',
              marginBottom: '1rem',
              fontWeight: '700',
            }}
          >
            Welcome to Financial Analytics Dashboard
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              color: '#333',
              lineHeight: '1.6',
              marginBottom: '2rem',
            }}
          >
            Your one-stop solution for deep insights, visualizations, and reports.
            Login to begin your journey.
          </p>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ borderRadius: '8px', paddingX: '2rem', mb: 3, mr: 2 }}
          >
            Get Started
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ borderRadius: '8px', paddingX: '2rem', mb: 3 }}
          >
            Register
          </Button>

          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '2rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#E3F2FD',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #90caf9',
                flex: '1',
                minWidth: '240px',
              }}
            >
              <h3 style={{ color: '#1976D2', marginBottom: '0.5rem' }}>
                📊 Analytics
              </h3>
              <p style={{ color: '#555', fontSize: '0.95rem' }}>
                Track your performance trends and key financial metrics.
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#F3E5F5',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #ce93d8',
                flex: '1',
                minWidth: '240px',
              }}
            >
              <h3 style={{ color: '#7B1FA2', marginBottom: '0.5rem' }}>
                📈 Insights
              </h3>
              <p style={{ color: '#555', fontSize: '0.95rem' }}>
                Real-time data to support your best financial decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
