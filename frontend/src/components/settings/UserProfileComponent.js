import React from 'react';
import useUserProfileComponent from '../../hooks/useUserProfileComponent';

const inputBase = "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20";

function UserProfileComponent() {
    const {
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        localError,
        localSuccessMessage,
        handleUpdateProfile
    } = useUserProfileComponent();

    return (
        <div className="flex flex-col">
            <div className="flex flex-col items-center mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <h2 className="mt-3 text-lg font-bold text-gray-900">Perfil de Usuario</h2>
            </div>
            <form noValidate autoComplete="off" className="flex flex-col gap-4 max-w-md mx-auto w-full">
                <input
                    placeholder="Primer Nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className={inputBase}
                />
                <input
                    placeholder="Apellido"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className={inputBase}
                />
                <input
                    placeholder="Correo Electrónico"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputBase}
                />
                <button
                    type="button"
                    className="mt-4 px-5 py-3 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                    onClick={handleUpdateProfile}
                >
                    Actualizar Perfil
                </button>
                {localSuccessMessage && (
                    <div className="mt-4 px-4 py-3 rounded bg-green-50 border border-green-200 text-green-700">
                        {localSuccessMessage}
                    </div>
                )}
                {localError && (
                    <div className="mt-4 px-4 py-3 rounded bg-red-50 border border-red-200 text-red-600">
                        {localError}
                    </div>
                )}
            </form>
        </div>
    );
}

export default UserProfileComponent;
