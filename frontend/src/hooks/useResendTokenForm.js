import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';

const useResendTokenForm = () => {
    const { resendToken, error, successMessage } = useAuth();
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    // REDIRIGE AL USUARIO CUANDO SE REENVÍA EL CÓDIGO CON ÉXITO
    useEffect(() => {
        if (successMessage === 'Código de verificación reenviado a tu correo electrónico.') {
            navigate('/verifytoken');
        }
    }, [successMessage, navigate]);



    // MANEJA EL ENVÍO DEL CORREO PARA REENVIAR EL TOKEN
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await resendToken({ email });
        } catch (err) {
            console.error(err);
        }
    };



    // MANEJA EL CAMBIO DEL INPUT DE EMAIL
    const handleEmailChange = (e) => setEmail(e.target.value);

    return {
        email,
        handleEmailChange,
        handleSubmit,
        error,
        successMessage
    };
};

export default useResendTokenForm;
