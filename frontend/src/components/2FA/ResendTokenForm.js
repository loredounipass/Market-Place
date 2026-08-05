import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Grid, Alert } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useAuth from '../../hooks/useAuth'; 
import { useNavigate } from 'react-router-dom';

const ResendTokenForm = () => {
    const { resendToken, error, successMessage } = useAuth();
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (successMessage === 'Código de verificación reenviado a tu correo electrónico.') {
            navigate('/verifytoken');
        }
    }, [successMessage, history]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await resendToken({ email });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: '0 0 25px rgba(0, 123, 255, 0.6)',
                    bgcolor: 'background.paper',
                    border: '1px solid #ddd',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: 'glow 1.5s infinite alternate'
                }}
            >
               
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: '#4CAF50', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                    }}
                >
                    <ArrowDropDownIcon sx={{ color: 'white', fontSize: 50 }} />
                </Box>
                <Typography component="h1" variant="h5" sx={{ color: '#4CAF50' }}>
                    BlockVault 
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 4, fontFamily: 'Arial, sans-serif' }}>
                    Ingresa tu correo electrónico para reenviar el código de verificación
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Correo Electrónico"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            InputProps={{ sx: { borderRadius: 2, border: '1px solid #ddd' } }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: '#4CAF50', 
                                '&:hover': {
                                    backgroundColor: '#45a049', 
                                },
                                borderRadius: 2,
                                color: 'white',
                            }}
                            fullWidth
                        >
                            Reenviar Código
                        </Button>
                    </Grid>
                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        </Grid>
                    )}
                    {successMessage && (
                        <Grid item xs={12}>
                            <Alert severity="success" sx={{ mt: 2 }}>
                                {successMessage}
                            </Alert>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Container>
    );
};

export default ResendTokenForm;
