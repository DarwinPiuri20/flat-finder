import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Grid, TextField, Button, MenuItem, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Api } from '../services/api';


const UserTable = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [flatsCounter, setFlatsCounter] = useState('');
    const [age, setAge] = useState('');
    const [order, setOrder] = useState('asc');

    const getData = async () => {
        setLoading(true);
        setError('');
        let filter = '';

        if (role) filter += `filter[role]=${role}`;
        if (name) filter += `${filter ? '&' : ''}filter[firstName]=${name}`;
        if (flatsCounter) filter += `${filter ? '&' : ''}filter[flatsCounter]=${flatsCounter}`;
        if (age) filter += `${filter ? '&' : ''}filter[age]=${age}`;
        if (order) filter += `${filter ? '&' : ''}order=${order}`;

        const api = new Api();
        try {
            const result = await api.get('users?' + filter);
            setUsers(result.data.data);
        } catch (error) {
            setError('Error retrieving users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [name, role, flatsCounter, age, order]);

    const handleView = (userId) => {
        navigate(`/view-user/${userId}`);
    };

    const handleDelete = async (userId) => {
        const api = new Api();
        try {
            await api.delete(`users/user/${userId}`);
            getData(); // Refresh the user list after deletion
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <Box sx={{ mt: 4, mx: 2 }}>
            <Box component="form" className="flex space-x-4 mx-auto max-w-screen-md mb-4">
                <div className="flex items-center space-x-4">
                    <TextField label="Name" variant="outlined" className="w-40" value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField
                        select
                        label="User Type"
                        variant="outlined"
                        SelectProps={{ native: true }}
                        className="w-40"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option key="none" value=""></option>
                        <option key="landlord" value="owner">Owners</option>
                        <option key="renter" value="renter">Renters</option>
                        <option key="admin" value="admin">Admins</option>
                    </TextField>
                    <TextField
                        select
                        label="Flats Counter"
                        variant="outlined"
                        SelectProps={{ native: true }}
                        className="w-40"
                        value={flatsCounter}
                        onChange={(e) => setFlatsCounter(e.target.value)}
                    >
                        <option key="none" value=""></option>
                        <option key="0-5" value="0-5">0-5</option>
                        <option key="6-20" value="6-20">6-20</option>
                        <option key="21-60" value="21-60">21-60</option>
                        <option key="61+" value="61+">61+</option>
                    </TextField>
                    <TextField
                        select
                        label="Order"
                        variant="outlined"
                        SelectProps={{ native: true }}
                        className="w-40"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                    >
                        <option key="asc" value="asc">A-Z</option>
                        <option key="desc" value="desc">Z-A</option>
                    </TextField>
                </div>
            </Box>

            <Box sx={{ mt: 8, mx: 4, alignItems: 'center' }}>
                <Typography variant="h2" component="h2" align="center" gutterBottom sx={{ mb: 2 }} color='secondary'>
                    User List
                </Typography>

                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography variant="body1" align="center" sx={{ width: '100%' }}>
                        Error: {error}
                    </Typography>
                ) : users.length === 0 ? (
                    <Typography variant="body1" align="center" sx={{ width: '100%' }}>
                        No users found matching the filters.
                    </Typography>
                ) : (
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {users.map((user) => (
                            <Grid item xs={12} sm={6} md={4} key={user._id}>
                                <Card sx={{ minWidth: 275, borderRadius: '10px', backgroundColor: '#f5f5f5' }}>
                                    <CardContent>
                                        <Typography variant="h5" component="div" sx={{ mb: 1.5 }}>
                                            {user.firstName} {user.lastName}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Email: {user.email}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Birth Date: {user.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'N/A'}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Role: {user.role}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Flats: {user.flatsCount}
                                        </Typography>
                                        <Box mt={2}>
                                            
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default UserTable;
