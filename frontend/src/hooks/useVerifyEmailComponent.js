import { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import useAuth from './useAuth';

const useVerifyEmailComponent = () => {
    const { auth } = useContext(AuthContext);
    const { sendVerificationEmail, isEmailVerified, error } = useAuth();

    const [verificationStatus, setVerificationStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [localError, setLocalError] = useState(null);
    const [emailVerified, setEmailVerified] = useState(false);
    const [hasCheckedVerification, setHasCheckedVerification] = useState(false);
    const [sending, setSending] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    // COMPRUEBA LA VERIFICACIÓN DEL CORREO
    useEffect(() => {
        const checkEmailVerification = async () => {
            setLocalError(null);
            try {
                const isVerified = await isEmailVerified();

                if (isVerified) {
                    setVerificationStatus({
                        verified: true,
                        message: 'Correo electrónico verificado',
                    });
                    setEmailVerified(true);
                } else {
                    setVerificationStatus({
                        verified: false,
                        message: 'El correo electrónico no está verificado.',
                    });
                    setEmailVerified(false);
                }
            } catch (err) {
                setLocalError(err.message || 'Error al verificar el correo.');
                setVerificationStatus(null);
            } finally {
                setLoading(false);
                setHasCheckedVerification(true);
            }
        };

        if (auth && auth.email && !hasCheckedVerification) {
            checkEmailVerification();
        } else if (!auth || !auth.email) {
            setLocalError('No se ha encontrado un correo electrónico autenticado.');
            setLoading(false);
        }
    }, [auth, isEmailVerified, hasCheckedVerification]);



    // MANEJA EL ENVÍO DEL CORREO DE VERIFICACIÓN
    const handleSendVerificationEmail = async () => {
        if (auth && auth.email) {
            setSending(true);
            try {
                await sendVerificationEmail(auth.email);
                setSnackbar({ open: true, message: "Correo de verificación enviado.", severity: "success" });
            } catch (error) {
                setLocalError(error.message || 'Error al enviar el correo de verificación.');
                setSnackbar({ open: true, message: localError, severity: "error" });
            } finally {
                setSending(false);
            }
        }
    };



    // MANEJA EL CIERRE DEL SNACKBAR
    const handleCloseSnackbar = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    // CIERRA EL SNACKBAR AUTOMÁTICAMENTE
    useEffect(() => {
        if (snackbar.open) {
            const timer = setTimeout(handleCloseSnackbar, 4000);
            return () => clearTimeout(timer);
        }
    }, [snackbar.open, handleCloseSnackbar]);

    return {
        auth,
        error,
        verificationStatus,
        loading,
        localError,
        emailVerified,
        sending,
        snackbar,
        handleSendVerificationEmail,
        handleCloseSnackbar
    };
};

export default useVerifyEmailComponent;
