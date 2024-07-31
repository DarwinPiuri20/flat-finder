import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Grid, CircularProgress, Typography, Switch } from "@mui/material";
import { Api } from "../services/api";

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
};

export default function FlatForm({ type, id }) {
    const [flat, setFlat] = useState({
        city: "",
        streetName: "",
        streetNumber: "",
        areaSize: "",
        hasAc: false,
        yearBuilt: "",
        rentPrice: "",
        dateAvailable: new Date().toISOString().split('T')[0], // Ajustado para manejar la fecha
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (type !== "create") {
            const fetchFlatData = async () => {
                try {
                    const api = new Api();
                    const response = await api.get(`flats/${id}`);
                    if (response.data.flat) {
                        setFlat({
                            ...response.data.flat,
                            dateAvailable: response.data.flat.dateAvailable.split('T')[0]
                        });
                    }
                } catch (error) {
                    setError(error.response?.data?.message || "An error occurred");
                } finally {
                    setLoading(false);
                }
            };
            fetchFlatData();
        } else {
            setLoading(false);
        }
    }, [id, type]);

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
        const updatedFlat = {
            areaSize: flat.areaSize,
            city: flat.city,
            dateAvailable: flat.dateAvailable,
            hasAc: flat.hasAc,
            rentPrice: flat.rentPrice,
            streetName: flat.streetName,
            streetNumber: flat.streetNumber,
            yearBuilt: flat.yearBuilt,
        };

        try {
            const api = new Api();
            let result;
            if (type === "create" || type === "edit") {
                result = await api.post("flats", updatedFlat);
            } else {
                result = await api.put(`flats/${id}`, updatedFlat);
            }

            if (file) {
                const formData = new FormData();
                formData.append("image", file);
                await api.post(`flats/${result.data.flat._id}/upload-image`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            if (result.data) {
                setFlat(result.data.flat);
                alert(`${type === "create" ? "Flat created" : "Flat updated"} successfully`);
            } else {
                setError("No flat data found");
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <Box style={styles.root}>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <Typography variant="h6" style={styles.title}>
                        {type === "create" ? "Create Flat" : "Edit Flat"}
                    </Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="city"
                                    name="city"
                                    label="City"
                                    variant="outlined"
                                    value={flat.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="streetName"
                                    name="streetName"
                                    label="Street Name"
                                    variant="outlined"
                                    value={flat.streetName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="streetNumber"
                                    name="streetNumber"
                                    label="Street Number"
                                    variant="outlined"
                                    type="number"
                                    value={flat.streetNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="areaSize"
                                    name="areaSize"
                                    label="Area Size"
                                    variant="outlined"
                                    type="number"
                                    value={flat.areaSize}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center" marginBottom="4px">
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
                                    fullWidth
                                    id="yearBuilt"
                                    name="yearBuilt"
                                    label="Year Built"
                                    variant="outlined"
                                    type="number"
                                    value={flat.yearBuilt}
                                    onChange={handleInputChange}
                                    inputProps={{ min: 1900, max: 2050 }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="rentPrice"
                                    name="rentPrice"
                                    label="Rent Price"
                                    variant="outlined"
                                    type="number"
                                    value={flat.rentPrice}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="dateAvailable"
                                    name="dateAvailable"
                                    label="Date Available"
                                    variant="outlined"
                                    type="date"
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
                                <div className="justify-center flex">
                                    <Button type="submit" variant="contained" style={styles.button}>
                                        {type === "create" ? "Create Flat" : "Update Flat"}
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </form>
                </>
            )}
        </Box>
    );
}
