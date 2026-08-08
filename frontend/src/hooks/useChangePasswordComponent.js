import { useState } from 'react';
import useAuth from './useAuth';

const useChangePasswordComponent = () => {
    const { changePassword, successMessage, error } = useAuth();

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false
    });

    const labels = {
        currentPassword: 'Contraseña Actual',
        newPassword: 'Nueva Contraseña',
        confirmNewPassword: 'Confirmar Contraseña'
    };



    // MANEJA EL CAMBIO DE VALOR EN LOS CAMPOS DE CONTRASEÑA
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };



    // ALTERNA LA VISIBILIDAD DE UN CAMPO DE CONTRASEÑA
    const handleTogglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };



    // ENVÍA LA SOLICITUD DE CAMBIO DE CONTRASEÑA
    const handleChangePassword = async () => {
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            alert('Las nuevas contraseñas no coinciden.');
            return;
        }
        await changePassword(passwords);
    };

    return {
        passwords,
        showPasswords,
        labels,
        successMessage,
        error,
        handleChange,
        handleTogglePasswordVisibility,
        handleChangePassword
    };
};

export default useChangePasswordComponent;
