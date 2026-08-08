import React from 'react';
import useResendTokenForm from '../../hooks/useResendTokenForm';

const ResendTokenForm = () => {
    const {
        email,
        handleEmailChange,
        handleSubmit,
        error,
        successMessage
    } = useResendTokenForm();

    return (
        <div className="w-full max-w-sm mx-auto flex flex-col items-center mt-6 px-4">
            <form
                onSubmit={handleSubmit}
                noValidate
                className="w-full flex flex-col items-center p-6 rounded-xl bg-white border border-gray-200 shadow-[0_0_25px_rgba(0,123,255,0.6)] relative overflow-hidden animate-glow"
            >
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <h1 className="text-xl font-medium text-green-500">BlockVault</h1>
                <p className="text-sm text-center mb-6 font-sans">
                    Ingresa tu correo electrónico para reenviar el código de verificación
                </p>

                <div className="w-full space-y-4">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            placeholder="Correo Electrónico"
                            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
                    >
                        Reenviar Código
                    </button>
                </div>

                {error && (
                    <div className="w-full mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="w-full mt-4 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">
                        {successMessage}
                    </div>
                )}
            </form>
        </div>
    );
};

export default ResendTokenForm;
