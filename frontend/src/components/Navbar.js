"use client"

import React, { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { AuthContext } from "../hooks/AuthContext"

export default function Navbar() {
  const { auth } = useContext(AuthContext)
  const { logoutUser } = useAuth()
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  if (!auth) return null

  const navItems = [
    { href: "/create", label: "Vender productos" },
    { href: "/contactanos", label: "Contáctanos" },
    { href: "/ubicaciones", label: "Ubicaciones" },
  ]

  const settings = [
    { label: "Settings", action: "settings" },
    { label: "Logout", action: "logout" },
  ]

  const getAvatarColor = (name) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"]
    return colors[name.charCodeAt(0) % colors.length]
  }

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget)
  const handleCloseUserMenu = () => setAnchorElUser(null)

  const handleClickUserMenu = async (e, action) => {
    e.stopPropagation()
    if (action === "logout") {
      await logoutUser()
      window.location.reload()
    } else if (action === "settings") {
      navigate("/settings")
    }
    setAnchorElUser(null)
    setDrawerOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-green-800 via-green-600 to-green-400 shadow-lg shadow-green-500/30">
        <div className="flex items-center justify-between h-16 px-6">
          <button 
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            onClick={() => setDrawerOpen(true)}
            aria-label="menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center">
            <Link to="/" className="flex items-center text-decoration-none text-white">
              <div className="m-2 w-14 h-14 rounded-full bg-gradient-to-br from-white to-gray-100 border-3 border-white/30 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h1 className="ml-2 text-xl font-bold tracking-wide">Silk Road</h1>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map(({ href, label }) => (
              <Link 
                key={label} 
                to={href} 
                className="text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium text-sm"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="relative">
            <button 
              onClick={handleOpenUserMenu}
              className="p-0"
              aria-label="Configuración de usuario"
            >
              <div 
                className="w-10 h-10 rounded-full font-bold text-white border-3 border-white/30 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${getAvatarColor(auth.firstName)} 0%, ${getAvatarColor(auth.firstName)}CC 100%)` }}
              >
                {auth.firstName.charAt(0)}
              </div>
            </button>

            {anchorElUser && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                role="menu"
              >
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="font-medium text-gray-900 text-center">Hi, {auth.firstName}</p>
                </div>
                {settings.map(({ label, action }) => (
                  <button
                    key={label}
                    onClick={(e) => handleClickUserMenu(e, action)}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                    role="menuitem"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-green-800 to-green-600 text-white shadow-xl transform transition-transform"
            style={{ transform: 'translateX(0)' }}
          >
            <div className="pt-10">
              <nav>
                {navItems.map(({ href, label }) => (
                  <Link 
                    key={label} 
                    to={href} 
                    onClick={() => setDrawerOpen(false)}
                    className="block px-6 py-3 mx-4 rounded-lg mb-2 hover:bg-white/10 transition-colors font-medium"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setDrawerOpen(false)} 
            aria-hidden="true"
          />
        </div>
      )}

      <div className="pt-16 lg:pt-20 min-h-screen" />
    </>
  )
}