"use client"

import { useContext, useState, useEffect } from "react"
import { styled } from "@mui/material/styles"
import {
  AppBar as MuiAppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Link,
  MenuItem,
  Menu,
  Avatar,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Grid,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Chip,
  Fade,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import {
  Menu as MenuIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  ShoppingBag as ShoppingBagIcon,
  MoreVert as MoreVertIcon,
  AddShoppingCart as AddShoppingCartIcon,
  ShoppingCart as ShoppingCartIcon,
  ContactMail as ContactMailIcon,
  RemoveShoppingCart as RemoveShoppingCartIcon,
} from "@mui/icons-material"
import CartDrawer from "./Cart"
import useAuth from "../hooks/useAuth"
import { AuthContext } from "../hooks/AuthContext"
import useProducts from "../hooks/useProducts"

const drawerWidth = 280

const AppBar = styled(MuiAppBar)(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: "linear-gradient(135deg, #2E7D32 0%, #4CAF50 50%, #66BB6A 100%)",
  boxShadow: "0 8px 32px rgba(76, 175, 80, 0.4)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: theme.transitions.create(["width", "margin", "box-shadow"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
    zIndex: -1,
  },
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 20,
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  border: "1px solid rgba(76, 175, 80, 0.1)",
  background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(76, 175, 80, 0.1)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: "linear-gradient(90deg, #2E7D32 0%, #4CAF50 50%, #66BB6A 100%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover": {
    transform: "translateY(-12px) scale(1.02)",
    boxShadow: "0 20px 60px rgba(76, 175, 80, 0.2), 0 8px 24px rgba(46, 125, 50, 0.15)",
    borderColor: "rgba(76, 175, 80, 0.3)",
    "&::before": {
      opacity: 1,
    },
  },
}))

const CategoryButton = styled(Button)(({ theme, selected }) => ({
  borderRadius: 30,
  padding: "12px 28px",
  fontWeight: 700,
  fontSize: "0.95rem",
  textTransform: "none",
  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  border: selected ? "none" : "2px solid rgba(76, 175, 80, 0.2)",
  background: selected 
    ? "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)" 
    : "rgba(255, 255, 255, 0.95)",
  color: selected ? "white" : "#2E7D32",
  backdropFilter: "blur(20px)",
  position: "relative",
  overflow: "hidden",
  boxShadow: selected 
    ? "0 8px 25px rgba(76, 175, 80, 0.3)" 
    : "0 4px 15px rgba(0, 0, 0, 0.05)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
    transition: "left 0.6s ease",
  },
  "&:hover": {
    transform: "translateY(-3px) scale(1.05)",
    boxShadow: selected 
      ? "0 12px 40px rgba(76, 175, 80, 0.4)" 
      : "0 8px 25px rgba(76, 175, 80, 0.2)",
    background: selected 
      ? "linear-gradient(135deg, #388E3C 0%, #4CAF50 100%)" 
      : "rgba(76, 175, 80, 0.1)",
    "&::before": {
      left: "100%",
    },
  },
}))

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "2px solid rgba(76, 175, 80, 0.1)",
    transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(46, 125, 50, 0.05) 100%)",
      opacity: 0,
      transition: "opacity 0.3s ease",
    },
    "&:hover": {
      backgroundColor: "white",
      borderColor: "rgba(76, 175, 80, 0.3)",
      boxShadow: "0 8px 25px rgba(76, 175, 80, 0.15)",
      transform: "translateY(-2px)",
      "&::before": {
        opacity: 1,
      },
    },
    "&.Mui-focused": {
      backgroundColor: "white",
      borderColor: "#4CAF50",
      boxShadow: "0 12px 40px rgba(76, 175, 80, 0.25)",
      transform: "translateY(-2px)",
      "&::before": {
        opacity: 1,
      },
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#4CAF50",
    fontWeight: 600,
  },
}))

