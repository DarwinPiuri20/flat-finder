import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Slider, Box, Grid, TextField, Button } from '@mui/material';
import { Api } from '../services/api';

const UserTable = ({user}) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [flatsCounter, setFlatsCounter] = useState('');
    const [valueSlider, setValueSlider] = useState([18, 120]);

    const getData = async () => {
        setLoading(true);
        setError('');
        let filter = '';

        if (role) {
            filter += `filter[role]=${role}`;
        }
        if (name) {
            if (filter) filter += '&';
            filter += `filter[firstName]=${name}`;
        }
        if (flatsCounter) {
            if (filter) filter += '&';
            filter += `filter[flatsCounter]=${flatsCounter}`;
        }

        const api = new Api();
        try {
            const result = await api.get('users/?' + filter);
            console.log(result);
            const usersSet = result.data.data;
            setUsers(usersSet);
        } catch (error) {
            setError('Error retrieving users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [name, role, flatsCounter, valueSlider]);

    const handleView = (userId) => {
        try {
            navigate(`/view-profile/${userId}`);
        } catch (error) {
            console.error('Error storing user ID:', error);
        }
    };

    const handleDelete = async (userId) => {
        const api = new Api();
        try {
            await api.delete(`users/${userId}`);
            getData();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <Box sx={{ mt: 4, mx: 2 }}>
            <Box component="form" className="flex space-x-4 mx-auto max-w-screen-md mb-4">
                <div className="flex items-center space-x-4">
                    <TextField label="Name" variant="outlined" className="w-40" value={name} onChange={(e) => setName(e.target.value)}>
                        Name
                    </TextField>
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
                </div>
                <div className={'w-full'}>
                    <Typography id="input-slider" gutterBottom>
                        Age
                    </Typography>
                    <Slider
                        max={120}
                        min={18}
                        step={10}
                        value={valueSlider}
                        onChange={(e, newValue) => setValueSlider(newValue)}
                        getAriaLabel={() => 'Age Range'}
                        valueLabelDisplay="auto"
                        className="flex-grow"
                    />
                </div>
            </Box>

            <Box sx={{ mt: 8, mx: 4, alignItems: 'center' }}>
                <Typography variant="h2" component="h2" align="center" gutterBottom sx={{ mb: 2 }} color='secondary'>
                    User List
                </Typography>

                {loading ? (
                    <Typography variant="body1" align="center">
                        Cargando usuarios...
                    </Typography>
                ) : error ? (
                    <Typography variant="body1" align="center" sx={{ width: '100%' }}>
                        Error: {error}
                    </Typography>
                ) : users.length === 0 ? (
                    <Typography variant="body1" align="center" sx={{ width: '100%' }}>
                        No se encontraron usuarios que coincidan con los filtros.
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
                                                color="primary"
                                                onClick={() => handleView(user.id)}
                                                sx={{ mr: 2 }}
                                            >
                                                View
                                            </Button>
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
