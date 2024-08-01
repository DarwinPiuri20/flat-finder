import React from 'react';
import  UsersTable  from '../components/UsersTable';
import Header from '../components/Header';
import checkUserLogged from '../services/action';
export default function UserTable() {
checkUserLogged();
    return (
        <div>
            <Header/>
            <UsersTable  />
        </div>
        
    )
}   
