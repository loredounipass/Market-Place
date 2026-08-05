import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../hooks/AuthContext';
import User from '../../services/user';
import useAuth from '../../hooks/useAuth';

const TwoFactorAuthComponent = () => {
  const { auth } = useContext(AuthContext);
  const { updateTokenStatus, error, setError } = useAuth();

  const [isTokenEnabled, setIsTokenEnabled] = useState(() => localStorage.getItem('isTokenEnabled') === 'true');
  const [showWarning, setShowWarning] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  useEffect(() => {
    const fetchTokenStatus = async () => {
      if (!auth) return;
      try {
        const { data } = await User.getInfo();
        if (data?.data) {
          const { isTokenEnabled } = data.data;
          setIsTokenEnabled(isTokenEnabled);
          localStorage.setItem('isTokenEnabled', isTokenEnabled);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTokenStatus();
  }, [auth, setError]);

  const toggleTwoFactorAuth = () => {
    if (isTokenEnabled) {
      setShowWarning(true);
      setConfirmDialogOpen(true);
    } else {
      updateTokenStatusAndLocalStorage(true);
    }
  };

  const updateTokenStatusAndLocalStorage = async (newStatus) => {
    try {
      await updateTokenStatus({ isTokenEnabled: newStatus });
      setIsTokenEnabled(newStatus);
      localStorage.setItem('isTokenEnabled', newStatus);

      if (newStatus) {
        setShowWarning(false);
        setSnackbar({ open: true, message: "Autenticación de dos factores activada.", severity: "success" });
      } else {
        setShowWarning(true);
        setSnackbar({ open: true, message: "Autenticación de dos factores desactivada.", severity: "success" });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmDialogClose = (confirm) => {
    setConfirmDialogOpen(false);
    if (confirm) {
      updateTokenStatusAndLocalStorage(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(handleCloseSnackbar, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg shadow-black/5 max-w-lg mx-auto">
      <h2 className="text-2xl text-gray-900 mb-4">Autenticación de Dos Factores</h2>

      <button
        type="button"
        onClick={toggleTwoFactorAuth}
        className="inline-flex items-center mb-2 cursor-pointer"
      >
        <span
          role="switch"
          aria-checked={isTokenEnabled}
          className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
            isTokenEnabled ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
              isTokenEnabled ? "translate-x-5" : ""
            }`}
          />
        </span>
        <span className="ml-3 flex items-center text-gray-900">
          {isTokenEnabled ? (
            <>
              Desactivar
              <svg className="w-5 h-5 text-green-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </>
          ) : 'Activar'}
        </span>
      </button>

      {isTokenEnabled && <p className="text-sm text-green-600 mb-1">La autenticación de dos factores está activa.</p>}

      {showWarning && (
        <div className="flex items-center text-red-600 mb-2">
          <svg className="w-5 h-5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm">Desactivar la autenticación de dos factores pone en riesgo tu cuenta.</p>
        </div>
      )}

      {confirmDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => handleConfirmDialogClose(false)} aria-hidden="true" />
          <div className="relative bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl text-gray-900">Confirmar Desactivación</h3>
              <button
                onClick={() => handleConfirmDialogClose(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Cerrar"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro de que deseas desactivar la autenticación de dos factores? Esto pone en riesgo tu cuenta a cibercriminales.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => handleConfirmDialogClose(false)}
                className="px-5 py-2.5 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleConfirmDialogClose(true)}
                className="px-5 py-2.5 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}

      {snackbar.open && (
        <div className={`fixed bottom-6 left-6 z-50 animate-slideUp ${snackbar.severity === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white rounded-lg px-5 py-3 shadow-xl`}>
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
        <div className="fixed bottom-6 left-6 z-50 bg-red-600 text-white rounded-lg px-5 py-3 shadow-xl">
          <div className="flex items-center gap-2">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-2 text-white/80 hover:text-white" aria-label="Cerrar">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default TwoFactorAuthComponent;