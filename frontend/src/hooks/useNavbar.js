import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import { AuthContext } from "./AuthContext";

const useNavbar = () => {
    const { auth } = useContext(AuthContext);
    const { logoutUser } = useAuth();
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const navItems = [
        { href: "/create", label: "Vender productos" },
        { href: "/contactanos", label: "Contáctanos" },
        { href: "/ubicaciones", label: "Ubicaciones" },
    ];

    const settings = [
        { label: "Settings", action: "settings" },
        { label: "Logout", action: "logout" },
    ];



    // OBTIENE UN COLOR DE AVATAR BASADO EN EL NOMBRE
    const getAvatarColor = (name) => {
        const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];
        return colors[name.charCodeAt(0) % colors.length];
    };



    // ABRE EL MENÚ DEL USUARIO
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);



    // CIERRA EL MENÚ DEL USUARIO
    const handleCloseUserMenu = () => setAnchorElUser(null);



    // MANEJA EL CLIC EN EL MENÚ DEL USUARIO
    const handleClickUserMenu = async (e, action) => {
        e.stopPropagation();
        if (action === "logout") {
            await logoutUser();
            window.location.reload();
        } else if (action === "settings") {
            navigate("/settings");
        }
        setAnchorElUser(null);
        setDrawerOpen(false);
    };

    return {
        auth,
        anchorElUser,
        drawerOpen,
        setDrawerOpen,
        navItems,
        settings,
        getAvatarColor,
        handleOpenUserMenu,
        handleCloseUserMenu,
        handleClickUserMenu
    };
};

export default useNavbar;
