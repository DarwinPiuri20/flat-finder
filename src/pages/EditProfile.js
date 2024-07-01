import React from 'react'
import RegisterForm from '../components/UserForm'
import Header from '../components/Header'
export default function EditProfile() {
    return (
        <div>    
            <Header/>
 <RegisterForm mode="edit"/>
        </div>
    )
}