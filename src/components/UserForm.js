import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Alert, Box, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { Api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm({ mode = 'create' }) {
    const [errorAlert, setErrorAlert] = useState('');
    const [isProgress, setIsProgress] = useState(false);
    const [role, setRole] = useState('');
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const birthDateRef = useRef(null);
    const roleRef = useRef(null);
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = JSON.parse(localStorage.getItem('user'));
            console.log(userData)
            const api = new Api();
            try {
                const response = await api.get(`user/${userData._id}`);
                if (response.data.status === 'success') {
                    setUserData(response.data.user);
                    emailRef.current.value = response.data.user.email || '';
                    firstNameRef.current.value = response.data.user.firstname || '';
                    lastNameRef.current.value = response.data.user.lastname || '';
                    birthDateRef.current.value = response.data.user.birthdate || '';
                    setRole(response.data.user.role || '');
                } else {
                    setErrorAlert('User data not found.');
                }
            } catch (error) {
                setErrorAlert('Error fetching user data.');
            }
        };

        if (mode === 'edit' || mode === 'view') {
            fetchUserData();
        }
    }, [mode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProgress(true);

        const emailValue = emailRef.current.value;
        const passwordValue = passwordRef.current.value;
        const firstNameValue = firstNameRef.current.value;
        const lastNameValue = lastNameRef.current.value;
        const birthDateValue = birthDateRef.current.value;
        const roleValue = role;

        const api = new Api();
        try {
            let result;
            if (mode === 'create') {
                result = await api.post('auth/register', {
                    email: emailValue,
                    password: passwordValue,
                    firstname: firstNameValue,
                    lastname: lastNameValue,
                    birthdate: birthDateValue,
                    role: roleValue,
                });
            } else if (mode === 'edit') {
                result = await api.patch(`user/${userData._id}`, {
                    email: emailValue,
                    password: passwordValue,
                    firstName: firstNameValue,
                    lastName: lastNameValue,
                    birthDate: birthDateValue,
                    role: roleValue,
                });
            }
            if (result.data.status === 'success') {
                navigate(mode === 'create' ? '/dashboard' : '/profile', { replace: true });
            }
        } catch (error) {
            setErrorAlert(error.response.data.message);
        } finally {
            setIsProgress(false);
        }
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flow',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 8,
                maxWidth: '400px',
                mx: 'auto',
                p: 2,
                border: '1px solid #ccc',
                borderRadius: '8px',
            }}
            className='bg-white bg-opacity-30 rounded-lg p-8 shadow-2xl shadow-violet-900'
        >
            <h1 className='mb-20 font-mono text-[#800080] text-6xl font-bold mt-10 text-center'>
                {mode === 'create' ? 'Register' : mode === 'edit' ? 'Edit Profile' : 'View Profile'}
            </h1>
            {errorAlert && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errorAlert}
                </Alert>
            )}
            <TextField
                label="Email"
                type="email"
                color='secondary'
                inputRef={emailRef}
                required
                sx={{ mb: 2, width: '50%' }}
                disabled={mode === 'edit' || mode === 'view'}
            />
            {(mode === 'create' || mode === 'edit') && (
                <TextField
                    label="Password"
                    type="password"
                    color='secondary'
                    inputRef={passwordRef}
                    required={mode === 'create'}
                    sx={{ mb: 2, width: '50%' }}
                />
            )}
            <TextField
                label="First Name"
                color='secondary'
                type="text"
                inputRef={firstNameRef}
                required
                sx={{ mb: 2, width: '50%' }}
                disabled={mode === 'view'}
            />
            <TextField
                label="Last Name"
                color='secondary'
                type="text"
                inputRef={lastNameRef}
                required
                sx={{ mb: 2, width: '50%' }}
                disabled={mode === 'view'}
            />
            <TextField
                label="Birth Date"
                color='secondary'
                type="date"
                inputRef={birthDateRef}
                required
                sx={{ mb: 2, width: '50%' }}
                InputLabelProps={{
                    shrink: true,
                }}
                disabled={mode === 'view'}
            />
            {(mode === 'create' || mode === 'edit') && (
                <FormControl required sx={{ mb: 2, width: '50%' }}>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role-select"
                        value={role}
                        label="Role"
                        color='secondary'
                        onChange={handleRoleChange}
                        inputRef={roleRef}
                    >
                        <MenuItem value="owner">Owner</MenuItem>
                        <MenuItem value="renter">Renter</MenuItem>
                    </Select>
                </FormControl>
            )}
            {mode === 'view' && (
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: 'purple',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#581c87',
                        },
                    }}
                    onClick={() => navigate('/profile/edit')}
                >
                    Edit Profile
                </Button>
            )}
            {mode !== 'view' && (
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isProgress}
                    fullWidth
                    sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: 'purple',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#581c87',
                        },
                    }}
                >
                    {isProgress ? (mode === 'create' ? 'Registering...' : 'Updating...') : (mode === 'create' ? 'Register' : 'Update')}
                </Button>
            )}
        </Box>
    );
}
