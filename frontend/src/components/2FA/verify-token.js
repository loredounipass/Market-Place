import React, { useState, useRef, useEffect } from 'react';
import { Typography, Box, Button, TextField, Grid, Alert, Container, CircularProgress } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RefreshIcon from '@mui/icons-material/Refresh'; 
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const VerifyToken = () => {
    const [formValues, setFormValues] = useState({ token: '' });
    const { verifyToken, error } = useAuth();
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState(null); 
    const navigate = useNavigate();
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
            setLocalError('No se encontró el correo electrónico. Por favor, asegúrate de que estés autenticado.'); // Mensaje de error si no se encuentra el correo
            return;
        }

        setLoading(true);
        setTimeout(async () => {
            try {
                const response = await verifyToken({ email: storedEmail, ...formValues });
                if (isMounted.current && response?.msg === 'Logged in!') {
                    navigate('/');
                }
            } catch (err) {
            } finally {
                if (isMounted.current) setLoading(false);
            }
        }, 2000);
    };

    const handleResend = () => {
        navigate('/resendtoken');
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
                    boxShadow: '0 0 25px rgba(0, 128, 0, 0.6)',
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
                    Silk Road
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 4, fontFamily: 'Arial, sans-serif' }}>
                    Por favor, ingresa el token que recibiste en el correo electrónico
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Token"
                            variant="outlined"
                            name="token"
                            value={formValues.token}
                            onChange={handleChange}
                            required
                            margin="normal"
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
                            disabled={loading} 
                        >
                            {loading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CircularProgress size={20} sx={{ color: '#074EE7FF' }} />
                                    <Typography sx={{ ml: 1, color: '#074EE7FF', fontSize: '0.875rem' }}>Verificando...</Typography>
                                </Box>
                            ) : 'Verificar'}
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                mt: 2, 
                                cursor: 'pointer',
                                textDecoration: 'underline', 
                                color: '#4CAF50' 
                            }}
                            onClick={handleResend} 
                        >
                            <RefreshIcon sx={{ mr: 1 }} /> 
                            <Typography variant="body2">Reenviar Token</Typography>
                        </Box>
                    </Grid>
                    {localError && ( 
                        <Grid item xs={12}>
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {localError}
                            </Alert>
                        </Grid>
                    )}
                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Container>
    );
};

export default VerifyToken;
