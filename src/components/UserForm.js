import React from 'react'
import { Api } from '../services/api'
export default function UserForm() {
  
  const api = new Api()
  
  const [user, setUser] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    birthdate: '',
  })
  
  
    return (
    <div>
      
    </div>
  )
}
