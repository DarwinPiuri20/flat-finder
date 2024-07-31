// src/components/ResetPass.js
import React, { useState } from 'react';
import { Api } from '../services/api';
import { TextField, Button, Typography, Box } from '@mui/material';

const ResetPass = ({ token }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleResetPassword = async () => {
        try {
            const api = new Api();
            const response = await api.post(`users/reset-password/${token}`, { password });
            setSuccess(response.data.message);
            setError('');
        } catch (err) {
            setError('Error resetting password: ' + err.response.data.message);
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
                <Typography sx={{ color: '#E74C3C', mt: 2 }}>
                    {error}
                </Typography>
            )}
            {success && (
                <Typography sx={{ color: '#1ABC9C', mt: 2 }}>
                    {success}
                </Typography>
            )}
        </Box>
    );
};

export default ResetPass;
