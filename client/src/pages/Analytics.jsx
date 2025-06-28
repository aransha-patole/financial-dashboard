import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    const res = await axios.get('http://localhost:4000/api/financial/analytics', { withCredentials: true });
    setAnalytics(res.data.data);
    setLoading(false);
  };

  if (loading || !analytics) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }

  // Summary
  const totalTransactions = (analytics.monthlyTrends || []).reduce((a, b) => a + b.total, 0);
  const totalDebited = (analytics.monthlyTrends || []).filter(i => i._id.type === 'expense').reduce((a, b) => a + b.total, 0);
  const totalCredited = (analytics.monthlyTrends || []).filter(i => i._id.type === 'savings').reduce((a, b) => a + b.total, 0);

  // Line chart data
  const lineData = {
    labels: analytics.monthlyTrends.map(item => `${item._id.month}/${item._id.year}`),
    datasets: [
      {
        label: 'Debited (Expense)',
        data: analytics.monthlyTrends.filter(i => i._id.type === 'expense').map(i => i.total),
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255,107,107,0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Credited (Savings)',
        data: analytics.monthlyTrends.filter(i => i._id.type === 'savings').map(i => i.total),
        borderColor: '#6FFF57',
        backgroundColor: 'rgba(111,255,87,0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  // Doughnut chart data (category breakdown for expenses)
  const expenseCats = analytics.categoryBreakdown.find(i => i._id === 'expense');
  const doughnutData = {
    labels: expenseCats ? expenseCats.categories.map(c => c.category) : [],
    datasets: [
      {
        data: expenseCats ? expenseCats.categories.map(c => c.total) : [],
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'
        ]
      }
    ]
  };

  return (
    <Box sx={{ p: 4, background: '#010A26', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 4 }}>Analytics</Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: '#181C23', color: '#fff', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: '#A0AEC0' }}>Total Transactions</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>{totalTransactions}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: '#181C23', color: '#fff', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: '#A0AEC0' }}>Total Debited</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1, color: '#FF6B6B' }}>-${totalDebited.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: '#181C23', color: '#fff', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: '#A0AEC0' }}>Total Credited</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1, color: '#6FFF57' }}>+${totalCredited.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ background: '#181C23', color: '#fff', borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontWeight: 'bold' }}>Monthly Trends</Typography>
              <Line data={lineData} options={{
                animation: { duration: 800, easing: 'easeInOutQuart' },
                plugins: { legend: { labels: { color: '#fff' } } },
                scales: { x: { ticks: { color: '#A0AEC0' } }, y: { ticks: { color: '#A0AEC0' } } }
              }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: '#181C23', color: '#fff', borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontWeight: 'bold' }}>Expense Category Breakdown</Typography>
              <Doughnut data={doughnutData} options={{ plugins: { legend: { labels: { color: '#fff' } } } }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 