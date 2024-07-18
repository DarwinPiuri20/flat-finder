import React, { useEffect, useState } from 'react';
import {
    Button,
    Box,
    Typography,
    Skeleton,
    TextField,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { Api } from '../services/api';

export default function FlatsTable({ type }) {
    const [flats, setFlats] = useState([]);
    const [city, setCity] = useState('');
    const [price, setPrice] = useState('');
    const [hasAc, setHasAc] = useState('');
    const [streetName, setStreetName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [favoriteFlats, setFavoriteFlats] = useState([]);

    const userLogeado = JSON.parse(localStorage.getItem("user"));
    const ownerId = userLogeado?.id;
    const userId = userLogeado?.userId;

    useEffect(() => {
        fetchFlats();
        fetchFavorites();
    }, [type, city, price, hasAc, streetName]);

    const fetchFlats = async () => {
        setLoading(true);
        setError('');
        let filter = '';
        if (city) filter += `filter[city]=${city}`;
        if (price) filter += `&filter[price]=${price}`;
        if (hasAc) filter += `&filter[hasAc]=${hasAc === 'yes'}`;
        if (streetName) filter += `&filter[streetName]=${streetName}`;

        try {
            const api = new Api();
            let response;
            if (type === 'all-flats') {
                response = await api.get(`flats?${filter}`);
            } else if (type === 'my-flats') {
                response = await api.get(`flats/my-flats/${ownerId}`);
            } else if (type === 'favorites') {
                response = await api.get(`flats/favorites/${userId}`);
            }

            if (response?.data && response.data.flats) {
                setFlats(response.data.flats);
            } else {
                setError('No se encontraron Flats');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        try {
            const api = new Api();
            const response = await api.get(`flats/favorites/${userId}`);
            if (response?.data?.flats) {
                setFavoriteFlats(response.data.flats.map(flat => flat._id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addFavorite = async (id) => {
        try {
            const api = new Api();
            const response = await api.post(`flats/add-favorite/${id}`);
            setFavoriteFlats([...favoriteFlats, id]);
            if (type === 'favorites') {
                fetchFlats(); // Refresca la tabla de favoritos
            }
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    const removeFavorite = async (id) => {
        try {
            const api = new Api();
            const response = await api.post(`flats/remove-favorite/${id}`);
            setFavoriteFlats(favoriteFlats.filter(flatId => flatId !== id));
            if (type === 'favorites') {
                setFlats(flats.filter(flat => flat._id !== id)); // Actualiza la tabla de favoritos
            }
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteFlat = async (id) => {
        try {
            const api = new Api();
            const response = await api.delete(`flats/${id}`);
            setFlats(flats.filter(flat => flat._id !== id));
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box p={4}>
            <Box mb={4} display="flex" justifyContent="center">
                <Box width="100%" maxWidth="800px">
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>Filtros</Typography>
                            <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between">
                                <TextField
                                    label="City"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                                <FormControl variant="outlined" fullWidth margin="normal">
                                    <InputLabel>Price</InputLabel>
                                    <Select
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        label="Price"
                                    >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <MenuItem value="0-500">$0 - $500</MenuItem>
                                        <MenuItem value="500-1000">$500 - $1000</MenuItem>
                                        <MenuItem value="1000-1500">$1000 - $1500</MenuItem>
                                        <MenuItem value="1500-2000">$1500 - $2000</MenuItem>
                                        <MenuItem value="2000+">$2000+</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" fullWidth margin="normal">
                                    <InputLabel>Has AC</InputLabel>
                                    <Select
                                        value={hasAc}
                                        onChange={(e) => setHasAc(e.target.value)}
                                        label="Has AC"
                                    >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <MenuItem value="yes">Yes</MenuItem>
                                        <MenuItem value="no">No</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Street Name"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={streetName}
                                    onChange={(e) => setStreetName(e.target.value)}
                                />
                            </Box>
                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SearchIcon />}
                                    onClick={fetchFlats}
                                >
                                    Buscar
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
            <Box display="flex" justifyContent="center" flexWrap="wrap">
                {loading ? (
                    Array.from({ length: 10 }).map((_, index) => (
                        <Box key={index} m={2} width="300px" maxWidth="100%">
                            <Card>
                                <Skeleton variant="rectangular" width="100%" height={200} />
                                <CardContent>
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" />
                                </CardContent>
                                <CardActions>
                                    <Skeleton variant="text" width="100%" />
                                </CardActions>
                            </Card>
                        </Box>
                    ))
                ) : (
                    flats.map((row) => (
                        <Box key={row._id} m={2} width="300px" maxWidth="100%">
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={row.imgFlat}
                                    alt="flat"
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>{row.city}</Typography>
                                    <Typography variant="body1">Precio: ${row.rentPrice}</Typography>
                                    <Typography variant="body2">Area Size: {row.areaSize}</Typography>
                                    <Typography variant="body2">Disponible: {row.dateAvailable}</Typography>
                                    <Typography variant="body2">AC: {row.hasAC ? 'Sí' : 'No'}</Typography>
                                </CardContent>
                                <CardActions>
                                    {favoriteFlats.includes(row._id) ? (
                                        <IconButton
                                            color="secondary"
                                            onClick={() => removeFavorite(row._id)}
                                        >
                                            <FavoriteIcon />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            color="primary"
                                            onClick={() => addFavorite(row._id)}
                                        >
                                            <FavoriteBorderIcon />
                                        </IconButton>
                                    )}
                                    {type === 'my-flats' && ownerId === row.ownerId && (
                                        <IconButton
                                            color="error"
                                            onClick={() => deleteFlat(row._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </CardActions>
                            </Card>
                        </Box>
                    ))
                )}
                {error && (
                    <Typography variant="h6" color="error">{error}</Typography>
                )}
            </Box>
        </Box>
    );
}
