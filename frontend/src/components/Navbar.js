"use client"

import React, { useState, useContext } from "react"
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
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Menu as MenuIcon, Settings as SettingsIcon, ExitToApp as LogoutIcon } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { AuthContext } from "../hooks/AuthContext"
import { ShoppingBag as ShoppingBagIcon } from "@mui/icons-material"

const drawerWidth = 280

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: "linear-gradient(135deg, #2E7D32 0%, #4CAF50 50%, #66BB6A 100%)",
  boxShadow: "0 4px 20px rgba(76, 175, 80, 0.3)",
  backdropFilter: "blur(10px)",
}))

export default function Navbar() {
  const { auth } = useContext(AuthContext)
  const { logoutUser } = useAuth()
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  if (!auth) return null

  const navItems = [
    { href: "/create", label: "Vender productos" },
    { href: "/contactanos", label: "Contáctanos" },
    { href: "/ubicaciones", label: "Ubicaciones" },
  ]

  const settings = [
    { label: `Hi, ${auth.firstName}`, icon: null },
    { label: "Settings", icon: <SettingsIcon sx={{ mr: 1 }} /> },
    { label: "Logout", icon: <LogoutIcon sx={{ mr: 1 }} /> },
  ]

  const getAvatarColor = (name) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"]
    return colors[name.charCodeAt(0) % colors.length]
  }

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget)
  const handleCloseUserMenu = () => setAnchorElUser(null)

  const handleClickUserMenu = async (e) => {
    e.stopPropagation()
    const action = e.target.innerHTML
    if (action === "Logout") {
      await logoutUser()
      window.location.reload()
    } else if (action === "Settings") {
      navigate("/settings")
    }
    setAnchorElUser(null)
    setDrawerOpen(false)
  }

  return (
    <>
      <AppBar position="absolute">
        <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: "24px", minHeight: 70 }}>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)} sx={{ position: "absolute", left: 16 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", ml: 3 }}>
            <Link href="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
              <Box sx={{ m: 1, width: 55, height: 55, borderRadius: "50%", background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)", border: "3px solid rgba(255, 255, 255, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingBagIcon sx={{ color: "#4CAF50", fontSize: 28 }} />
              </Box>
              <Typography variant="h5" sx={{ display: "flex", alignItems: "center", color: "white", ml: 2, fontWeight: 700, letterSpacing: "0.5px" }}>
                Silk Road
              </Typography>
            </Link>
          </Box>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: 1 }}>
              {navItems.map(({ href, label }) => (
                <Link key={label} href={href} sx={{ textDecoration: "none", color: "white", px: 3, py: 1, borderRadius: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>{label}</Typography>
                </Link>
              ))}
            </Box>
          )}

          <Box>
            <Tooltip title="Configuración de usuario">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ background: `linear-gradient(135deg, ${getAvatarColor(auth.firstName)} 0%, ${getAvatarColor(auth.firstName)}CC 100%)`, width: 42, height: 42, fontSize: 18, fontWeight: "bold", color: "#fff", border: "3px solid rgba(255, 255, 255, 0.3)" }}>
                  {auth.firstName.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu sx={{ mt: '45px' }} anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
              {settings.map(({ label, icon }) => (
                <MenuItem key={label} onClick={handleClickUserMenu} sx={{ py: 1.5, px: 3 }}>{icon}<Typography textAlign="center" sx={{ fontWeight: 500 }}>{label}</Typography></MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{ '& .MuiDrawer-paper': { background: 'linear-gradient(180deg, #2E7D32 0%, #4CAF50 100%)', color: 'white', width: drawerWidth } }}>
          <Box sx={{ width: drawerWidth, paddingTop: 10 }} role="presentation">
            <List>
              {navItems.map(({ href, label }) => (
                <ListItem button component={Link} key={label} href={href} sx={{ py: 2, mx: 2, borderRadius: 2, mb: 1 }} onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary={label} sx={{ color: "white" }} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      )}

      <Box sx={{ marginTop: { xs: 10, md: 12 } }} />
    </>
  )
}
