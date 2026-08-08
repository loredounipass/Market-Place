import { useEffect, useState, useContext } from 'react';
import useAuth from './useAuth';
import { AuthContext } from './AuthContext';

const useUserProfileComponent = () => {
    const { updateUserProfile, error, successMessage } = useAuth();
    const { auth } = useContext(AuthContext);

    const [firstName, setFirstName] = useState(auth?.firstName || '');
    const [lastName, setLastName] = useState(auth?.lastName || '');
    const [email, setEmail] = useState(auth?.email || '');
    const [localError, setLocalError] = useState('');
    const [localSuccessMessage, setLocalSuccessMessage] = useState('');

    // ACTUALIZA EL ESTADO LOCAL CUANDO CAMBIA AUTH
    useEffect(() => {
        if (auth) {
            setFirstName(auth.firstName || '');
            setLastName(auth.lastName || '');
            setEmail(auth.email || '');
        }
    }, [auth]);



    // MANEJA LA ACTUALIZACIÓN DEL PERFIL DE USUARIO
    const handleUpdateProfile = async () => {
        setLocalError('');
        setLocalSuccessMessage('');

        if (!firstName || !lastName || !email) {
            setLocalError('Todos los campos son obligatorios.');
            return;
        }

        const body = { firstName, lastName, email };
        await updateUserProfile(body);
    };

    // ACTUALIZA MENSAJES LOCALES BASADOS EN LA RESPUESTA DE LA API
    useEffect(() => {
        if (successMessage) {
            setLocalSuccessMessage(successMessage);
        }
        if (error) {
            setLocalError(error);
        }
    }, [successMessage, error]);

    return {
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        localError,
        localSuccessMessage,
        handleUpdateProfile
    };
};

export default useUserProfileComponent;
