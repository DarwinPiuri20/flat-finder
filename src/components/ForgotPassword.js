import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { Api } from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const api = new Api();
        try {
            const result = await api.post('users/forgot-password', { email });
            setMessage(result.data.message);
        } catch (error) {
            setMessage('Error sending password reset email');
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Forgot Password
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Send Reset Link
                </Button>
            </form>
            {message && (
                <Typography variant="body1" align="center" color="secondary" sx={{ mt: 2 }}>
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default ForgotPassword;
