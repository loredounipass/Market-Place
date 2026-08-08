import React from 'react';
import useVerifyToken from '../../hooks/useVerifyToken';

const VerifyToken = () => {
    const {
        formValues,
        loading,
        localError,
        error,
        handleChange,
        handleSubmit,
        handleResend
    } = useVerifyToken();

    return (
        <div className="w-full max-w-sm mx-auto flex flex-col items-center mt-6 px-4">
            <form
                onSubmit={handleSubmit}
                noValidate
                className="w-full flex flex-col items-center p-6 rounded-xl bg-white border border-gray-200 shadow-[0_0_25px_rgba(0,128,0,0.6)] relative overflow-hidden animate-glow"
            >
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <h1 className="text-xl font-medium text-green-500">Silk Road</h1>
                <p className="text-sm text-center mb-6 font-sans">
                    Por favor, ingresa el token que recibiste en el correo electrónico
                </p>

                <div className="w-full space-y-4">
                    <div>
                        <input
                            type="text"
                            name="token"
                            value={formValues.token}
                            onChange={handleChange}
                            required
                            placeholder="Token"
                            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="w-5 h-5 animate-spin text-white mr-2" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span className="text-sm">Verificando...</span>
                            </span>
                        ) : 'Verificar'}
                    </button>
                    <button
                        type="button"
                        onClick={handleResend}
                        className="w-full flex justify-center items-center py-1 text-sm underline text-green-500 cursor-pointer hover:text-green-600"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reenviar Token
                    </button>
                </div>

                {localError && (
                    <div className="w-full mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                        {localError}
                    </div>
                )}
                {error && (
                    <div className="w-full mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
};

export default VerifyToken;
