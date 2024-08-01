import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { Api } from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const api = new Api();
        try {
            const result = await api.post('users/forgot-password', { email });
            setMessage(result.data.message);
            setError('');
        } catch (error) {
            setError('Error sending password reset email');
            setMessage('');
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
                <Snackbar open={true} autoHideDuration={6000} onClose={() => setMessage('')}>
                    <Alert onClose={() => setMessage('')} severity="success" sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            )}
            {error && (
                <Snackbar open={true} autoHideDuration={6000} onClose={() => setError('')}>
                    <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
};

export default ForgotPassword;
