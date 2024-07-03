import React, { useState } from 'react';
import { TextField, Button, Box, Grid,Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const UserFilters = ({ onSubmitFilters }) => {
    const [name, setName] = useState('');
    const [userType, setUserType] = useState('');
    const [flatCount, setFlatCount] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        let filter = '';
    
        if (userType) {
            filter += `filter[role]=${userType}`;
        }
    
        if (name) {
            if (filter) {
                filter += '&';
            }
            filter += `filter[name]=${name}`;
        }
        
    
        if (flatCount) {
            if (filter) {
                filter += '&';
            }
            filter += `filter[flatsCount]=${flatCount}`;
        }
    
        onSubmitFilters(filter);
    };
     

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, mb: 2, borderRadius: 8, boxShadow: 1, bgcolor: 'background.paper', p: 2 }}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Nombre"
                    variant="outlined"
                    size="small"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth size="small">
                    <InputLabel>Rol</InputLabel>
                    <Select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        label="Rol"
                    >
                        <MenuItem value="">Seleccionar Rol</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="owner">Owner</MenuItem>
                        <MenuItem value="renter">Renter</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Mínimo de Flats"
                    variant="outlined"
                    type="number"
                    size="small"
                    value={flatCount}
                    onChange={(e) => setFlatCount(e.target.value)}
                />
            </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2, borderRadius: 8 }}>
            <SearchIcon sx={{ mr: 1 }} />
            Buscar
        </Button>
    </Box>
    );
};

export default UserFilters;
