"use client"

import { useState, useRef, useEffect } from "react"
import {
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Link,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
  Container,
  Fade,
  Slide,
  CircularProgress,
} from "@mui/material"
import {
  Visibility,
  VisibilityOff,
  ShoppingBag,
  Person,
  Email,
  Lock,
  PersonAdd,
  CheckCircle,
} from "@mui/icons-material"
import useAuth from "../hooks/useAuth"

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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f1f3f4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: "transparent",
              backdropFilter: "none",
              border: "none",
              boxShadow: "none",
              position: "relative",
              overflow: "visible",
            }}
          >
            {/* Logo y Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Slide direction="down" in={true} timeout={600}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)",
                    boxShadow: "0 8px 32px rgba(76, 175, 80, 0.3)",
                    mb: 3,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      inset: -4,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #4CAF50, #66BB6A)",
                      zIndex: -1,
                      opacity: 0.3,
                      animation: "pulse 2s ease-in-out infinite",
                    },
                  }}
                >
                  <ShoppingBag sx={{ color: "white", fontSize: 48 }} />
                </Box>
              </Slide>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                  letterSpacing: "-0.5px",
                }}
              >
                Silk Road
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "text.secondary",
                  fontWeight: 400,
                  mb: 1,
                }}
              >
                Únete a nuestra comunidad
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  opacity: 0.8,
                }}
              >
                Crea tu cuenta y comienza a vender
              </Typography>
            </Box>

            {/* Formulario */}
            <Box component="form" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="Nombre"
                    autoFocus
                    error={!!error}
                    helperText={error ? error : ""}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "#4CAF50" }} />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 3,
                          backgroundColor: "rgba(248, 249, 250, 0.8)",
                          border: "2px solid transparent",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderColor: "rgba(76, 175, 80, 0.3)",
                            boxShadow: "0 4px 15px rgba(76, 175, 80, 0.1)",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "white",
                            borderColor: "#4CAF50",
                            boxShadow: "0 4px 20px rgba(76, 175, 80, 0.2)",
                          },
                        },
                      },
                      inputLabel: {
                        sx: {
                          "&.Mui-focused": {
                            color: "#4CAF50",
                          },
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Apellidos"
                    name="lastName"
                    autoComplete="family-name"
                    error={!!error}
                    helperText={error ? error : ""}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "#4CAF50" }} />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 3,
                          backgroundColor: "rgba(248, 249, 250, 0.8)",
                          border: "2px solid transparent",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderColor: "rgba(76, 175, 80, 0.3)",
                            boxShadow: "0 4px 15px rgba(76, 175, 80, 0.1)",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "white",
                            borderColor: "#4CAF50",
                            boxShadow: "0 4px 20px rgba(76, 175, 80, 0.2)",
                          },
                        },
                      },
                      inputLabel: {
                        sx: {
                          "&.Mui-focused": {
                            color: "#4CAF50",
                          },
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Correo electrónico"
                    name="email"
                    autoComplete="email"
                    error={!!error}
                    helperText={error ? error : ""}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: "#4CAF50" }} />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 3,
                          backgroundColor: "rgba(248, 249, 250, 0.8)",
                          border: "2px solid transparent",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderColor: "rgba(76, 175, 80, 0.3)",
                            boxShadow: "0 4px 15px rgba(76, 175, 80, 0.1)",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "white",
                            borderColor: "#4CAF50",
                            boxShadow: "0 4px 20px rgba(76, 175, 80, 0.2)",
                          },
                        },
                      },
                      inputLabel: {
                        sx: {
                          "&.Mui-focused": {
                            color: "#4CAF50",
                          },
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Contraseña"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!error}
                    helperText={error ? error : ""}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: "#4CAF50" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              sx={{
                                color: "#4CAF50",
                                "&:hover": {
                                  backgroundColor: "rgba(76, 175, 80, 0.08)",
                                },
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 3,
                          backgroundColor: "rgba(248, 249, 250, 0.8)",
                          border: "2px solid transparent",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderColor: "rgba(76, 175, 80, 0.3)",
                            boxShadow: "0 4px 15px rgba(76, 175, 80, 0.1)",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "white",
                            borderColor: "#4CAF50",
                            boxShadow: "0 4px 20px rgba(76, 175, 80, 0.2)",
                          },
                        },
                      },
                      inputLabel: {
                        sx: {
                          "&.Mui-focused": {
                            color: "#4CAF50",
                          },
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirmar contraseña"
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!passwordsMatch}
                    helperText={!passwordsMatch ? "Las contraseñas no coinciden" : ""}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            {passwordsMatch && confirmPassword ? (
                              <CheckCircle sx={{ color: "#4CAF50" }} />
                            ) : (
                              <Lock sx={{ color: !passwordsMatch ? "#f44336" : "#4CAF50" }} />
                            )}
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              sx={{
                                color: "#4CAF50",
                                "&:hover": {
                                  backgroundColor: "rgba(76, 175, 80, 0.08)",
                                },
                              }}
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 3,
                          backgroundColor: "rgba(248, 249, 250, 0.8)",
                          border: `2px solid ${!passwordsMatch ? "#f44336" : "transparent"}`,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderColor: !passwordsMatch ? "#f44336" : "rgba(76, 175, 80, 0.3)",
                            boxShadow: `0 4px 15px ${!passwordsMatch ? "rgba(244, 67, 54, 0.1)" : "rgba(76, 175, 80, 0.1)"}`,
                          },
                          "&.Mui-focused": {
                            backgroundColor: "white",
                            borderColor: !passwordsMatch ? "#f44336" : "#4CAF50",
                            boxShadow: `0 4px 20px ${!passwordsMatch ? "rgba(244, 67, 54, 0.2)" : "rgba(76, 175, 80, 0.2)"}`,
                          },
                        },
                      },
                      inputLabel: {
                        sx: {
                          "&.Mui-focused": {
                            color: !passwordsMatch ? "#f44336" : "#4CAF50",
                          },
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !passwordsMatch}
                sx={{
                  mt: 4,
                  py: 2,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)",
                  boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  textTransform: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #388E3C 0%, #4CAF50 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(76, 175, 80, 0.4)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                  "&:disabled": {
                    background: "rgba(76, 175, 80, 0.3)",
                    transform: "none",
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CircularProgress size={24} sx={{ color: "white" }} />
                    <Typography sx={{ color: "white", fontWeight: 600 }}>Creando cuenta...</Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonAdd />
                    Registrarse
                  </Box>
                )}
              </Button>

              {/* Enlaces */}
              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Link
                  href="/login"
                  sx={{
                    color: "#4CAF50",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#2E7D32",
                      textDecoration: "underline",
                      textDecorationColor: "#4CAF50",
                    },
                  }}
                >
                  ¿Ya tienes una cuenta? Inicia sesión aquí
                </Link>
              </Box>
            </Box>

            {/* Decoración */}
            <Box
              sx={{
                position: "absolute",
                top: -100,
                right: -100,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -80,
                left: -80,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
          </Paper>
        </Fade>

        {/* Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{
              width: "100%",
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(244, 67, 54, 0.2)",
            }}
          >
            {error || "Ha ocurrido un error al registrarse."}
          </Alert>
        </Snackbar>
      </Container>

      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }
      `}</style>
    </Box>
  )
}
