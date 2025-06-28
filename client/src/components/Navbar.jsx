import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#010A26', // Fully opaque dark blue
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        color: 'white',
      }}
    >
      <div
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        FinSight.
      </div>

      <Button
        variant="contained"
        onClick={handleLoginClick}
        sx={{
          backgroundColor: '#1976D2', // Blue button
          '&:hover': {
            backgroundColor: '#115293',
          },
          padding: '0.5rem 1.5rem',
          borderRadius: '5px',
          textTransform: 'none',
          fontSize: '1rem',
        }}
      >
        Login
      </Button>
    </div>
  );
};

export default Navbar;
