import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthContext } from './hooks/AuthContext'
import useFindUser from './hooks/useFindUser'

import Login from "./pages/Login"
import { Box, Container, CssBaseline, Toolbar } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PublicRoute from './components/route-control/PublicRoute'
import PrivateRoute from './components/route-control/PrivateRoute'
import Register from './pages/Register'
import Home from './components/Home'
import VerifyToken from './components/2FA/verify-token'
import Settings from './components/settings/Settings'
import ResendTokenForm from './components/2FA/ResendTokenForm'
import EmailVerificationComponent from './components/settings/verify'
import { LanguageProvider } from './hooks/LanguageContext';
import './i18n'; 
import CreateProduct from './components/createProduct';
import './index.css'

// APLICACION CLIENTE
export default function App() {
    const { auth, setAuth, loading } = useFindUser();
    const mdTheme = createTheme();

    return (
        <Router>
            <AuthContext.Provider value={{ auth, setAuth, loading }}>
                <LanguageProvider>
                <ThemeProvider theme={mdTheme}>
                    <Box sx={{ display: 'flex' }}>
                        <CssBaseline />
                        <Box
                            component="main"
                            sx={{
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'light'
                                        ? theme.palette.grey[100]
                                        : theme.palette.grey[900],
                                flexGrow: 1,
                                height: '100vh',
                                overflow: 'auto',
                            }}
                        >
                            <Toolbar />
                            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                                <Routes>
                                    <Route path='/' element={<PrivateRoute component={Home} />} />
                                    <Route path='/settings' element={<PrivateRoute component={Settings} />} />
                                    <Route path='/create' element={<PrivateRoute component={CreateProduct} />} />
                                    <Route path='/verifyemail' element={<PrivateRoute component={EmailVerificationComponent} />} />
                                    <Route path='/login' element={<PublicRoute component={Login} />} />
                                    <Route path='/register' element={<PublicRoute component={Register} />} />
                                    <Route path='/verifytoken' element={<PublicRoute component={VerifyToken} />} />
                                    <Route path='/resendtoken' element={<PublicRoute component={ResendTokenForm} />} />
                                </Routes>
                                
                            </Container>
                        </Box>
                    </Box>
                </ThemeProvider>
                </LanguageProvider>
            </AuthContext.Provider>
        </Router>
    )
}