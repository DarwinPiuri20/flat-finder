import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { Api } from '../services/api';

export default function LoginForm() {
  const [errorAlert, setErrorAlert] = useState('');
  const [isProgress, setIsProgress] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsProgress(true);

    const emailValue = emailRef.current.value;
    const passwordValue = passwordRef.current.value;

    const api = new Api();
    try {
      const result = await api.post('auth/login', { email: emailValue, password: passwordValue });
      console.log(result);
      if (result.data.status === 'success') {
        localStorage.setItem('user_logged', JSON.stringify(result.data.token));
        localStorage.setItem('user', JSON.stringify(result.data.user));
        navigate('/dashboard', { replace: true });
      } else {
        setErrorAlert('Login failed');
      }
    } catch (error) {
      setErrorAlert(error.response && error.response.data ? error.response.data.message : 'Login failed');
    } finally {
      setIsProgress(false);
    }
  };

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 2 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          p: 2,
          backgroundColor: '#F5F5F5',
          borderRadius: '10px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom color="#2C3E50">
          Login
        </Typography>
        {errorAlert && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorAlert}
          </Typography>
        )}
        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', maxWidth: 360 }}>
          <TextField
            label="Email"
            color="secondary"
            type="email"
            inputRef={emailRef}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            color="secondary"
            type="password"
            inputRef={passwordRef}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" sx={{ mb: 2 }}>
            Forgot your password? <a href="/forgot-password" style={{ color: '#E74C3C' }}>Reset password</a>
          </Typography>
          <Button
            type="submit"
            variant="contained"
            disabled={isProgress}
            fullWidth
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: '#1ABC9C',
              color: 'white',
              '&:hover': {
                backgroundColor: '#16A085',
              },
            }}
          >
            {isProgress ? 'Logging in...' : 'Login'}
          </Button>
          <Typography variant="body2" sx={{ color: '#2C3E50' }}>
            Don't have an account? <a href="/register" style={{ color: '#E74C3C' }}>Register</a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
