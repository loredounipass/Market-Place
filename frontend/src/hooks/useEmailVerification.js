import { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import User from '../services/user';

const useEmailVerification = () => {
    const { auth } = useContext(AuthContext);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [showCloseMessage, setShowCloseMessage] = useState(false);



    // VERIFICA EL CORREO ELECTRÓNICO DEL USUARIO MEDIANTE LA API
    const verifyEmail = async (email) => {
        try {
            const { data } = await User.verifyEmail({ email });
            if (data && data.message === 'Correo electrónico verificado con éxito.') {
                handleVerificationResult({ verified: true, message: `✔️ ${data.message}` });
            } else {
                handleVerificationResult({ verified: false, message: data.error || 'Error al verificar el correo electrónico.' });
            }
        } catch (err) {
            handleVerificationResult({ verified: false, message: err.message });
        }
    };



    // MANEJA EL CLIC EN EL BOTÓN DE VERIFICACIÓN
    const handleVerifyClick = () => {
        if (auth && auth.email) {
            verifyEmail(auth.email);
        } else {
            handleVerificationResult({ verified: false, message: 'No se encontró el correo electrónico autenticado.' });
        }
    };



    // PROCESA EL RESULTADO DE LA VERIFICACIÓN
    const handleVerificationResult = (result) => {
        setDialogMessage(result.message);
        setOpenDialog(true);
        setShowCloseMessage(false);

        if (result.verified) {
            setTimeout(() => {
                setOpenDialog(false);
                setShowCloseMessage(true);
            }, 5000);
        }
    };



    // CIERRA EL DIÁLOGO DE VERIFICACIÓN
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setShowCloseMessage(true);
    };

    return {
        openDialog,
        dialogMessage,
        showCloseMessage,
        handleVerifyClick,
        handleCloseDialog
    };
};

export default useEmailVerification;
