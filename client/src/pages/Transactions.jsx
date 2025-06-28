import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, MenuItem, Grid, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Alert } from '@mui/material';
import axios from 'axios';

const typeOptions = [
  { value: 'expense', label: 'Debited (Expense)' },
  { value: 'savings', label: 'Credited (Savings)' }
];

const Transactions = () => {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ balance: 0, savings: 0, expenses: 0 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/financial/entries', { withCredentials: true });
      setTransactions(res.data.data.slice(0, 5));
    } catch (err) {
      setTransactions([]);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/financial/analytics', { withCredentials: true });
      setSummary({
        balance: (res.data.data.summary.totalIncome || 0) - (res.data.data.summary.totalExpense || 0),
        savings: res.data.data.summary.netIncome || 0,
        expenses: res.data.data.summary.totalExpense || 0
      });
    } catch (err) {
      setSummary({ balance: 0, savings: 0, expenses: 0 });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.description) {
      setError('Please fill all fields.');
      return;
    }
    try {
      await axios.post('http://localhost:4000/api/financial/entries', {
        type: form.type,
        category: form.type === 'expense' ? 'Debited' : 'Credited',
        amount: parseFloat(form.amount),
        description: form.description,
        date: form.date
      }, { withCredentials: true });
      setSuccess('Transaction added!');
      setError('');
      setForm({ type: 'expense', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
      fetchTransactions();
      fetchSummary();
      window.dispatchEvent(new Event('transactionChanged'));
    } catch (err) {
      setError('Failed to add transaction.');
      setSuccess('');
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 2 }}>
      <Card sx={{ mb: 4, background: '#181C23', color: '#fff' }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Add Transaction</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField select fullWidth label="Type" name="type" value={form.type} onChange={handleChange} sx={{ background: '#23272F' }}>
                  {typeOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} sx={{ background: '#23272F' }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Date" name="date" type="date" value={form.date} onChange={handleChange} sx={{ background: '#23272F' }} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Reason" name="description" value={form.description} onChange={handleChange} sx={{ background: '#23272F' }} />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 1 }}>Add Transaction</Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Card sx={{ background: '#181C23', color: '#fff' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Recent Transactions</Typography>
          <List>
            {transactions.map((tx, idx) => (
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
                {idx < transactions.length - 1 && <Divider sx={{ background: '#23272F' }} />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
        <Typography>Balance: <b>${summary.balance.toLocaleString()}</b></Typography>
        <Typography>Savings: <b>${summary.savings.toLocaleString()}</b></Typography>
        <Typography>Expenses: <b>${summary.expenses.toLocaleString()}</b></Typography>
      </Box>
    </Box>
  );
};

export default Transactions; 