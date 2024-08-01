import React from 'react';
import { useParams } from 'react-router-dom';
import EditFlat from '../components/EditFlat';
import Header from '../components/Header';
import checkUsserLogged from '../services/action';
const Edit = () => {
    const { id } = useParams(); // Obtener el ID del flat de la URL
    checkUsserLogged();
    return (
        <div>

           <Header/>
           <EditFlat flatId={id}/>
        </div>
    );
};

export default Edit;
