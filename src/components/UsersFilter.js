import React, { useState } from 'react';
import { TextField, Button, Box, Grid } from '@mui/material';

const UserFilters = ({ onSubmitFilters }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [flatCountMin, setFlatCountMin] = useState('');
    const [flatCountMax, setFlatCountMax] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const filters = {
            name,
            role,
            flatCountMin: flatCountMin ? parseInt(flatCountMin) : undefined,
            flatCountMax: flatCountMax ? parseInt(flatCountMax) : undefined,
        };
        onSubmitFilters(filters);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        label="Nombre"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        label="Rol"
                        variant="outlined"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        label="Mínimo de Flats"
                        variant="outlined"
                        type="number"
                        value={flatCountMin}
                        onChange={(e) => setFlatCountMin(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        label="Máximo de Flats"
                        variant="outlined"
                        type="number"
                        value={flatCountMax}
                        onChange={(e) => setFlatCountMax(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                        Aplicar Filtros
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserFilters;
