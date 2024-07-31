import React from 'react'
import FlatsTable from '../components/FlatsTable'
import Typography from '@mui/material/Typography'
import Header from '../components/Header'

const Favorites = () => {
    return(
        <div className='container, bg-white, h-screen, flex, items-center, justify-center'>
        <Header/>
        <Typography variant="h5" gutterBottom color="#2C3E50" sx={{ m: 2 }} >Favorites</Typography>
        <FlatsTable type="favorites"/>
        
        </div>
     )
}

export default Favorites