import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Grid, Snackbar, Alert, Card, CardMedia, Typography, MenuItem } from '@mui/material';
import { Api } from '../services/api';

const styles = {
    root: {
        display: "flex",
        flexDirection: "column",
        maxWidth: 600,
        margin: "24px auto",
        padding: 8,
        borderRadius: 10,
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#F5F5F5",
    },
    button: {
        backgroundColor: "#1ABC9C",
        color: "white",
        '&:hover': {
            backgroundColor: "#16A085",
        },
        marginTop: 8,
    },
    deleteButton: {
        backgroundColor: "#E74C3C",
        color: "white",
        '&:hover': {
            backgroundColor: "#C0392B",
        },
        marginTop: 8,
    },
    title: {
        color: "#2C3E50",
        marginBottom: 8,
    },
    textField: {
        marginBottom: 8,
    },
    switchLabel: {
        marginRight: 8,
    },
    inputContainer: {
        marginTop: 16,
    }
};

export default function UserForm({ type, userId }) {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        birthDate: '',
        role: "",
    });
    const [email, setEmail] = useState("");
    const [userLoaded, setUserLoaded] = useState(false);
    const firstNameRef = useRef("");
    const lastNameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const birthDateRef = useRef("");
    const userTypeRef = useRef('');
    const [roleRef, setRole] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState("error");
    const [password, setPassword] = useState("");
    let pathImg; 

    const api = new Api();

    if (!userId && type !== 'create') {
        userId = JSON.parse(localStorage.getItem('user_logged'));
    }

    const today = new Date();
    const minBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split("T")[0];
    const maxBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()).toISOString().split("T")[0];
    let nameButton = "Create";

    if (type === "update") {
        nameButton = "Update";
    }
    
    const getUserData = async () => {
        try {
            const response = await api.get('users/' + userId);
            setUser(response.data.data);
            setRole(response.data.data.role);
            setUserLoaded(true);
        } catch (error) {
            setAlertMessage("Error retrieving user data");
            setIsAlertOpen(true);
        }
    }

    const getCurrentUserData = async () => {
        try {
            const response = await api.get('users/user-logged');
            setUser(response.data.data);
            setRole(response.data.data.role);
            setUserLoaded(true);
        } catch (error) {
            setAlertMessage("Error retrieving current user data");
            setIsAlertOpen(true);
        }
    };

    const processData = async () => {
        if (type === 'view' || type === 'update') {
            await getCurrentUserData();
        } if (type === 'view-profile') {
            await getUserData();
        } else {
            setUserLoaded(true);
        }
    };

    useEffect(() => {
        processData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            firstNameRef.current.value.trim() === "" ||
            lastNameRef.current.value.trim() === "" ||
            emailRef.current.value.trim() === "" ||
            birthDateRef.current.value.trim() === ""
        ) {
            setAlertMessage("Please fill out all fields");
            setIsAlertOpen(true);
            return;
        }

        const userToSend = {
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            email: emailRef.current.value,
            birthDate: birthDateRef.current.value,
            role: userTypeRef.current.value,
        };

        try {
            if (type === "create") {
                userToSend.password = passwordRef.current.value;
                await api.post('auth/register', userToSend);
                setAlertMessage("User created");
                setAlertSeverity("success");
                resetFields();
            } if (type === "update") {
                await api.patch(`users/user-logged`, userToSend);
                setAlertMessage("User updated");
                setAlertSeverity("success");
            } if (type === "view") {
                await api.get(`users/`);
                setAlertMessage("User viewed");
            } if (type === "view-profile") {
                await api.get(`users/user/${userId}`);
                setAlertMessage("User viewed");
            }
            setIsAlertOpen(true);
        } catch (error) {
            setAlertMessage("Error saving user data");
            setAlertSeverity("error");
            setIsAlertOpen(true);
        }
    };

    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            setAlertMessage("Invalid email format");
            setAlertSeverity("error");
            setIsAlertOpen(true);
        }
    };

    const handleAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setIsAlertOpen(false);
    };

    const handlePasswordChange = (e) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue);
        if (passwordValue.length < 6) {
            setAlertMessage("Password must be at least 6 characters long");
            setAlertSeverity("error");
            setIsAlertOpen(true);
            return;
        }

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{6,}$/;
        if (!passwordRegex.test(passwordValue)) {
            setAlertMessage("Password must contain at least one letter, one number, and one special character");
            setAlertSeverity("error");
            setIsAlertOpen(true);
        }
    };

    const fileHandler = async (e) => {
        const file = e.target.files[0];
        pathImg = URL.createObjectURL(file);
    };

    const resetFields = () => {
        firstNameRef.current.value = "";
        lastNameRef.current.value = "";
        emailRef.current.value = "";
        birthDateRef.current.value = "";
        setRole("");
        if (passwordRef.current) {
            passwordRef.current.value = "";
        }
    };

    return (
        <>
            <Box
                bgcolor={styles.root.backgroundColor}
                component="form"
                onSubmit={handleSubmit}
                sx={styles.root}
            >
                {type === "create" && (
                    <Typography variant="h4" align="center" gutterBottom color={styles.title.color}>
                        Register
                    </Typography>
                )}

                {userLoaded ? (
                    <>
                        {type !== "create" && (
                            <Card
                                sx={{ maxWidth: 200, borderRadius: '10px', overflow: 'hidden', marginBottom: '0.5rem' }}
                            >
                            
                            </Card>
                        )}

                        <Grid container spacing={1} sx={{ maxWidth: "100%" }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    disabled={type === "view"}
                                    label="First Name"
                                    inputRef={firstNameRef}
                                    defaultValue={user.firstName}
                                    variant="outlined"
                                    fullWidth
                                    sx={styles.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    disabled={type === "view"}
                                    label="Last Name"
                                    inputRef={lastNameRef}
                                    defaultValue={user.lastName}
                                    variant="outlined"
                                    fullWidth
                                    sx={styles.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    disabled={type === "view"}
                                    type="email"
                                    label="Email"
                                    inputRef={emailRef}
                                    defaultValue={user.email}
                                    variant="outlined"
                                    fullWidth
                                    sx={styles.textField}
                                    onChange={handleEmailChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {type === "create" && (
                                    <TextField
                                        type="password"
                                        label="Password"
                                        inputRef={passwordRef}
                                        variant="outlined"
                                        fullWidth
                                        sx={styles.textField}
                                        onChange={handlePasswordChange}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    disabled={type === "view" || type === "update"}
                                    label="Birth Date"
                                    type="date"
                                    inputRef={birthDateRef}
                                    inputProps={{ min: maxBirthDate, max: minBirthDate }}
                                    defaultValue={user.birthDate ? user.birthDate.slice(0, 10) : ""}
                                    variant="outlined"
                                    fullWidth
                                    sx={styles.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ minWidth: 150 }}>
                                    {type === "create" ? (
                                        <TextField
                                            select
                                            label="User Type"
                                            variant="outlined"
                                            SelectProps={{ native: true }}
                                            fullWidth
                                            sx={styles.textField}
                                            inputRef={userTypeRef}
                                        >
                                            <option key="owner" value="owner">Owner</option>
                                            <option key="renter" value="renter">Renter</option>
                                        </TextField>
                                    ) : (
                                        <TextField
                                            defaultValue={user.role}
                                            label="User Type"
                                            variant="outlined"
                                            fullWidth
                                            disabled
                                            sx={styles.textField}
                                        />
                                    )}
                                </Box>
                            </Grid>

                            {type !== "view" && (
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        sx={styles.button}
                                    >
                                        {nameButton}
                                    </Button>
                                </Grid>
                            )}
                        </Grid>

                        <Snackbar
                            open={isAlertOpen}
                            autoHideDuration={6000}
                            onClose={handleAlertClose}
                        >
                            <Alert onClose={handleAlertClose} severity={alertSeverity}>
                                {alertMessage}
                            </Alert>
                        </Snackbar>
                    </>
                ) : (
                    <Typography variant="h6" color={styles.title.color} align="center" mt={4}>
                        Loading...
                    </Typography>
                )}
            </Box>
        </>
    );
}

