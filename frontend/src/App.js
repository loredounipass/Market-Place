import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthContext } from './hooks/AuthContext'
import useFindUser from './hooks/useFindUser'

import Login from "./pages/Login"
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

export default function App() {
    const { auth, setAuth, loading } = useFindUser();

    return (
        <Router>
            <AuthContext.Provider value={{ auth, setAuth, loading }}>
                <LanguageProvider>
                    <Routes>
                        <Route path='/login' element={<PublicRoute component={Login} />} />
                        <Route path='/register' element={<PublicRoute component={Register} />} />
                        <Route path='/verifytoken' element={<PublicRoute component={VerifyToken} />} />
                        <Route path='/resendtoken' element={<PublicRoute component={ResendTokenForm} />} />
                        <Route path='/' element={<PrivateRoute component={Home} />} />
                        <Route path='/settings' element={<PrivateRoute component={Settings} />} />
                        <Route path='/create' element={<PrivateRoute component={CreateProduct} />} />
                        <Route path='/verifyemail' element={<PrivateRoute component={EmailVerificationComponent} />} />
                    </Routes>
                </LanguageProvider>
            </AuthContext.Provider>
        </Router>
    )
}