import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Grid, Switch, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Api } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

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
    button: {
        backgroundColor: "#1ABC9C",
        color: "white",
        '&:hover': {
            backgroundColor: "#16A085",
        },
        marginTop: 16,
    },
    deleteButton: {
        backgroundColor: "#E74C3C",
        color: "white",
        '&:hover': {
            backgroundColor: "#C0392B",
        },
        marginTop: 16,
    },
    title: {
        color: "#2C3E50",
        marginBottom: 16,
    },
    textField: {
        marginBottom: 16,
    },
    switchLabel: {
        marginRight: 8,
    },
};

const EditFlat = () => {
    const { id } = useParams();
    const [flat, setFlat] = useState({
        city: "",
        streetName: "",
        streetNumber: "",
        areaSize: "",
        hasAc: false,
        yearBuilt: "",
        rentPrice: "",
        dateAvailable: new Date().toISOString().split('T')[0],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [file, setFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchFlat = async () => {
            try {
                const api = new Api();
                const response = await api.get(`flats/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data && response.data.data) {
                    setFlat({
                        ...response.data.data,
                        dateAvailable: response.data.data.dateAvailable.split('T')[0],
                    });
                } else {
                    setError('Flat not found');
                }
            } catch (error) {
                setError(error.response?.data?.message || 'An error occurred while fetching the flat data');
                console.error("Error fetching flat data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFlat();
    }, [id, token]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSwitchChange = (event) => {
        setFlat({ ...flat, hasAc: event.target.checked });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFlat({ ...flat, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const api = new Api();
            const updatedFlat = {
                ...flat,
                dateAvailable: new Date(flat.dateAvailable).toISOString(),
            };
            const response = await api.patch(`flats/${id}`, updatedFlat, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (file) {
                const formData = new FormData();
                formData.append("image", file);
                await api.post(`flats/${response.data.flat._id}/upload-image`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    },
                });
            }

            setSuccessMessage('Flat updated successfully');
            setTimeout(() => navigate('/my-flats'), 3000); // Redirige a la lista de flats después de 3 segundos
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while updating the flat');
            console.error("Error updating flat:", error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box style={styles.root}>
            <Typography variant="h6" style={styles.title}>Edit Flat</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="City"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="city"
                            value={flat.city}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Street Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="streetName"
                            value={flat.streetName}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Street Number"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="streetNumber"
                            value={flat.streetNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Area Size"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="areaSize"
                            value={flat.areaSize}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" marginBottom="16px">
                            <label htmlFor="hasAc" style={styles.switchLabel}>Has AC</label>
                            <Switch
                                checked={flat.hasAc}
                                id="hasAc"
                                onChange={handleSwitchChange}
                                color="primary"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Year Built"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="yearBuilt"
                            value={flat.yearBuilt}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Rent Price"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="rentPrice"
                            value={flat.rentPrice}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Date Available"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="date"
                            name="dateAvailable"
                            value={flat.dateAvailable}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <input
                            type="file"
                            id="file"
                            className="form-control"
                            onChange={handleFileChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            style={styles.button}
                        >
                            Update Flat
                        </Button>
                    </Grid>
                </Grid>
            </form>
            {error && (
                <Snackbar open={true} autoHideDuration={6000} onClose={() => setError('')}>
                    <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            )}
            {successMessage && (
                <Snackbar open={true} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
                    <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
                        {successMessage}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
};

export default EditFlat;
