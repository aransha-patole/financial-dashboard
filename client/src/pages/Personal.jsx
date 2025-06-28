import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, TextField, Button, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const Personal = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', photo: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/api/user/profile', { withCredentials: true });
      setUser(res.data.data);
      setForm({ name: res.data.data.name, photo: res.data.data.photo || '' });
    } catch (err) {
      setUser(null);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.put('http://localhost:4000/api/user/profile', form, { withCredentials: true });
      setSuccess('Profile updated!');
      setEdit(false);
      fetchProfile();
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 4, background: '#010A26', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 4 }}>Personal Info</Typography>
      <Card sx={{ background: '#181C23', color: '#fff', borderRadius: 3, maxWidth: 500, mx: 'auto' }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar src={user?.photo || ''} sx={{ width: 80, height: 80, mb: 2, bgcolor: '#6FFF57', color: '#23272F', fontWeight: 'bold', fontSize: 36 }}>
              {!user?.photo && user?.name ? user.name[0] : 'U'}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>{user?.name}</Typography>
            <Typography sx={{ color: '#A0AEC0', mb: 1 }}>{user?.email}</Typography>
            <Typography sx={{ color: user?.isAccountVerified ? '#6FFF57' : '#FF6B6B', fontWeight: 'bold', mb: 2 }}>
              {user?.isAccountVerified ? 'Email Verified' : 'Email Not Verified'}
            </Typography>
          </Box>
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {edit ? (
            <form onSubmit={handleUpdate}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                sx={{ mb: 2, background: '#23272F' }}
              />
              <TextField
                fullWidth
                label="Avatar URL"
                name="photo"
                value={form.photo}
                onChange={handleChange}
                sx={{ mb: 2, background: '#23272F' }}
              />
              <Button type="submit" variant="contained" color="success" fullWidth sx={{ mb: 1 }}>Save</Button>
              <Button onClick={() => setEdit(false)} variant="outlined" fullWidth>Cancel</Button>
            </form>
          ) : (
            <Button onClick={() => setEdit(true)} variant="contained" color="success" fullWidth>Edit Profile</Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Personal; 