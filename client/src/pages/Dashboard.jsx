import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
  InputBase,
  Select
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Savings as SavingsIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon
} from '@mui/icons-material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const summaryCards = [
  { label: 'Balance', icon: <AccountBalanceWalletIcon sx={{ color: '#6FFF57', fontSize: 32 }} />, key: 'balance', color: '#23272F' },
  { label: 'Revenue', icon: <ArrowUpwardIcon sx={{ color: '#6FFF57', fontSize: 32 }} />, key: 'totalIncome', color: '#23272F' },
  { label: 'Expenses', icon: <ArrowDownwardIcon sx={{ color: '#FF6B6B', fontSize: 32 }} />, key: 'totalExpense', color: '#23272F' },
  { label: 'Savings', icon: <SavingsIcon sx={{ color: '#6FFF57', fontSize: 32 }} />, key: 'savings', color: '#23272F' },
];

const statusColors = {
  Completed: 'success',
  Pending: 'warning',
  Failed: 'error',
};

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [entries, setEntries] = useState([]);
  const [recent, setRecent] = useState([]);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    tags: ''
  });

  const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Business', 'Other'],
    expense: ['Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Shopping', 'Utilities', 'Other'],
    investment: ['Stocks', 'Bonds', 'Real Estate', 'Crypto', 'Other'],
    savings: ['Emergency Fund', 'Retirement', 'Vacation', 'Other']
  };

  useEffect(() => {
    fetchData();
    const handler = () => fetchData();
    window.addEventListener('transactionChanged', handler);
    return () => window.removeEventListener('transactionChanged', handler);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, entriesRes] = await Promise.all([
        axios.get('http://localhost:4000/api/financial/analytics', { withCredentials: true }),
        axios.get('http://localhost:4000/api/financial/entries', { withCredentials: true })
      ]);
      
      setAnalytics(analyticsRes.data.data);
      setEntries(entriesRes.data.data);
      setRecent(entriesRes.data.data.slice(0, 3));
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingEntry) {
        await axios.put(`http://localhost:4000/api/financial/entries/${editingEntry._id}`, data, { withCredentials: true });
      } else {
        await axios.post('http://localhost:4000/api/financial/entries', data, { withCredentials: true });
      }

      setOpenDialog(false);
      setEditingEntry(null);
      setFormData({
        type: 'expense',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        tags: ''
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving entry');
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      type: entry.type,
      category: entry.category,
      amount: entry.amount.toString(),
      description: entry.description,
      date: entry.date.split('T')[0],
      tags: entry.tags.join(', ')
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`http://localhost:4000/api/financial/entries/${id}`, { withCredentials: true });
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting entry');
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/financial/export', {
        withCredentials: true,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'financial_data.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Error exporting data');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Box>
    );
  }

  const chartData = {
    labels: analytics?.monthlyTrends?.map(item => `${item._id.month}/${item._id.year}`) || [],
    datasets: [
      {
        label: 'Income',
        data: analytics?.monthlyTrends?.filter(i => i._id.type === 'savings').map(i => i.total) || [],
        borderColor: '#6FFF57',
        backgroundColor: 'rgba(111,255,87,0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expenses',
        data: analytics?.monthlyTrends?.filter(i => i._id.type === 'expense').map(i => i.total) || [],
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255,107,107,0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const filteredEntries = entries.filter(e =>
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  const balanceValue = ((analytics?.summary?.totalIncome || 0) - (analytics?.summary?.totalExpense || 0) + (entries?.filter(e => e.type === 'savings').reduce((a, b) => a + b.amount, 0) || 0)).toLocaleString();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#010A26' }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 4, background: '#010A26', minHeight: '100vh' }}>
        <Topbar />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            Financial Dashboard
          </Typography>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Export CSV
          </Button>
        </Box>
        <Grid container spacing={3}>
          {/* Summary Cards */}
          {summaryCards.map((card, idx) => (
            <Grid item xs={12} sm={6} md={3} key={card.label}>
              <Card sx={{ background: card.color, borderRadius: 3, boxShadow: 'none', p: 2 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {card.icon}
                  <Typography variant="subtitle2" sx={{ color: '#A0AEC0', mt: 1 }}>{card.label}</Typography>
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold', mt: 1 }}>
                    {(card.key === 'balance' || card.key === 'savings')
                      ? `$${balanceValue}`
                      : `$${(analytics?.summary?.[card.key] || 0).toLocaleString()}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Overview and Recent Transactions */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ background: '#181C23', borderRadius: 3, p: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>Overview</Typography>
                  <Select
                    value={dateRange}
                    onChange={e => setDateRange(e.target.value)}
                    size="small"
                    sx={{ color: '#fff', background: '#23272F', borderRadius: 2, fontSize: 14 }}
                  >
                    <MenuItem value="all">Monthly</MenuItem>
                  </Select>
                </Box>
                <Line
                  data={chartData}
                  options={{
                    animation: {
                      duration: 800,
                      easing: 'easeInOutQuart',
                    },
                    plugins: { legend: { labels: { color: '#fff' } } },
                    scales: { x: { ticks: { color: '#A0AEC0' } }, y: { ticks: { color: '#A0AEC0' } } }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: '#181C23', borderRadius: 3, p: 2, height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>Recent Transaction</Typography>
                  <Button size="small" sx={{ color: '#6FFF57', textTransform: 'none' }}>See all</Button>
                </Box>
                {recent.map((tx, idx) => (
                  <Box key={tx._id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={`https://randomuser.me/api/portraits/men/${idx + 30}.jpg`} sx={{ width: 36, height: 36, mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: 15 }}>{tx.description}</Typography>
                      <Typography sx={{ color: '#A0AEC0', fontSize: 13 }}>{tx.category}</Typography>
                    </Box>
                    <Typography sx={{ color: tx.type === 'savings' ? '#6FFF57' : '#FF6B6B', fontWeight: 'bold', fontSize: 15 }}>
                      {tx.type === 'savings' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Transactions Table */}
        <Card sx={{ background: '#181C23', borderRadius: 3, mt: 4, p: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>Transactions</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <InputBase
                  placeholder="Search for anything..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  sx={{ background: '#23272F', color: '#fff', borderRadius: 2, px: 2, py: 0.5, fontSize: 14, width: 200 }}
                />
                <Select
                  value={dateRange}
                  onChange={e => setDateRange(e.target.value)}
                  size="small"
                  sx={{ color: '#fff', background: '#23272F', borderRadius: 2, fontSize: 14 }}
                >
                  <MenuItem value="all">10 May - 20 May</MenuItem>
                </Select>
              </Box>
            </Box>
            <TableContainer component={Paper} sx={{ background: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#A0AEC0', background: '#23272F', border: 0 }}>Name</TableCell>
                    <TableCell sx={{ color: '#A0AEC0', background: '#23272F', border: 0 }}>Date</TableCell>
                    <TableCell sx={{ color: '#A0AEC0', background: '#23272F', border: 0 }}>Amount</TableCell>
                    <TableCell sx={{ color: '#A0AEC0', background: '#23272F', border: 0 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEntries.map((entry, idx) => (
                    <TableRow key={entry._id}>
                      <TableCell sx={{ color: '#fff', border: 0, display: 'flex', alignItems: 'center' }}>
                        <Avatar src={`https://randomuser.me/api/portraits/men/${idx + 30}.jpg`} sx={{ width: 32, height: 32, mr: 1 }} />
                        {entry.description}
                      </TableCell>
                      <TableCell sx={{ color: '#A0AEC0', border: 0 }}>{new Date(entry.date).toDateString()}</TableCell>
                      <TableCell sx={{ color: entry.type === 'income' ? '#6FFF57' : '#FF6B6B', border: 0, fontWeight: 'bold' }}>
                        {entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        <Chip
                          label={entry.status || (entry.type === 'income' ? 'Completed' : 'Pending')}
                          color={statusColors[entry.status || (entry.type === 'income' ? 'Completed' : 'Pending')]}
                          size="small"
                          sx={{ fontWeight: 'bold', borderRadius: 1 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard; 