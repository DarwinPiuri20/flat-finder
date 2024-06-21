// ForgotPassword.js
import React, { useState } from 'react';
import { Container, Typography, Grid, TextField, Button } from '@mui/material';
import {Api }from '../services/api'; // Asegúrate de que la ruta sea correcta

export default function ForgotPassword()  {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Api.post('api/users/forgot-password', { email });

            const result = response.data;
            if (result.status === 'success') {
                setMessage('Password reset email sent');
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            setMessage('Error sending password reset email');
            console.error('Error:', error);
        }
    };

    return (
        <Container maxWidth="sm">
        <Typography variant="h2" gutterBottom>
            Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        type="email"
                        label="Enter your email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                        Send Reset Link
                    </Button>
                </Grid>
            </Grid>
        </form>
        <Typography variant="body1" id="message" color={message.includes('success') ? 'primary' : 'error'}>
            {message}
        </Typography>
    </Container>
    )
};

