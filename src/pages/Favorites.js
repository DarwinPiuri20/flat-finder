import React from 'react'
import FlatsTable from '../components/FlatsTable'
import Header from '../components/Header'

const Favorites = () => {
    return(
        <>
        <Header/>
        <h1>Favorites</h1>
        <FlatsTable type="favorites"/>
        
        </>
     )
}

export default Favorites