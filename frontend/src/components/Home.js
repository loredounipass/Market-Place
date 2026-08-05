"use client"

import { useContext, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import CartDrawer from "./Cart"
import useAuth from "../hooks/useAuth"
import { AuthContext } from "../hooks/AuthContext"
import useProducts from "../hooks/useProducts"

function DashboardContent() {
  const { auth } = useContext(AuthContext)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { logoutUser } = useAuth()
  const navigate = useNavigate()
  const { products, loading, error } = useProducts()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [primaryCategory, setPrimaryCategory] = useState({ value: "all", label: "Todos" })
  const [anchorOverflow, setAnchorOverflow] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [searchKeyword, setSearchKeyword] = useState("")
  const [submittedKeyword, setSubmittedKeyword] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastSeverity, setToastSeverity] = useState("success")

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cartItems")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setCartItems(parsed)
      }
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
    } catch (e) {
      console.warn("Failed to save cart to localStorage", e)
    }
  }, [cartItems])

  const handleCloseUserMenu = () => setAnchorElUser(null)
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget)

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

  const handleContactClick = () => alert("¡Se ha hecho clic en Contactar!")

  const handleOpenCart = () => setCartOpen(true)
  const handleCloseCart = () => setCartOpen(false)

  const showToast = (message, severity = "success") => {
    setToastMessage(message)
    setToastSeverity(severity)
    setToastOpen(true)
  }

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return
    setToastOpen(false)
  }

  const handleAddToCart = (product) => {
    const id = product._id || product.id
    setCartItems((prev) => {
      const exist = id ? prev.find((p) => (p._id || p.id) === id) : prev.find((p) => p.name === product.name)
      if (exist) {
        return prev.map((p) => ((p._id || p.id) === (exist._id || exist.id) || p.name === exist.name ? { ...p, qty: (p.qty || 1) + 1 } : p))
      }
      return [...prev, { ...product, qty: 1 }]
    })
    showToast("Se ha agregado con éxito", "success")
  }

  const handleDecrementFromProduct = (product) => {
    const id = product._id || product.id
    const exist = id ? cartItems.find((p) => (p._id || p.id) === id) : cartItems.find((p) => p.name === product.name)
    if (!exist) return
    if ((exist.qty || 1) > 1) {
      handleUpdateQty(exist, (exist.qty || 1) - 1)
      showToast("Se ha quitado 1 unidad del carrito", "warning")
    } else {
      handleRemoveFromCart(exist)
      showToast("Se ha quitado del carrito", "warning")
    }
  }

  const handleRemoveFromCart = (item) => {
    const id = item._id || item.id
    setCartItems((prev) => prev.filter((p) => id ? (p._id || p.id) !== id : p.name !== item.name))
  }

  const handleUpdateQty = (item, qty) => {
    const id = item._id || item.id
    setCartItems((prev) => prev.map((p) => (id ? ((p._id || p.id) === id ? { ...p, qty } : p) : (p.name === item.name ? { ...p, qty } : p))))
  }

  const getAvatarColor = (name) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"]
    return colors[name.charCodeAt(0) % colors.length]
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleKeywordChange = (e) => setSearchKeyword(e.target.value)

  const handleSearch = () => {
    setSubmittedKeyword(searchKeyword)
    setCurrentPage(1)
  }

  const filteredProducts = selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory)

  const searchFilteredProducts = filteredProducts.filter((product) => {
    const key = submittedKeyword.toLowerCase()
    if (!key) return true
    const name = product.name?.toLowerCase() || ""
    const description = product.description?.toLowerCase() || ""
    return name.includes(key) || description.includes(key)
  })

  const sortedProducts = [...searchFilteredProducts].sort((a, b) => a.name.localeCompare(b.name))

  const productsPerPage = 12
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
  const displayProducts = sortedProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)

  if (!auth) return null

  const settings = [
    { label: "Settings", action: "settings" },
    { label: "Logout", action: "logout" },
  ]

  const navItems = [
    { href: "/create", label: "Vender productos" },
    { href: "/contactanos", label: "Contáctanos" },
    { href: "/ubicaciones", label: "Carrito", isCart: true },
  ]

  const categories = [
    { value: "all", label: "Todos" },
    { value: "electronics", label: "Electrónicos" },
    { value: "clothes", label: "Ropa" },
    { value: "vehicles", label: "Vehículos" },
    { value: "medicina", label: "Medicina" },
    { value: "comida", label: "Comida" },
  ]

  const cartIcon = (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )

  const renderNavLinks = () => (
    <nav className="hidden lg:flex items-center gap-2">
      {navItems.map(({ href, label, isCart }) => (
        isCart ? (
          <button
            key={href}
            onClick={handleOpenCart}
            className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Carrito"
          >
            {cartIcon}
          </button>
        ) : (
          <Link
            key={label}
            to={href}
            className="text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium text-sm relative overflow-hidden"
          >
            {label}
          </Link>
        )
      ))}
    </nav>
  )

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-green-800 via-green-600 to-green-400 shadow-lg shadow-green-500/30 border-b border-white/10">
        <div className="flex items-center justify-between h-18 px-6">
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
              <div className="m-2 w-15 h-15 rounded-full bg-gradient-to-br from-white to-gray-100 border-3 border-white/30 flex items-center justify-center shadow-lg shadow-green-500/20 transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-xl hover:shadow-green-500/30">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h1 className="ml-3 text-2xl font-bold tracking-wide text-shadow-lg">Silk Road</h1>
            </Link>
          </div>

          {renderNavLinks()}

          <div className="relative">
            <button
              onClick={handleOpenUserMenu}
              className="p-0"
              aria-label="Configuración de usuario"
            >
              <div
                className="w-11 h-11 rounded-full font-bold text-white border-3 border-white/30 flex items-center justify-center shadow-lg shadow-black/20 transition-all duration-300 hover:scale-115 hover:shadow-xl hover:shadow-black/30"
                style={{ background: `linear-gradient(135deg, ${getAvatarColor(auth.firstName)} 0%, ${getAvatarColor(auth.firstName)}CC 100%)` }}
              >
                {auth.firstName.charAt(0)}
              </div>
            </button>

            {anchorElUser && (
              <div
                className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-fadeIn"
                role="menu"
              >
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-medium text-gray-900 text-center">Hi, {auth.firstName}</p>
                </div>
                {settings.map(({ label, action }) => (
                  <button
                    key={label}
                    onClick={(e) => handleClickUserMenu(e, action)}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
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

      <CartDrawer open={cartOpen} onClose={handleCloseCart} items={cartItems} onRemove={handleRemoveFromCart} onUpdateQty={handleUpdateQty} />

      <div className="fixed bottom-6 right-6 z-50 animate-slideUp" role="alert">
        {toastOpen && (
          <div
            className={`flex items-center px-6 py-4 rounded-xl shadow-2xl border transition-all duration-300 ${toastSeverity === "success"
                ? "bg-green-600 text-white border-green-500"
                : "bg-yellow-600 text-white border-yellow-500"
              }`}
          >
            <span className="font-medium">{toastMessage}</span>
            <button
              onClick={handleCloseToast}
              className="ml-4 text-white/80 hover:text-white transition-opacity"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-green-800 to-green-600 text-white shadow-xl transform transition-transform" style={{ transform: 'translateX(0)' }}>
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
          <div className="fixed inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
        </div>
      )}

      <main className="pt-20 lg:pt-24 animate-fadeIn">
        <section className="py-8 px-4 text-center" aria-labelledby="catalog-title">
          <h2 id="catalog-title" className="mb-3 text-4xl font-black bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent animate-fadeInUp">
            Catálogo de Productos
          </h2>
          <p className="text-xl text-gray-600 font-medium animate-fadeInUp delay-100">
            Encuentra el producto que buscas en nuestra cuidada selección
          </p>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 mb-8 animate-fadeInUp delay-200 flex-shrink-0" aria-labelledby="search-title">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchKeyword}
                onChange={handleKeywordChange}
                className="w-full pl-12 pr-24 py-4 bg-white/95 backdrop-blur-xl border-2 border-green-200 rounded-2xl shadow-lg shadow-green-500/10 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 focus:bg-white focus:shadow-xl focus:shadow-green-500/20 transition-all duration-300 hover:border-green-300 hover:shadow-xl hover:shadow-green-500/20"
                aria-label="Buscar productos"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-green-800 to-green-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-green-500/30 hover:from-green-900 hover:to-green-700 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-105"
              >
                Buscar
              </button>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 mb-8 animate-fadeInUp delay-300 flex-shrink-0" aria-labelledby="categories-title">
          <h3 id="categories-title" className="mb-6 text-2xl font-bold text-green-900 text-center">Categorías</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {(() => {
              const currentPrimary = selectedCategory === 'all' ? { value: 'all', label: 'Todos' } : primaryCategory
              const visibleRest = categories.filter(c => c.value !== currentPrimary.value && c.value !== 'all').slice(0, 2)
              const overflow = categories.filter(c => c.value !== currentPrimary.value && c.value !== 'all' && !visibleRest.some(v => v.value === c.value))
              const items = [currentPrimary, ...visibleRest]
              return (
                <>
                  {items.map(({ value, label }, index) => (
                    <button
                      key={value}
                      onClick={() => handleCategoryChange(value)}
                      className={`px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 shadow-lg ${selectedCategory === value
                          ? "bg-gradient-to-r from-green-600 to-green-400 text-white shadow-green-500/40 scale-105"
                          : "bg-white/95 backdrop-blur-xl text-green-800 border-2 border-green-200 shadow-green-500/10 hover:bg-green-50 hover:border-green-300 hover:shadow-xl hover:shadow-green-500/20 hover:scale-105 hover:-translate-y-1"
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                  {overflow.length > 0 && (
                    <div className="relative">
                      <button
                        onClick={(e) => setAnchorOverflow(e.currentTarget)}
                        className="px-4 py-3 rounded-full bg-white/95 backdrop-blur-xl text-green-800 border-2 border-green-200 shadow-lg shadow-green-500/10 hover:bg-green-50 hover:border-green-300 hover:shadow-xl hover:shadow-green-500/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                        aria-label="Más categorías"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      {anchorOverflow && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-fadeIn">
                          <button
                            onClick={() => {
                              setPrimaryCategory({ value: 'all', label: 'Todos' })
                              setSelectedCategory('all')
                              setAnchorOverflow(null)
                            }}
                            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors font-bold"
                          >
                            Mostrar Todos
                          </button>
                          <hr className="my-2 border-gray-200" />
                          {overflow.map((cat) => (
                            <button
                              key={cat.value}
                              onClick={() => {
                                setPrimaryCategory({ value: cat.value, label: cat.label })
                                setSelectedCategory(cat.value)
                                setAnchorOverflow(null)
                              }}
                              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors font-bold"
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 animate-fadeInUp delay-400 flex-1 min-h-0" aria-labelledby="products-title">
          <div className="h-full overflow-auto custom-scrollbar">
            {loading ? (
              <div className="py-20 text-center">
                <p className="text-xl text-gray-500">Cargando productos...</p>
              </div>
            ) : error ? (
              <div className="py-20 text-center">
                <p className="text-xl text-red-600">Error: {error}</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-xl text-gray-500">No se encontraron productos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayProducts.map((product, index) => (
                  <article key={index} className="group bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-green-100 shadow-lg shadow-green-500/10 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 hover:border-green-300 hover:-translate-y-3 hover:scale-[1.02] animate-fadeInUp" style={{ animationDelay: `${index * 50}ms` }}>
                    {product.photo && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={product.photo}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="mb-3 font-black text-xl text-green-900 truncate">{product.name}</h3>

                      {product.description && (
                        <p className="mb-4 text-gray-600 line-clamp-3 leading-relaxed">{product.description}</p>
                      )}

                      <div className="mt-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-400 text-white font-bold text-lg rounded-full shadow-lg shadow-green-500/30">
                            ${product.price}
                          </span>
                          {(() => {
                            const id = product._id || product.id
                            const cartItem = id ? cartItems.find((p) => (p._id || p.id) === id) : cartItems.find((p) => p.name === product.name)
                            if (cartItem) {
                              return (
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-green-800 bg-green-50 px-3 py-1.5 rounded-full">{cartItem.qty || 1}</span>
                                  <button
                                    onClick={() => handleDecrementFromProduct(product)}
                                    className="p-2 text-yellow-600 bg-yellow-50 rounded-full hover:bg-yellow-100 hover:text-yellow-700 transition-colors"
                                    aria-label="Quitar del carrito"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                  </button>
                                </div>
                              )
                            }
                            return (
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="p-2 text-green-800 bg-green-50 rounded-full hover:bg-green-100 hover:text-green-900 transition-colors"
                                aria-label="Agregar al carrito"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            )
                          })()}
                        </div>
                        <button
                          onClick={handleContactClick}
                          className="px-5 py-2 bg-gradient-to-r from-green-800 to-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:from-green-900 hover:to-green-700 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-105"
                        >
                          Contactar
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="py-10 mt-12 text-center">
                <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-5 py-2.5 rounded-xl font-bold text-base transition-all duration-300 ${currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white/95 backdrop-blur-xl text-green-800 border-2 border-green-200 shadow-lg shadow-green-500/10 hover:bg-green-50 hover:border-green-300 hover:shadow-xl hover:shadow-green-500/20 hover:scale-105 hover:-translate-y-1"
                      }`}
                  >
                    Atrás
                  </button>

                  {[...Array(totalPages).keys()].map((num) => {
                    const page = num + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 ${page === currentPage
                            ? "bg-gradient-to-r from-green-600 to-green-400 text-white shadow-lg shadow-green-500/40 scale-110 font-black"
                            : "bg-white/95 backdrop-blur-xl text-green-800 border-2 border-green-200 shadow-lg shadow-green-500/10 hover:bg-green-50 hover:border-green-300 hover:shadow-xl hover:shadow-green-500/20 hover:scale-105 hover:-translate-y-1"
                          }`}
                      >
                        {page}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-5 py-2.5 rounded-xl font-bold text-base transition-all duration-300 ${currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white/95 backdrop-blur-xl text-green-800 border-2 border-green-200 shadow-lg shadow-green-500/10 hover:bg-green-50 hover:border-green-300 hover:shadow-xl hover:shadow-green-500/20 hover:scale-105 hover:-translate-y-1"
                      }`}
                  >
                    Next
                  </button>
                </div>

                <p className="text-gray-600 font-semibold">
                  Página {currentPage} de {totalPages} • Mostrando {displayProducts.length} de {sortedProducts.length} productos
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #388E3C 0%, #4CAF50 100%);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
      `}</style>
    </>
  )
}

export default DashboardContent