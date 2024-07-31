import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Api } from '../services/api';

const ChatModal = ({ open, onClose, flatId, ownerId, token }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (open && flatId && ownerId) {
            const fetchMessages = async () => {
                try {
                    const api = new Api();
                    const response = await api.get(`flats/${flatId}/messages/${ownerId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setMessages(response.data.messages);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };

            fetchMessages();
        }
    }, [open, flatId, ownerId, token]);

    const handleSendMessage = async () => {
        try {
            if (!newMessage.trim()) {
                return; // No enviar mensajes vacíos
            }
            const api = new Api();
            const response = await api.post(`flats/${flatId}/messages`, {
                content: newMessage,
                receiverId: ownerId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessages([...messages, response.data.message]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Chat</DialogTitle>
            <DialogContent>
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
            </DialogContent>
            <DialogActions>
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
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChatModal;
