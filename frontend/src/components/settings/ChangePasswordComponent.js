import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const inputBase = "w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20";

function EyeIcon({ on }) {
  return (
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {on ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      )}
    </svg>
  )
}

function ChangePasswordComponent() {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleTogglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChangePassword = async () => {
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            alert('Las nuevas contraseñas no coinciden.');
            return;
        }
        await changePassword(passwords);
    };

    const labels = {
        currentPassword: 'Contraseña Actual',
        newPassword: 'Nueva Contraseña',
        confirmNewPassword: 'Confirmar Contraseña'
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-col items-center mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="mt-3 text-lg font-bold text-gray-900">Cambiar Contraseña</h2>
            </div>
            <form noValidate autoComplete="off" className="flex flex-col gap-4 max-w-md mx-auto w-full">
                {['currentPassword', 'newPassword', 'confirmNewPassword'].map((field) => (
                    <div key={field} className="relative">
                        <input
                            name={field}
                            placeholder={labels[field]}
                            type={showPasswords[field] ? 'text' : 'password'}
                            value={passwords[field]}
                            onChange={handleChange}
                            required
                            className={inputBase}
                        />
                        <button
                            type="button"
                            aria-label={`toggle ${field} visibility`}
                            onClick={() => handleTogglePasswordVisibility(field)}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                            <EyeIcon on={showPasswords[field]} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="mt-4 px-5 py-3 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                    onClick={handleChangePassword}
                >
                    Cambiar Contraseña
                </button>
                {successMessage && (
                    <div className="mt-4 px-4 py-3 rounded bg-green-50 border border-green-200 text-green-700">
                        {successMessage}
                    </div>
                )}
                {error && (
                    <div className="mt-4 px-4 py-3 rounded bg-red-50 border border-red-200 text-red-600">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}

export default ChangePasswordComponent;