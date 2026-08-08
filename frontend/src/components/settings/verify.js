import React from 'react';
import useEmailVerification from '../../hooks/useEmailVerification';

const EmailVerificationComponent = () => {
    const {
        openDialog,
        dialogMessage,
        showCloseMessage,
        handleVerifyClick,
        handleCloseDialog
    } = useEmailVerification();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
            <div className="p-6 rounded-xl shadow-lg shadow-black/10 max-w-md w-full bg-white">
                {!showCloseMessage ? (
                    <>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            Verificar Correo Electrónico
                        </h1>
                        <button
                            type="button"
                            onClick={handleVerifyClick}
                            className="mt-4 text-lg px-6 py-3 rounded bg-blue-600 text-white font-medium hover:bg-blue-800 transition-colors"
                        >
                            Enviar Correo de Verificación
                        </button>

                        {openDialog && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <div className="fixed inset-0 bg-black/50" onClick={handleCloseDialog} aria-hidden="true" />
                                <div className="relative bg-white p-6 text-center rounded-xl shadow-2xl max-w-md w-full">
                                    <h2 className="text-xl text-gray-900">Estado de Verificación</h2>
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="mt-3 text-gray-800">{dialogMessage}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCloseDialog}
                                        className="mt-5 px-5 py-2 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="mt-3 text-gray-500 text-lg">
                        Puedes cerrar esta ventana.
                    </p>
                )}
            </div>
        </div>
    );
};

export default EmailVerificationComponent;