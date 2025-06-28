import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, InputBase, IconButton, Avatar, Badge, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/user/profile', { withCredentials: true });
        setUser(res.data.data);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    await axios.post('http://localhost:4000/api/auth/logout', {}, { withCredentials: true });
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ background: '#23272F', boxShadow: 'none', borderRadius: 2, mb: 3 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ background: '#181C23', borderRadius: 2, px: 2, py: 0.5, display: 'flex', alignItems: 'center' }}>
            <SearchIcon sx={{ color: '#6FFF57', mr: 1 }} />
            <InputBase placeholder="Search..." sx={{ color: '#fff', width: 150 }} />
          </Box>
          <IconButton>
            <Badge color="success" variant="dot">
              <NotificationsIcon sx={{ color: '#fff' }} />
            </Badge>
          </IconButton>
          <IconButton onClick={handleMenu} sx={{ p: 0 }}>
            <Avatar
              alt={user?.name || 'User'}
              src={user?.photo || ''}
              sx={{ bgcolor: '#6FFF57', color: '#23272F', fontWeight: 'bold' }}
            >
              {!user?.photo && user?.name ? user.name[0] : 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar; 