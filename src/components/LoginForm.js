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
                localStorage.setItem('user', JSON.stringify(result.data.user));
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
        className="bg-white bg-opacity-30 rounded-lg p-8 shadow-2xl shadow-violet-900"
      >
        <h1 className='mb-20 font-mono text-[#800080] text-6xl font-bold'>
          Login
        </h1>
        {errorAlert && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorAlert}
          </Typography>
        )}
        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', maxWidth: 360 }}>
          <TextField
            label="Email"
            color='secondary'
            type="email"
            inputRef={emailRef}
            required
            fullWidth
            sx={{ mb: 2}}
          />
          <TextField
            label="Password"
            color='secondary'
            type="password"
            inputRef={passwordRef}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <Typography variant='body2'>
            Forgot your password?
            <a href="/forgot-password" className='text-[#800080] '>Reset password</a>
          </Typography>
          <Button
            type="submit"
            variant="contained"
            disabled={isProgress}
            fullWidth
            sx={{mt: 3, 
              mb: 2,
                backgroundColor: 'purple',
                
                color: 'white',
                '&:hover': {
                  backgroundColor: '#581c87 ',
                },
            }}
          >
            {isProgress ? 'Logging in...' : 'Login'}
          </Button>
          <Typography variant='body2' className='text-black'>
            Don't have an account? <a href="/register" className='text-[#800080] '>Register</a>
          </Typography>
        </Box>
      </Box>
      </Box>
    )

}