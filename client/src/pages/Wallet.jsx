import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, CircularProgress } from '@mui/material';
import axios from 'axios';

const Wallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    setLoading(true);
    const [entriesRes, analyticsRes] = await Promise.all([
      axios.get('http://localhost:4000/api/financial/entries', { withCredentials: true }),
      axios.get('http://localhost:4000/api/financial/analytics', { withCredentials: true })
    ]);
    setTransactions(entriesRes.data.data);
    setBalance((analyticsRes.data.data.summary.totalIncome || 0) - (analyticsRes.data.data.summary.totalExpense || 0) + (entriesRes.data.data.filter(e => e.type === 'savings').reduce((a, b) => a + b.amount, 0) || 0));
    setLoading(false);
  };

  const handleFilter = (event, newFilter) => {
    if (newFilter) setFilter(newFilter);
  };

  const filtered = transactions.filter(tx =>
    filter === 'all' ? true : filter === 'credited' ? tx.type === 'savings' : tx.type === 'expense'
  );

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 4, background: '#010A26', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 4 }}>Wallet</Typography>
      <Card sx={{ background: '#181C23', color: '#fff', borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ color: '#A0AEC0' }}>Current Balance</Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>${balance.toLocaleString()}</Typography>
        </CardContent>
      </Card>
      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilter}
          sx={{ background: '#181C23', borderRadius: 2 }}
        >
          <ToggleButton value="all" sx={{ color: '#fff', '&.Mui-selected': { color: '#6FFF57' } }}>All</ToggleButton>
          <ToggleButton value="credited" sx={{ color: '#fff', '&.Mui-selected': { color: '#6FFF57' } }}>Credited</ToggleButton>
          <ToggleButton value="debited" sx={{ color: '#fff', '&.Mui-selected': { color: '#FF6B6B' } }}>Debited</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Card sx={{ background: '#181C23', color: '#fff', borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontWeight: 'bold' }}>Transactions</Typography>
          <List>
            {filtered.map((tx, idx) => (
              <React.Fragment key={tx._id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: tx.type === 'expense' ? '#FF6B6B' : '#6FFF57', color: '#23272F' }}>{tx.type === 'expense' ? 'D' : 'C'}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<span style={{ color: '#fff', fontWeight: 500 }}>{tx.description}</span>}
                    secondary={<span style={{ color: '#A0AEC0' }}>{tx.category} • {new Date(tx.date).toLocaleDateString()}</span>}
                  />
                  <Typography sx={{ color: tx.type === 'expense' ? '#FF6B6B' : '#6FFF57', fontWeight: 'bold' }}>
                    {tx.type === 'expense' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </Typography>
                </ListItem>
                {idx < filtered.length - 1 && <Divider sx={{ background: '#23272F' }} />}
              </React.Fragment>
            ))}
            {filtered.length === 0 && <Typography sx={{ color: '#A0AEC0', textAlign: 'center', mt: 2 }}>No transactions found.</Typography>}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Wallet; 