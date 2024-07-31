import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Snackbar, Alert } from '@mui/material';
import { Api } from '../services/api';

const styles = {
    root: {
        display: "flex",
        flexDirection: "column",
        maxWidth: 600,
        margin: "auto",
        marginTop: 16,
        padding: 16,
        borderRadius: 10,
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#F5F5F5",
    },
    title: {
        color: "#2C3E50",
        marginBottom: 16,
    },
    textField: {
        marginBottom: 16,
    }
};

const UserProfile = () => {
    const { id } = useParams(); // Asegúrate de que `id` se extrae correctamente de la URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const api = new Api();
                const response = await api.get(`user/${id}`);
                setUser(response.data.data);
            } catch (error) {
                setError(error.response?.data?.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return (
            <Snackbar open={true} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert onClose={() => setError('')} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        );
    }

    if (!user) {
        return <Typography variant="h6" color="error">User not found</Typography>;
    }

    return (
        <Box sx={styles.root}>
            <Typography variant="h4" sx={styles.title}>{user.firstName} {user.lastName}</Typography>
            <Typography variant="body1" sx={styles.textField}>Email: {user.email}</Typography>
            <Typography variant="body1" sx={styles.textField}>Birth Date: {new Date(user.birthDate).toLocaleDateString()}</Typography>
            <Typography variant="body1" sx={styles.textField}>Role: {user.role}</Typography>
        </Box>
    );
};

export default UserProfile;
