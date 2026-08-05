import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../hooks/AuthContext';
import useAuth from '../../hooks/useAuth';

const EmailVerificationStatus = () => {
    const { auth } = useContext(AuthContext);
    const { isEmailVerified } = useAuth();

    const [verificationStatus, setVerificationStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [localError, setLocalError] = useState(null);

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

    return (
        <div className="max-w-md mx-auto text-center pt-8">
            <h2 className="text-xl text-gray-900 mb-2">Verificar Estado del Correo Electrónico</h2>
            <p className="text-gray-600">
                Correo electrónico autenticado: <strong>{auth?.email || 'Correo no disponible'}</strong>
            </p>
            {loading ? (
                <div className="flex justify-center mt-6">
                    <svg className="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </div>
            ) : (
                <>
                    {localError && (
                        <div className="mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600">
                            {localError}
                        </div>
                    )}
                    {verificationStatus && (
                        <div className={`mt-4 px-4 py-3 rounded-lg ${
                            verificationStatus.verified
                                ? 'bg-green-50 border border-green-200 text-green-700'
                                : 'bg-orange-50 border border-orange-200 text-orange-600'
                        }`}>
                            {verificationStatus.message}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default EmailVerificationStatus;