import { useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import useAuth from './useAuth';

const useEmailVerificationStatus = () => {
    const { auth } = useContext(AuthContext);
    const { isEmailVerified } = useAuth();

    const [verificationStatus, setVerificationStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [localError, setLocalError] = useState(null);

    // COMPRUEBA EL ESTADO DE VERIFICACIÓN DEL CORREO
    useEffect(() => {
        const checkEmailVerification = async () => {
            setLocalError(null);
            try {
                const isVerified = await isEmailVerified();

                if (isVerified) {
                    setVerificationStatus({
                        verified: true,
                        message: 'Correo electrónico verificado con éxito.',
                    });
                } else {
                    setVerificationStatus({
                        verified: false,
                        message: 'El correo electrónico no está verificado.',
                    });
                }
            } catch (err) {
                setLocalError(err.message || 'Error al verificar el correo.');
                setVerificationStatus(null);
            } finally {
                setLoading(false);
            }
        };

        if (auth && auth.email) {
            checkEmailVerification();
        } else {
            setLocalError('No se ha encontrado un correo electrónico autenticado.');
            setLoading(false);
        }
    }, [auth, isEmailVerified]);

    return {
        auth,
        verificationStatus,
        loading,
        localError
    };
};

export default useEmailVerificationStatus;
