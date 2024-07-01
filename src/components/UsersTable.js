import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box, Grid } from '@mui/material';
import { Api } from '../services/api';
import UserFilters from './UsersFilter';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        name: '',
        role: '',
        flatCountMin: '',
        flatCountMax: ''
    });

    useEffect(() => {
        fetchUsers(filters); // Llama a fetchUsers al inicio y cuando cambian los filtros
    }, [filters]);

    const fetchUsers = async (filters) => {
        setLoading(true);
        try {
            const api = new Api();
            const query = new URLSearchParams(filters).toString(); // Convierte los filtros en parámetros de consulta
            const response = await api.get(`users/users?${query}`);

            if (response.data && response.data.message === 'Users') {
                setUsers(response.data.data); // Actualiza los usuarios desde response.data.data
                setError('');
            } else {
                setError('Error retrieving users'); // Establece un mensaje de error si falla la llamada
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred'); // Captura y muestra el error, si lo hay
        } finally {
            setLoading(false); // Finaliza el estado de carga, independientemente del resultado
        }
    };

    const handleSubmitFilters = (newFilters) => {
        setFilters(newFilters); // Actualiza el estado de los filtros con los nuevos filtros
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6" color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 8, mx: 4, alignItems: 'center' }}>
            <Typography variant="h2" component="h2" align="center" gutterBottom sx={{ mb: 2 }} color='secondary'>
                User List
            </Typography>
            <UserFilters onSubmitFilters={handleSubmitFilters} /> {/* Componente de filtros separado */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {users.length === 0 ? (
                    <Typography variant="body1" align="center" sx={{ width: '100%' }}>
                        No se encontraron usuarios que coincidan con los filtros.
                    </Typography>
                ) : (
                    users.map((user) => (
                        <Grid item xs={12} sm={6} md={4} key={user._id}>
                            <Card sx={{ minWidth: 275, borderRadius: '10px', backgroundColor: '#f5f5f5' }}>
                                <CardContent>
                                    <Typography variant="h5" component="div" sx={{ mb: 1.5 }}>
                                        {user.firstname} {user.lastname}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Email: {user.email}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Birth Date: {user.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Role: {user.role}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Flats: {user.flatsCount}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
};

export default UserTable;
