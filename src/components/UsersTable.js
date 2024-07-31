import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Grid, TextField, Button, MenuItem, CircularProgress } from '@mui/material';
import { Api } from '../services/api';

const styles = {
    root: {
        marginTop: '1rem',
        marginLeft: '1rem',
        marginRight: '1rem',
        padding: '1rem',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#F5F5F5',
    },
    button: {
        backgroundColor: '#1ABC9C',
        color: 'white',
        '&:hover': {
            backgroundColor: '#16A085',
        },
        marginTop: '1rem',
        marginBottom: '1rem'
    },
    deleteButton: {
        backgroundColor: '#E74C3C',
        color: 'white',
        '&:hover': {
            backgroundColor: '#C0392B',
        },
        marginTop: '1rem',
        marginBottom: '1rem'
    },
    title: {
        color: '#2C3E50',
        marginBottom: '1rem',
    },
    card: {
        minWidth: 275,
        borderRadius: '10px',
        backgroundColor: '#f5f5f5',
        margin: '1rem 0',
    },
    textField: {
        margin: '0 1rem',
    }
};

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
        console.log(userId); // Asegúrate de que esto imprime el ID correcto
        navigate(`/view-user/${userId}`);
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
        <Box sx={styles.root}>
            <Box component="form" className="flex space-x-4 mx-auto max-w-screen-md mb-4">
                <div className="flex items-center space-x-4">
                    <TextField
                        label="Name"
                        variant="outlined"
                        className="w-40"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={styles.textField}
                    />
                    <TextField
                        select
                        label="User Type"
                        variant="outlined"
                        SelectProps={{ native: true }}
                        className="w-40"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        sx={styles.textField}
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
                        sx={styles.textField}
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
                        sx={styles.textField}
                    >
                        <option key="asc" value="asc">A-Z</option>
                        <option key="desc" value="desc">Z-A</option>
                    </TextField>
                </div>
            </Box>

            <Box sx={{ mt: 2, mx: 4, alignItems: 'center' }}>
                <Typography variant="h2" component="h2" align="center" gutterBottom sx={styles.title}>
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
                                <Card sx={styles.card}>
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
                                            Flats: {user.flatCount}
                                        </Typography>
                                        <Box mt={2}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleView(user._id)}
                                                sx={styles.button}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleDelete(user._id)}
                                                sx={styles.deleteButton}
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
