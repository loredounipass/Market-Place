"use client"

import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const inputBase = "w-full px-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 focus:bg-white focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10"

function FieldIcon({ d, color = "text-gray-400" }) {
  return (
    <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
  )
}

function EyeIcon({ on }) {
  return (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {on ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      )}
    </svg>
  )
}

export default function Register() {
  const { registerUser, error } = useAuth()
  const isMounted = useRef(true)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setOpenSnackbar(true)
      return
    }

    const data = Object.fromEntries(new FormData(event.currentTarget))
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await registerUser(data)
    } catch (e) {
      if (isMounted.current) setOpenSnackbar(true)
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const passwordsMatch = password === confirmPassword || confirmPassword === ""

  return (
    <div className="h-screen bg-gray-100 overflow-hidden animate-fadeIn">
      <div className="flex h-full items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Crear cuenta
            </h1>
            <p className="text-sm text-gray-500">
              Únete a la comunidad de Silk Road
            </p>
          </div>

          <form noValidate onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nombre
                </label>
                <div className="relative">
                  <FieldIcon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  <input
                    autoComplete="given-name"
                    name="firstName"
                    required
                    id="firstName"
                    placeholder="Juan"
                    autoFocus
                    className={`${inputBase} pl-11 ${error ? "border-red-400" : ""}`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Apellidos
                </label>
                <div className="relative">
                  <FieldIcon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  <input
                    required
                    id="lastName"
                    placeholder="Pérez"
                    name="lastName"
                    autoComplete="family-name"
                    className={`${inputBase} pl-11 ${error ? "border-red-400" : ""}`}
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <FieldIcon d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                <input
                  required
                  type="email"
                  id="email"
                  placeholder="tu@correo.com"
                  name="email"
                  autoComplete="email"
                  className={`${inputBase} pl-11 ${error ? "border-red-400" : ""}`}
                />
              </div>
              {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <FieldIcon d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputBase} pl-11 pr-11 ${error ? "border-red-400" : ""}`}
                />
                <button
                  type="button"
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <EyeIcon on={showPassword} />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirmar contraseña
              </label>
              <div className="relative">
                {passwordsMatch && confirmPassword ? (
                  <FieldIcon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" color="text-green-500" />
                ) : (
                  <FieldIcon d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" color={!passwordsMatch ? "text-red-500" : "text-gray-400"} />
                )}
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${inputBase} pl-11 pr-11 ${!passwordsMatch ? "border-red-400 focus:border-red-500" : ""}`}
                />
                <button
                  type="button"
                  aria-label="toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <EyeIcon on={showConfirmPassword} />
                </button>
              </div>
              {!passwordsMatch && <p className="mt-1.5 text-xs text-red-500">Las contraseñas no coinciden</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !passwordsMatch}
              className="w-full py-3 rounded-lg bg-green-500 text-sm font-semibold text-white shadow-sm shadow-green-500/30 transition-all duration-200 hover:bg-green-600 active:scale-[0.99] disabled:bg-green-500/50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-white">Creando cuenta...</span>
                </span>
              ) : (
                "Registrarse"
              )}
            </button>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-500">¿Ya tienes una cuenta?{" "}</span>
              <Link to="/login" className="text-sm font-semibold text-green-600 hover:text-green-700">
                Inicia sesión aquí
              </Link>
            </div>
          </form>
        </div>
      </div>

      {openSnackbar && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slideDown" role="alert">
          <div className="flex items-center gap-2 px-5 py-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 shadow-lg">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error || (password !== confirmPassword ? "Las contraseñas no coinciden." : "Ha ocurrido un error al registrarse.")}</span>
            <button onClick={handleCloseSnackbar} className="ml-2 text-red-400 hover:text-red-600 transition-colors" aria-label="Cerrar">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </div>
  )
}