const PaginationButton = styled(Button)(({ theme, active }) => ({
  minWidth: 48,
  height: 48,
  borderRadius: 16,
  margin: "0 6px",
  fontWeight: 700,
  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  background: active 
    ? "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)" 
    : "rgba(255, 255, 255, 0.95)",
  color: active ? "white" : "#2E7D32",
  border: active ? "none" : "2px solid rgba(76, 175, 80, 0.2)",
  backdropFilter: "blur(20px)",
  boxShadow: active 
    ? "0 8px 25px rgba(76, 175, 80, 0.3)" 
    : "0 4px 15px rgba(0, 0, 0, 0.05)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "0%",
    height: "0%",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    transition: "all 0.4s ease",
  },
  "&:hover": {
    transform: "translateY(-3px) scale(1.1)",
    boxShadow: active 
      ? "0 12px 40px rgba(76, 175, 80, 0.4)" 
      : "0 8px 25px rgba(76, 175, 80, 0.2)",
    "&::before": {
      width: "100%",
      height: "100%",
    },
  },
  "&:disabled": {
    opacity: 0.4,
    transform: "none",
    "&:hover": {
      transform: "none",
    },
  },
}))

const AnimatedChip = styled(Chip)(({ theme }) => ({
  background: "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)",
  color: "white",
  fontWeight: 700,
  fontSize: "1.1rem",
  height: 40,
  borderRadius: 20,
  transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)",
  },
}))

const ModernButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)",
  borderRadius: 16,
  fontWeight: 700,
  textTransform: "none",
  padding: "10px 24px",
  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  boxShadow: "0 4px 15px rgba(46, 125, 50, 0.3)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transition: "left 0.6s ease",
  },
  "&:hover": {
    background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)",
    transform: "translateY(-2px) scale(1.02)",
    boxShadow: "0 8px 25px rgba(46, 125, 50, 0.4)",
    "&::before": {
      left: "100%",
    },
  },
}))

