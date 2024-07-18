import React from 'react'
import RegisterForm from '../components/UserForm'
import Header from '../components/Header'
export default function ViewProfile() {
    return (
        <div>    
            <Header/>
 <RegisterForm type={'view-profile'} />
        </div>
    )
}