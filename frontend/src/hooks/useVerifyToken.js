import { useState, useRef, useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';

const useVerifyToken = () => {
    const [formValues, setFormValues] = useState({ token: '' });
    const { verifyToken, error } = useAuth();
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState(null);
    const navigate = useNavigate();
    const isMounted = useRef(true);

    // MANEJA EL DESMONTAJE DEL COMPONENTE
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);



    // MANEJA EL CAMBIO DE VALORES EN EL FORMULARIO
    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };



    // MANEJA EL ENVÍO DEL FORMULARIO Y VERIFICACIÓN
    const handleSubmit = async (event) => {
        event.preventDefault();

        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
            setLocalError('No se encontró el correo electrónico. Por favor, asegúrate de que estés autenticado.');
            return;
        }

        setLoading(true);
        setTimeout(async () => {
            try {
                const response = await verifyToken({ email: storedEmail, ...formValues });
                if (isMounted.current && response?.msg === 'Logged in!') {
                    navigate('/');
                }
            } catch (err) {
            } finally {
                if (isMounted.current) setLoading(false);
            }
        }, 2000);
    };



    // MANEJA LA REDIRECCIÓN A REENVIAR TOKEN
    const handleResend = () => {
        navigate('/resendtoken');
    };

    return {
        formValues,
        loading,
        localError,
        error,
        handleChange,
        handleSubmit,
        handleResend
    };
};

export default useVerifyToken;
