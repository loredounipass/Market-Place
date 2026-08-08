import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import User from '../services/user';
import useAuth from './useAuth';

const useTwoFactorAuthComponent = () => {
    const { auth } = useContext(AuthContext);
    const { updateTokenStatus, error, setError } = useAuth();

    const [isTokenEnabled, setIsTokenEnabled] = useState(() => localStorage.getItem('isTokenEnabled') === 'true');
    const [showWarning, setShowWarning] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    // OBTIENE EL ESTADO DEL TOKEN DE AUTENTICACIÓN
    useEffect(() => {
        const fetchTokenStatus = async () => {
            if (!auth) return;
            try {
                const { data } = await User.getInfo();
                if (data?.data) {
                    const { isTokenEnabled } = data.data;
                    setIsTokenEnabled(isTokenEnabled);
                    localStorage.setItem('isTokenEnabled', isTokenEnabled);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchTokenStatus();
    }, [auth, setError]);



    // MANEJA EL CAMBIO DE ESTADO DE AUTENTICACIÓN DE DOS FACTORES
    const toggleTwoFactorAuth = () => {
        if (isTokenEnabled) {
            setShowWarning(true);
            setConfirmDialogOpen(true);
        } else {
            updateTokenStatusAndLocalStorage(true);
        }
    };



    // ACTUALIZA EL ESTADO EN LA API Y LOCALSTORAGE
    const updateTokenStatusAndLocalStorage = async (newStatus) => {
        try {
            await updateTokenStatus({ isTokenEnabled: newStatus });
            setIsTokenEnabled(newStatus);
            localStorage.setItem('isTokenEnabled', newStatus);

            if (newStatus) {
                setShowWarning(false);
                setSnackbar({ open: true, message: "Autenticación de dos factores activada.", severity: "success" });
            } else {
                setShowWarning(true);
                setSnackbar({ open: true, message: "Autenticación de dos factores desactivada.", severity: "success" });
            }
        } catch (err) {
            setError(err.message);
        }
    };



    // MANEJA EL CIERRE DEL DIÁLOGO DE CONFIRMACIÓN
    const handleConfirmDialogClose = (confirm) => {
        setConfirmDialogOpen(false);
        if (confirm) {
            updateTokenStatusAndLocalStorage(false);
        }
    };



    // CIERRA EL SNACKBAR
    const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

    // TEMPORIZADOR PARA CERRAR EL SNACKBAR
    useEffect(() => {
        if (snackbar.open) {
            const timer = setTimeout(handleCloseSnackbar, 3000);
            return () => clearTimeout(timer);
        }
    }, [snackbar.open]);

    return {
        isTokenEnabled,
        showWarning,
        confirmDialogOpen,
        snackbar,
        error,
        setError,
        toggleTwoFactorAuth,
        handleConfirmDialogClose,
        handleCloseSnackbar
    };
};

export default useTwoFactorAuthComponent;
