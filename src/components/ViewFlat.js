import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Grid, Switch, CircularProgress, Snackbar, Alert, List, ListItem, ListItemText } from '@mui/material';
import { Api } from '../services/api';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate, useParams } from 'react-router-dom';

const styles = {
    root: {
        display: "flex",
        flexDirection: "column",
        maxWidth: 600,
        margin: "auto",
        marginTop: 16,
        padding: 16,
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
        marginTop: 16,
    },
    deleteButton: {
        backgroundColor: "#E74C3C",
        color: "white",
        '&:hover': {
            backgroundColor: "#C0392B",
        },
        marginTop: 16,
    },
    title: {
        color: "#2C3E50",
        marginBottom: 16,
    },
    textField: {
        marginBottom: 16,
    },
    chatSection: {
        backgroundColor: '#ECF0F1',
        padding: '16px',
        borderRadius: '8px',
        marginTop: '16px',
    },
};

const ViewFlat = ({ flatId, ownerId }) => {
    const { id } = useParams();
    const [flat, setFlat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user_logged")) || {});
    const [token, setToken] = useState(localStorage.getItem("token"));

    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlat = async () => {
            try {
                const api = new Api();
                const response = await api.get(`flats/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data && response.data.data) {
                    setFlat(response.data.data);
                } else {
                    setError('Flat not found');
                }
            } catch (error) {
                setError(error.response?.data?.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchFlat();
    }, [id, token]);

    useEffect(() => {
        if (flat) {
            fetchMessages();
        }
    }, [flat, id, token]);

    const fetchMessages = async () => {
        if (flat) {
            try {
                const api = new Api();
                const response = await api.get(`flats/${id}/messages/${flat.ownerId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMessages(response.data.messages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }
    };

    const handleEdit = () => {
        navigate(`/edit-flat/${id}`);
    };

    const handleDelete = async () => {
        try {
            const api = new Api();
            await api.delete(`flats/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/flats');
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    const handleSendMessage = async () => {
        try {
            if (!newMessage.trim()) {
                return;
            }
    
            const receiverId = flat.ownerId;
            console.log('Receiver ID:', receiverId); // Loguear receiverId para depuración
            if (!receiverId) {
                console.error('Invalid receiver ID:', receiverId); // Loguear receiverId inválido para depuración
                return;
            }
    
            const payload = {
                content: newMessage,
                receiverId
            };
            console.log('Sending message payload:', payload); // Loguear el payload para depuración
    
            const api = new Api();
            const response = await api.post(`flats/${id}/messages`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            console.log('Message sent successfully:', response.data); // Loguear respuesta exitosa
            setMessages([...messages, response.data.message]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            if (error.response) {
                console.error('Response data:', error.response.data); // Loguear respuesta detallada del error
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Snackbar open={true} autoHideDuration={6000} onClose={() => setError('')}>
            <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                {error}
            </Alert>
        </Snackbar>;
    }

    if (!flat) {
        return <Typography variant="h6" color="error">Flat not found</Typography>;
    }

    const isOwner = user._id === flat.ownerId;

    return (
        <Box style={styles.root}>
            <Typography variant="h6" style={styles.title}>View Flat</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="City"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={flat.city || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Street Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={flat.streetName || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Street Number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={flat.streetNumber || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Area Size"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={flat.areaSize || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center" marginBottom="16px">
                        <label htmlFor="hasAC" style={styles.switchLabel}>Has AC</label>
                        <Switch
                            checked={flat.hasAC || false}
                            disabled
                            color="primary"
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Year Built"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={flat.yearBuilt || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Rent Price"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={flat.rentPrice || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Date Available"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={flat.dateAvailable || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
            </Grid>
            <Button
                variant="contained"
                color="primary"
                startIcon={<ChatIcon />}
                sx={{ marginTop: 2 }}
                onClick={() => setIsChatOpen(!isChatOpen)}
            >
                {isChatOpen ? 'Hide Chat' : 'Show Chat'}
            </Button>
            {isOwner && (
                <>
                    <Button
                        variant="contained"
                        style={styles.button}
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        style={styles.deleteButton}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </>
            )}
            {isChatOpen && (
                <Box style={styles.chatSection}>
                    <Typography variant="h6" style={styles.title}>Messages</Typography>
                    <List sx={{ maxHeight: '400px', overflow: 'auto', backgroundColor: '#ECF0F1', mb: 2 }}>
                        {messages.map((message) => (
                            <ListItem key={message._id}>
                                <ListItemText 
                                    primary={message.content} 
                                    secondary={`Sent by: ${message.senderId?.firstName || 'Unknown'}, To: ${message.receiverId?.firstName || 'Unknown'}`} 
                                />
                            </ListItem>
                        ))}
                    </List>
                    <TextField
                        label="New Message"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#2C3E50',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#1ABC9C',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1ABC9C',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#2C3E50',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#1ABC9C',
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSendMessage}
                        sx={{
                            backgroundColor: '#2C3E50',
                            '&:hover': {
                                backgroundColor: '#1ABC9C',
                            },
                        }}
                    >
                        Send
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default ViewFlat;
