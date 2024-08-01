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
    IconButton,
    Grid
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const styles = {
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    card: {
        width: '300px',
        margin: '16px',
    },
    button: {
        backgroundColor: '#1ABC9C',
        color: 'white',
        '&:hover': {
            backgroundColor: '#16A085',
        },
    },
    deleteButton: {
        color: '#E74C3C',
        '&:hover': {
            color: '#C0392B',
        },
    },
    favoriteButton: {
        color: '#E74C3C',
    },
    title: {
        color: '#2C3E50',
    },
};

export default function FlatsTable({ type }) {
    const [flats, setFlats] = useState([]);
    const [city, setCity] = useState('');
    const [rentPrice, setRentPrice] = useState('');
    const [hasAc, setHasAc] = useState('');
    const [order, setOrder] = useState('asc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [favoriteFlats, setFavoriteFlats] = useState([]);

    const userLogeado = JSON.parse(localStorage.getItem("user"));
    const ownerId = userLogeado?.id;
    const userId = userLogeado?.userId;
    const navigate = useNavigate();

    useEffect(() => {
        fetchFlats();
        fetchFavorites();
    }, [type, city, rentPrice, hasAc, order]);

    const fetchFlats = async () => {
        setLoading(true);
        setError('');
        let filter = '';
        if (city) filter += `filter[city]=${city}`;
        if (rentPrice) filter += `${filter ? '&' : ''}filter[rentPrice]=${rentPrice}`;
        if (hasAc) filter += `${filter ? '&' : ''}filter[hasAc]=${hasAc === 'yes'}`;
        if (order) filter += `${filter ? '&' : ''}order=${order}`;

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
                fetchFlats();
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
                setFlats(flats.filter(flat => flat._id !== id));
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

    const viewFlat = (id) => {
        navigate(`/view-flat/${id}`);
    };

    const editFlat = (id) => {
        navigate(`/edit-flat/${id}`);
    };
    

    return (
        <Box p={4}>
            {type !== 'my-flats' && type !== 'favorites' && (
                <Box mb={4}>
                    <Typography variant="h5" gutterBottom style={styles.title}>Flats</Typography>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom style={styles.title}>Filtros</Typography>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        label="City"
                                        variant="outlined"
                                        fullWidth
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl variant="outlined" fullWidth size="small">
                                        <InputLabel>Price</InputLabel>
                                        <Select
                                            value={rentPrice}
                                            onChange={(e) => setRentPrice(e.target.value)}
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
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl variant="outlined" fullWidth size="small">
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
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl variant="outlined" fullWidth size="small">
                                        <InputLabel>Order</InputLabel>
                                        <Select
                                            value={order}
                                            onChange={(e) => setOrder(e.target.value)}
                                            label="Order"
                                        >
                                            <MenuItem value="asc">A-Z</MenuItem>
                                            <MenuItem value="desc">Z-A</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Button
                                        variant="contained"
                                        style={styles.button}
                                        startIcon={<SearchIcon />}
                                        onClick={fetchFlats}
                                        fullWidth
                                    >
                                        Buscar
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            )}
            <Box style={styles.root}>
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
                            <Card style={styles.card}>

                                <CardContent>
                                    <Typography variant="h6" gutterBottom style={styles.title}>{row.city}</Typography>
                                    <Typography variant="body1">Street Name: {row.streetName}</Typography>
                                    <Typography variant="body1">Precio: ${row.rentPrice}</Typography>
                                    <Typography variant="body2">Area Size: {row.areaSize}</Typography>
                                    <Typography variant="body2">Disponible: {row.dateAvailable}</Typography>
                                    <Typography variant="body2">AC: {row.hasAc ? 'Sí' : 'No'}</Typography>
                                </CardContent>
                                <CardActions>
                                    {(type === 'all-flats' || type === 'favorites') && (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => viewFlat(row._id)}
                                            size="small"
                                        >
                                            View
                                        </Button>
                                    )}
                                    {type !== 'my-flats' && (
                                        favoriteFlats.includes(row._id) ? (
                                            <IconButton
                                                style={styles.favoriteButton}
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
                                        )
                                    )}
                                    {type === 'my-flats' && ownerId === row.ownerId && (
                                        <>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => editFlat(row._id)}
                                            >
                                                Edit
                                            </Button>
                                            <IconButton
                                                style={styles.deleteButton}
                                                onClick={() => deleteFlat(row._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
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
