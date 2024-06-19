import React from 'react';
import {useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material'
import { Api } from '../services/api';

export default function LoginForm() {

    const [errorAlert, setErrorAlert] = useState('');
    const [isProgress, setIsProgress] = useState(false);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsProgress(true);

        const emailValue = emailRef.current.value;
        const passwordValue = passwordRef.current.value;

        const api = new Api();
        try {
            const result = await api.post('auth/login',{email:emailValue,password:passwordValue});
            console.log(result)
            if (result.data.status === 'success') {
                localStorage.setItem('user_logged', JSON.stringify(result.data.token));
                navigate('/dashboard', { replace: true });

            }

        }catch (error) {
            setErrorAlert(error.response.data.message);
        }
    }

    return (
        <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 2 }}>
        <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          p: 2
        }}
        className="bg-white bg-opacity-30 rounded-lg p-8 shadow-lg"
      >
        <Typography variant="h4" gutterBottom className='text-white'>
          Login
        </Typography>
        {errorAlert && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorAlert}
          </Typography>
        )}
        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', maxWidth: 360 }}>
          <TextField
            label="Email"
            type="email"
            inputRef={emailRef}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            inputRef={passwordRef}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isProgress}
            fullWidth
            sx={{ mb: 2,
                backgroundColor: 'black',
                
                color: 'white',
                '&:hover': {
                  backgroundColor: '#333',
                },
            }}
          >
            {isProgress ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Box>
      </Box>
    )

}