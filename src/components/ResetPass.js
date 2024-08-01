import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import { Api } from '../services/api';

const ResetPass = () => {
    const { token } = useParams(); // Get token from URL parameters
    const navigate = useNavigate(); // Hook for redirection
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleResetPassword = async () => {
        if (!token) {
            setError('Invalid or missing token');
            return;
        }
        if (!password) {
            setError('Password is required');
            return;
        }
        try {
            const api = new Api();
            const response = await api.post(`users/reset-password/${token}`, { password });
            setSuccess(response.data.message);
            setError('');
            setTimeout(() => {
                navigate('/'); // Redirect to login after 3 seconds
            }, 3000);
        } catch (err) {
            console.error('Error resetting password:', err);
            setError('Error resetting password: ' + (err.response && err.response.data ? err.response.data.message : err.message));
            setSuccess('');
        }
    };

    return (
        <Box sx={{ mt: 4, mx: 2, backgroundColor: '#F5F5F5', padding: 2, borderRadius: 1 }}>
            <Typography
                variant="h4"
                component="h1"
                align="center"
                gutterBottom
                sx={{ color: '#2C3E50' }}
            >
                Reset Password
            </Typography>
            <TextField
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#2C3E50',
                        },
                        '&:hover fieldset': {
                            borderColor: '#1ABC9C',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#1ABC9C',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#2C3E50',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#1ABC9C',
                    },
                }}
            />
            <Button
                variant="contained"
                onClick={handleResetPassword}
                sx={{
                    backgroundColor: '#2C3E50',
                    '&:hover': {
                        backgroundColor: '#1ABC9C',
                    },
                    mt: 2,
                }}
            >
                Reset Password
            </Button>
            {error && (
                <Snackbar open={true} autoHideDuration={6000} onClose={() => setError('')}>
                    <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            )}
            {success && (
                <Snackbar open={true} autoHideDuration={6000} onClose={() => setSuccess('')}>
                    <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
                        {success}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
};

export default ResetPass;
