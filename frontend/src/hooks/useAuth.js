import { useState, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import User from '../services/user';

export default function useAuth() {
    const navigate = useNavigate();
    const { setAuth } = use(AuthContext);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);



    // ESTABLECE EL CONTEXTO DEL USUARIO
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



    // CIERRA LA SESIÓN DEL USUARIO
    const logoutUser = async () => {
        try {
            await User.logout();
            setAuth(null);
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    };



    // REGISTRA UN NUEVO USUARIO
    const registerUser = async (body) => {
        try {
            const { data } = await User.register(body);
            if (data) {
                navigate('/login');
            } else {
                setError(data?.error || data?.message);
            }
        } catch (err) {
            setError(err.message);
        }
    };



    // INICIA LA SESIÓN DEL USUARIO
    const loginUser = async (body) => {
        try {
            const { data } = await User.login(body);
            if (data && ('msg' in data || 'message' in data)) {
                if (data.msg === 'Logged in!' || data.message === 'Logged in!') {
                    await setUserContext();
                    window.location.reload();
                }
                return data;
            } else {
                setError(data?.error || data?.message);
                return null;
            }
        } catch (err) {
            setError(err.message);
            return null;
        }
    };



    // VERIFICA EL TOKEN DE AUTENTICACIÓN
    const verifyToken = async (body) => {
        try {
            const { data } = await User.verifyToken(body);
            if (data && (data.msg === 'Logged in!' || data.message === 'Logged in!')) {
                await setUserContext();
                return true;
            } else if (data && (data.msg || data.message)) {
                return data;
            } else {
                const errorMessage = data?.error || data?.message || i18n.t('2fa_error_verify');
                setError(errorMessage);
                return { error: errorMessage };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
            setError(errorMessage);
            return { error: errorMessage };
        }
    };



    // REENVÍA EL TOKEN DE AUTENTICACIÓN
    const resendToken = async (body) => {
        try {
            const { data } = await User.resendToken(body);
            if (data && (data.message || data.msg)) {
                setSuccessMessage(data.message || data.msg);
                return { success: true, message: data.message || data.msg };
            } else {
                setError(data?.error || data?.message);
                return { error: data?.error || data?.message };
            }
        } catch (err) {
            setError(err.message);
            return { error: err.message };
        }
    };



    // CAMBIA LA CONTRASEÑA DEL USUARIO
    const changePassword = async (body) => {
        try {
            const { data } = await User.changePassword(body);
            if (data && (data.message || data.msg)) {
                setSuccessMessage(data.message || data.msg);
                try {
                    const infoResp = await User.getInfo();
                    const user = infoResp?.data?.data;
                    if (user) setAuth(user);
                } catch (err) {
                    // ignore refresh errors
                }
                return { success: true, message: data.message || data.msg };
            } else {
                setError(data?.error || data?.message);
                return { error: data?.error || data?.message };
            }
        } catch (err) {
            setError(err.message);
            return { error: err.message };
        }
    };



    // ACTUALIZA EL ESTADO DEL TOKEN
    const updateTokenStatus = async (body) => {
        try {
            const response = await User.updateTokenStatus(body);
            const { data } = response || {};
            if (data && (data.message || data.msg)) {
                setSuccessMessage(data.message || data.msg);
            } else if (data?.error) {
                setError(data.error);
            }
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        }
    };



    // ACTUALIZA EL PERFIL DEL USUARIO
    const updateUserProfile = async (body) => {
        try {
            const { data } = await User.updateProfile(body);
            if (data && (data.message || data.msg)) {
                setSuccessMessage(data.message || data.msg);
                try {
                    const infoResp = await User.getInfo();
                    const user = infoResp?.data?.data;
                    if (user) setAuth(user);
                } catch (err) {
                    // ignore refresh errors; UI will still show success
                }
                return { success: true, message: data.message || data.msg };
            } else {
                setError(data?.error || data?.message);
                return { error: data?.error || data?.message };
            }
        } catch (err) {
            setError(err.message);
            return { error: err.message };
        }
    };



    // VERIFICA EL CORREO ELECTRÓNICO
    const verifyEmail = async (token) => {
        try {
            const { data } = await User.verifyEmail({ token });
            if (data && (data.message || data.msg)) {
                setSuccessMessage(data.message || data.msg);
                return { success: true, message: data.message || data.msg };
            } else {
                setError(data?.error || data?.message);
                return { error: data?.error || data?.message };
            }
        } catch (err) {
            setError(err.message);
            return { error: err.message };
        }
    };



    // ENVÍA UN CORREO DE VERIFICACIÓN
    const sendVerificationEmail = async () => {
        try {
            const { data } = await User.sendVerificationEmail({});
            if (data && (data.message || data.msg)) {
                setSuccessMessage(data.message || data.msg);
                return { success: true, message: data.message || data.msg };
            } else {
                setError(data?.error || data?.message);
                return { error: data?.error || data?.message };
            }
        } catch (err) {
            setError(err.message);
            return { error: err.message };
        }
    };



    // COMPRUEBA SI EL CORREO ESTÁ VERIFICADO
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
        setError,
        successMessage
    };
}
