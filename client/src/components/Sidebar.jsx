import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Transactions', icon: <ReceiptLongIcon />, path: '/transactions' },
  { label: 'Wallet', icon: <AccountBalanceWalletIcon />, path: '/wallet' },
  { label: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
  { label: 'Personal', icon: <PersonIcon />, path: '/personal' },
  { label: 'Message', icon: <MessageIcon />, path: '/message' },
  { label: 'Setting', icon: <SettingsIcon />, path: '/setting' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 100,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 100,
          boxSizing: 'border-box',
          background: '#181C23',
          color: '#fff',
          borderRight: 'none',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#6FFF57', mb: 2 }}>
          J
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => navigate(item.path)}
            sx={{
              mb: 1,
              borderRadius: 2,
              background: location.pathname === item.path ? '#23272F' : 'transparent',
              color: location.pathname === item.path ? '#6FFF57' : '#fff',
              '&:hover': {
                background: '#23272F',
                color: '#6FFF57',
              },
              flexDirection: 'column',
              alignItems: 'center',
              py: 2,
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 0, mb: 0.5 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: 12, textAlign: 'center' }}
              sx={{ m: 0, p: 0 }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 