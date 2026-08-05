import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import User from '../services/user';

export default function useAuth() {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const setUserContext = async () => {
        try {
            const { data } = await User.getInfo();
            if (data && 'data' in data) {
                setAuth(data.data);
                navigate('/');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const logoutUser = async () => {
        try {
            await User.logout();
            localStorage.clear();
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    const registerUser = async (body) => {
        try {
            const { data } = await User.register(body);
            if (data) {
                navigate('/login');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const loginUser = async (body) => {
        try {
            const { data } = await User.login(body);
            if (data && 'msg' in data) {
                if (data.msg === 'Código de verificación enviado a tu correo electrónico.') {
                    navigate('/verifytoken');
                } else if (data.msg === 'Logged in!') {
                    await setUserContext();
                } else {
                    setError(data.error);
                }
            } else {
                setError('Credenciales incorrectas.');
            }
        } catch (err) {
            setError('Credenciales incorrectas.');
        }
    };

    const verifyToken = async (body) => {
        try {
            const { data } = await User.verifyToken(body);
            if (data && data.msg === 'Logged in!') {
                await setUserContext();
            } else if (data && data.msg === 'Código de verificación enviado a tu correo electrónico.') {
                return data;
            } else {
                setError(data.error || 'Código de verificación inválido.');
            }
        } catch (err) {
            setError('Token incorrecto verifica tu correo electrónico.');
        }
    };

    const resendToken = async (body) => {
        try {
            const { data } = await User.resendToken(body);
            if (data && data.message === 'Código de verificación reenviado a tu correo electrónico.') {
                setSuccessMessage(data.message);
            } else {
                setError(data.error || 'Error al reenviar el código de verificación.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const changePassword = async (body) => {
        try {
            const { data } = await User.changePassword(body);
            if (data && data.message === 'Contraseña actualizada con éxito') {
                setSuccessMessage('Contraseña actualizada con éxito');
            } else {
                setError(data.error || 'Error al cambiar la contraseña.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const updateTokenStatus = async (body) => {
        try {
            const { data } = await User.updateTokenStatus(body);
            if (data && data.msg === 'Seguridad de la cuenta actualizada con éxito.') {
                setSuccessMessage('Seguridad de la cuenta actualizada con éxito.');
            } else {
                setError(data.error || 'Error al actualizar el estado de seguridad.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const updateUserProfile = async (body) => {
        try {
            const { data } = await User.updateProfile(body);
            if (data && data.message === 'Perfil actualizado con éxito') {
                setSuccessMessage(data.message);
            } else {
                setError(data.error || 'Error al actualizar el perfil.');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const verifyEmail = async (email) => {
        try {
            const { data } = await User.verifyEmail({ email });
            if (data && data.message === 'Correo electrónico verificado con éxito.') {
                setSuccessMessage(data.message);
            } else {
                setError(data.error || 'Error: el correo ya está verificado.');
            }
        } catch (err) {
            setError(err.message);
        }
    };
    
    const sendVerificationEmail = async (email) => {
        try {
            const { data } = await User.sendVerificationEmail({ email });
            if (data && data.message === 'Correo de verificación enviado con éxito.') {
                setSuccessMessage(data.message);
            } else {
                setError(data.error || 'Error al enviar el correo de verificación.');
            }
        } catch (err) {
            setError(err.message);
        }
    };
    
    const isEmailVerified = async () => {
        try {
            const { data } = await User.isEmailVerified(); 
            if (data && data.isVerified) {
                return true; 
            } else {
                return false; 
            }
        } catch (err) {
            setError(err.message);
            return false; 
        }
    };
    

    return {
        registerUser,
        loginUser,
        logoutUser,
        verifyToken,
        resendToken, 
        changePassword,
        updateTokenStatus,
        updateUserProfile,
        verifyEmail,          
        sendVerificationEmail,
        isEmailVerified,
        error,
        successMessage
    };
}