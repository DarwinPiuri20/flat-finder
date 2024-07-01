import React, { useEffect, useState } from 'react';

import { Button, Box, Typography, Skeleton } from "@mui/material";

import { Api } from '../services/api';


export default function FlatsTable({ type, user }) {
    const [flats, setFlats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState('');

    useEffect ( () => {
        fetchFlats();

    }, []

    );

    const fetchFlats = async () =>{
        setLoading(true);
        try{
            const api = new Api();
            const response = await api.get('flats/');
            if(response.data){
                console.log(response.data.flats)
                setFlats(response.data.flats);
            } else {
                setError('No se encontro Flats')
            }

        } catch (error){
            setError(error.response?.data?.message || 'An error occurred');
        }finally {
            setLoading(false);
        }
    }
   

    

    const addFavorite = async (id) => {
       
        
    }

    const removeFavorite = async (id) => {
        
    }

    const deleteFlat = async (id) => {
        
    };

    return (
        <>
            {type === 'all-flats' }
            <Box display="flex" justifyContent="center" flexWrap="wrap">
                {loading ? (
                    // Render skeleton while loading
                    Array.from({ length: 10 }).map((_, row) => (
                        <Box key={row._id} m={2} width="300px" maxWidth="100%">
                            <Box bgcolor="white" boxShadow={3} borderRadius={4} overflow="hidden" height="100%" display="flex" flexDirection="column">
                                <Skeleton variant="rectangular" width="100%" height={200} />
                                <Box p={2} flexGrow={1}>
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" />
                                </Box>
                                <Box p={2} borderTop={1} borderColor="grey.200">
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" />
                                </Box>
                            </Box>
                        </Box>
                    ))
                ) : (
                    // Render flats once data is loaded
                    flats.map((row) => (
                        <Box key={row._id} m={2} width="300px" maxWidth="100%">
                            <Box bgcolor="white" boxShadow={3} borderRadius={4} overflow="hidden" height="100%" display="flex" flexDirection="column">
                            <img src={row.imgFlat} alt="flat" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                                <Box p={2} flexGrow={1}>
                                    <Typography variant="h6" gutterBottom>{row.city}</Typography>
                                    <Typography variant="body1">Precio: ${row.rentPrice}</Typography>
                                    <Typography variant="body2">Area Size: {row.areaSize}</Typography>
                                    <Typography variant="body2">Disponible: {row.dateAvailable}</Typography>
                                    <Typography variant="body2">AC: {row.hasAC ? 'Yes' : 'No'}</Typography>
                                </Box>
                                <Box p={2} borderTop={1} borderColor="grey.200">
                                    
                                   
                                    
                                    
                                </Box>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>
        </>
    );
}