function DashboardContent() {
  const { auth } = useContext(AuthContext)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { logoutUser } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { products, loading, error } = useProducts()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [primaryCategory, setPrimaryCategory] = useState({ value: "all", label: "Todos" })
  const [anchorOverflow, setAnchorOverflow] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])

  // Persist cart in localStorage
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
  const [searchKeyword, setSearchKeyword] = useState("")
  const [submittedKeyword, setSubmittedKeyword] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const handleCloseUserMenu = () => setAnchorElUser(null)
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget)

  const handleClickUserMenu = async (e) => {
    e.stopPropagation()
    const action = e.target.innerHTML
    if (action === "Logout") {
      await logoutUser()
      window.location.reload()
    } else if (action === "Settings") {
      history.push("/settings")
    }
    setAnchorElUser(null)
    setDrawerOpen(false)
  }

  const handleContactClick = () => alert("¡Se ha hecho clic en Contactar!")

  const handleOpenCart = () => setCartOpen(true)
  const handleCloseCart = () => setCartOpen(false)

  // Toast for add-to-cart feedback
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastSeverity, setToastSeverity] = useState("success")

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
    // show success toast instead of opening the cart drawer
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

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory)

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
    { label: `Hi, ${auth.firstName}`, icon: null },
    { label: "Settings", icon: <SettingsIcon sx={{ mr: 1 }} /> },
    { label: "Logout", icon: <LogoutIcon sx={{ mr: 1 }} /> },
  ]

  const navItems = [
    { href: "/create", label: "Vender productos", icon: <AddShoppingCartIcon sx={{ mr: 1 }} /> },
    { href: "/contactanos", label: "Contáctanos", icon: <ContactMailIcon sx={{ mr: 1 }} /> },
    // Replace the text 'Ubicaciones' with a cart icon; no functionality for now
    { href: "/ubicaciones", label: "", icon: <ShoppingCartIcon sx={{ fontSize: 28 }} />, isCart: true },
  ]

  const categories = [
    { value: "all", label: "Todos", icon: "🏪" },
    { value: "electronics", label: "Electrónicos", icon: "📱" },
    { value: "clothes", label: "Ropa", icon: "👕" },
    { value: "vehicles", label: "Vehículos", icon: "🚗" },
    { value: "medicina", label: "Medicina", icon: "💊" },
    { value: "comida", label: "Comida", icon: "🍲" },
  ]

  const renderNavLinks = () => (
    <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: 1 }}>
      {navItems.map(({ href, label, icon, isCart }) => (
        isCart ? (
          <Box key={href} sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
            <IconButton sx={{ color: 'white' }} aria-label="Carrito" onClick={handleOpenCart}>
              {icon}
            </IconButton>
          </Box>
        ) : (
          <Link
            key={label}
            href={href}
            sx={{
              textDecoration: "none",
              color: "white",
              px: 3,
              py: 1.5,
              borderRadius: 3,
              transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: 3,
                transform: "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.3s ease",
              },
              "&:hover": {
                transform: "translateY(-2px)",
                "&::before": {
                  transform: "scaleX(1)",
                },
              },
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "0.95rem", position: "relative", zIndex: 1, display: 'flex', alignItems: 'center' }}>
              {icon}
              {label}
            </Typography>
          </Link>
        )
      ))}
    </Box>
  )

  return (
    <>
      <AppBar position="absolute">
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: "24px",
            minHeight: 75,
          }}
        >
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ 
                position: "absolute", 
                left: 16,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1) rotate(90deg)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", ml: 3 }}>
            <Link href="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
              <Box
                sx={{
                  m: 1,
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.9) 100%)",
                  border: "3px solid rgba(255, 255, 255, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "0%",
                    height: "0%",
                    background: "rgba(76, 175, 80, 0.1)",
                    borderRadius: "50%",
                    transform: "translate(-50%, -50%)",
                    transition: "all 0.4s ease",
                  },
                  "&:hover": {
                    transform: "scale(1.15) rotate(10deg)",
                    boxShadow: "0 12px 35px rgba(76, 175, 80, 0.3)",
                    "&::before": {
                      width: "100%",
                      height: "100%",
                    },
                  },
                }}
              >
                <ShoppingBagIcon sx={{ color: "#4CAF50", fontSize: 32, zIndex: 1 }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "white",
                  ml: 2,
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                  textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                Silk Road
              </Typography>
            </Link>
          </Box>

          {!isMobile && renderNavLinks()}

          <Box>
            <Tooltip title="Configuración de usuario">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenUserMenu(e)
                }}
                sx={{ p: 0 }}
              >
                <Avatar
                  sx={{
                    background: `linear-gradient(135deg, ${getAvatarColor(auth.firstName)} 0%, ${getAvatarColor(auth.firstName)}CC 100%)`,
                    width: 46,
                    height: 46,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#fff",
                    border: "3px solid rgba(255, 255, 255, 0.3)",
                    transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    "&:hover": {
                      transform: "scale(1.15)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  {auth.firstName.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                sx: {
                  borderRadius: 4,
                  background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              {settings.map(({ label, icon }) => (
                <MenuItem
                  key={label}
                  onClick={handleClickUserMenu}
                  sx={{
                    py: 2,
                    px: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(76, 175, 80, 0.1)",
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  {icon}
                  <Typography textAlign="center" sx={{ fontWeight: 600 }}>
                    {label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Carrito Drawer */}
      <CartDrawer open={cartOpen} onClose={handleCloseCart} items={cartItems} onRemove={handleRemoveFromCart} onUpdateQty={handleUpdateQty} />

      <Snackbar open={toastOpen} autoHideDuration={3000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>

      {isMobile && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              background: "linear-gradient(180deg, #2E7D32 0%, #4CAF50 100%)",
              color: "white",
              width: drawerWidth,
              backdropFilter: "blur(20px)",
            },
          }}
        >
          <Box sx={{ width: drawerWidth, paddingTop: 10 }} role="presentation">
            <List>
              {navItems.map(({ href, label }) => (
                <ListItem
                  button
                  component={Link}
                  key={label}
                  href={href}
                  sx={{
                    py: 2,
                    mx: 2,
                    borderRadius: 3,
                    mb: 1,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      transform: "translateX(10px)",
                    },
                  }}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary={label} sx={{ color: "white" }} />
                </ListItem>
              ))}
              <Divider sx={{ my: 2, backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
              {settings.map(({ label, icon }) => (
                <ListItem
                  button
                  key={label}
                  onClick={handleClickUserMenu}
                  sx={{
                    py: 2,
                    mx: 2,
                    borderRadius: 3,
                    mb: 1,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      transform: "translateX(10px)",
                    },
                  }}
                >
                  {icon}
                  <ListItemText primary={label} sx={{ color: "white" }} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      )}

      {/* Header Section - Mejorado con efectos */}
      <Box sx={{ 
        marginTop: { xs: 6, md: 8 },
        py: 3, 
        textAlign: "center",
        background: "transparent",
        position: "relative",
      }}>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            background: "linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 900,
            letterSpacing: "-1px",
            textShadow: "0 4px 8px rgba(76, 175, 80, 0.1)",
            animation: "fadeInUp 0.8s ease-out",
          }}
        >
          Catálogo de Productos
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: "rgba(0,0,0,0.7)", 
            fontWeight: 500,
            letterSpacing: "0.5px",
            animation: "fadeInUp 0.8s ease-out 0.2s both",
          }}
        >
          Encuentra el producto que buscas en nuestra cuidada selección
        </Typography>
      </Box>

      {/* Search Section - Mejorado */}
      <Box sx={{ 
        px: { xs: 2, sm: 4, md: 6 }, 
        mb: 3,
        animation: "fadeInUp 0.8s ease-out 0.3s both",
      }}>
            <SearchField
              placeholder="Buscar productos..."
              variant="outlined"
              value={searchKeyword}
              onChange={handleKeywordChange}
              fullWidth
              sx={{ display: 'block', maxWidth: 700, mx: 'auto' }}
              InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#4CAF50" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <ModernButton
                  variant="contained"
                  onClick={handleSearch}
                  sx={{ px: 4 }}
                >
                  Buscar
                </ModernButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Categories Section - Mejorado */}
      <Box sx={{ 
        px: { xs: 2, sm: 4, md: 6 }, 
        mb: 3,
        animation: "fadeInUp 0.8s ease-out 0.45s both",
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 4, 
            fontWeight: 700, 
            color: "#2E7D32", 
            textAlign: "center",
            letterSpacing: "0.5px",
          }}
        >
          Categorías
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "nowrap", gap: 2, justifyContent: "center", alignItems: "center" }}>
          {/* Build visible categories: primary (which starts as Todos) + two more (excluding primary) */}
          {(() => {
            // If nothing is selected (selectedCategory === 'all'), show Todos as primary
            const currentPrimary = selectedCategory === 'all' ? { value: 'all', label: 'Todos' } : primaryCategory
            const visibleRest = categories.filter(c => c.value !== currentPrimary.value && c.value !== 'all').slice(0, 2)
            const overflow = categories.filter(c => c.value !== currentPrimary.value && c.value !== 'all' && !visibleRest.some(v => v.value === c.value))
            const items = [ currentPrimary, ...visibleRest ]
            return (
              <>
                {items.map(({ value, label }, index) => (
                  <Box key={value} sx={{ animation: `fadeInUp 0.6s ease-out ${0.8 + index * 0.1}s both` }}>
                    <CategoryButton
                      selected={selectedCategory === value}
                      onClick={() => handleCategoryChange(value)}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Typography sx={{ fontSize: "1.2rem" }}>{index === 0 ? '🏪' : ''}</Typography>
                        {label}
                      </Box>
                    </CategoryButton>
                  </Box>
                ))}

                {/* Three-dot overflow menu placed at the end */}
                {overflow.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      aria-label="Más categorías"
                      onClick={(e) => setAnchorOverflow(e.currentTarget)}
                      sx={{ ml: 1, color: '#2E7D32' }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorOverflow}
                      open={Boolean(anchorOverflow)}
                      onClose={() => setAnchorOverflow(null)}
                      PaperProps={{ sx: { borderRadius: 2 } }}
                    >
                      {/* Add an option to reset to Todos */}
                      <MenuItem
                        key="reset-all"
                        onClick={() => {
                          setPrimaryCategory({ value: 'all', label: 'Todos' })
                          setSelectedCategory('all')
                          setAnchorOverflow(null)
                        }}
                      >
                        <Typography sx={{ fontWeight: 700 }}>Mostrar Todos</Typography>
                      </MenuItem>
                      <Divider />
                      {overflow.map((cat) => (
                        <MenuItem
                          key={cat.value}
                          onClick={() => {
                            setPrimaryCategory({ value: cat.value, label: cat.label })
                            setSelectedCategory(cat.value)
                            setAnchorOverflow(null)
                          }}
                        >
                          <Typography sx={{ fontWeight: 700 }}>{cat.label}</Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                )}
              </>
            )
          })()}
        </Box>
      </Box>

      {/* Products Grid - Mejorado */}
      <Box sx={{ 
        px: { xs: 2, sm: 4, md: 6 }, 
        height: "calc(100vh - 280px)", 
        overflow: "auto",
        background: "transparent",
        "&::-webkit-scrollbar": {
          width: 8,
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(0,0,0,0.05)",
          borderRadius: 4,
        },
        "&::-webkit-scrollbar-thumb": {
          background: "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)",
          borderRadius: 4,
          "&:hover": {
            background: "linear-gradient(135deg, #388E3C 0%, #4CAF50 100%)",
          },
        },
      }}>
        {loading ? (
          <Box sx={{ p: 8, textAlign: "center" }}>
            <Typography variant="h6" sx={{ color: "text.secondary" }}>
              Cargando productos...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 8, textAlign: "center" }}>
            <Typography variant="h6" color="error">
              Error: {error}
            </Typography>
          </Box>
        ) : sortedProducts.length === 0 ? (
          <Box sx={{ p: 8, textAlign: "center" }}>
            <Typography variant="h6" sx={{ color: "text.secondary" }}>
              No se encontraron productos.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {displayProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                <Fade in={true} timeout={400 + index * 100}>
                  <StyledCard>
                    {product.photo && (
                      <Box
                        sx={{
                          height: 220,
                          width: "100%",
                          backgroundImage: `url(${product.photo})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          transition: "transform 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.03)",
                          },
                        }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          fontWeight: 800,
                          color: "#2E7D32",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.name}
                      </Typography>

                      {product.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 3,
                            color: "rgba(0,0,0,0.6)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.6,
                          }}
                        >
                          {product.description}
                        </Typography>
                      )}

                      <Box
                        sx={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "center", 
                          mt: "auto",
                          gap: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AnimatedChip label={`$${product.price}`} />
                          {/* show remove button if product is in cart, else show add button */}
                          {(() => {
                            const id = product._id || product.id
                            const cartItem = id ? cartItems.find((p) => (p._id || p.id) === id) : cartItems.find((p) => p.name === product.name)
                            if (cartItem) {
                              return (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography sx={{ fontWeight: 700 }}>{cartItem.qty || 1}</Typography>
                                  <IconButton color="warning" onClick={() => handleDecrementFromProduct(product)} sx={{ bgcolor: 'rgba(0,0,0,0.04)', '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' } }} aria-label="Quitar del carrito">
                                    <RemoveShoppingCartIcon sx={{ color: '#FBC02D' }} />
                                  </IconButton>
                                </Box>
                              )
                            }
                            return (
                              <IconButton color="primary" onClick={() => handleAddToCart(product)} sx={{ bgcolor: 'rgba(0,0,0,0.04)', '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' } }} aria-label="Agregar al carrito">
                                <AddShoppingCartIcon sx={{ color: '#2E7D32' }} />
                              </IconButton>
                            )
                          })()}
                        </Box>
                        <ModernButton
                          variant="contained"
                          size="small"
                          onClick={handleContactClick}
                          sx={{ px: 3 }}
                        >
                          Contactar
                        </ModernButton>
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination mejorada */}
        {totalPages > 1 && (
          <Box sx={{ p: 5, mt: 6, textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
              {/* Botón Anterior */}
              <PaginationButton
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                sx={{
                  px: 4,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                Atrás
              </PaginationButton>

              {/* Números de página */}
              {[...Array(totalPages).keys()].map((num) => {
                const page = num + 1
                return (
                  <PaginationButton
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                    sx={{
                      minWidth: 48,
                      height: 48,
                      fontWeight: page === currentPage ? 800 : 600,
                    }}
                  >
                    {page}
                  </PaginationButton>
                )
              })}

              {/* Botón Siguiente */}
              <PaginationButton
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                sx={{
                  px: 4,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                Next
              </PaginationButton>
            </Box>

            {/* Información adicional */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.6)", fontWeight: 600 }}>
                Página {currentPage} de {totalPages} • Mostrando {displayProducts.length} de {sortedProducts.length}{" "}
                productos
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}

export default DashboardContent