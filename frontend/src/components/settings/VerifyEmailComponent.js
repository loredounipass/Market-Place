import React from 'react';
import useVerifyEmailComponent from '../../hooks/useVerifyEmailComponent';

const VerifyEmailComponent = () => {
    const {
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
    } = useVerifyEmailComponent();

    return (
        <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center p-3">
                Verificar Correo Electrónico
            </h2>
            <p className="text-gray-500 text-center max-w-md mx-auto text-sm sm:text-base">
                Correo electrónico autenticado: <strong>{auth?.email || 'Correo no disponible'}</strong>
            </p>

            {loading ? (
                <div className="flex justify-center py-6">
                    <svg className="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </div>
            ) : (
                <>
                    {localError && (
                        <div className="mt-4 px-5 py-4 rounded-lg bg-red-500 text-white font-bold text-center max-w-md mx-auto">
                            {localError}
                        </div>
                    )}
                    {verificationStatus && (
                        <div className={`mt-4 px-5 py-4 rounded-lg text-white font-bold text-center max-w-md mx-auto ${
                            verificationStatus.verified ? 'bg-green-500' : 'bg-orange-500'
                        }`}>
                            {verificationStatus.message}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleSendVerificationEmail}
                        disabled={emailVerified || sending}
                        className="block mx-auto mt-6 px-6 py-3 text-sm sm:text-base rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors max-w-[200px] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <svg className="w-6 h-6 animate-spin mx-auto text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (emailVerified ? 'Verificado' : 'Enviar Correo')}
                    </button>
                </>
            )}

            {snackbar.open && (
                <div className={`fixed bottom-6 left-6 z-50 text-white rounded-lg px-5 py-3 shadow-xl ${
                    snackbar.severity === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                    <div className="flex items-center gap-2">
                        <span>{snackbar.message}</span>
                        <button onClick={handleCloseSnackbar} className="ml-2 text-white/80 hover:text-white" aria-label="Cerrar">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-3 px-5 py-4 rounded-lg bg-red-500 text-white font-bold text-center max-w-md mx-auto">
                    {error}
                </div>
            )}
        </div>
    );
};

export default VerifyEmailComponent;
