import React from 'react';
import { useParams } from 'react-router-dom';
import EditFlat from '../components/EditFlat';
import Header from '../components/Header';

const Edit = () => {
    const { id } = useParams(); // Obtener el ID del flat de la URL

    return (
        <div>

           <Header/>
           <EditFlat flatId={id}/>
        </div>
    );
};

export default Edit;
