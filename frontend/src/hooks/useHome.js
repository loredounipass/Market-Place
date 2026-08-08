import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import { AuthContext } from "./AuthContext";
import useProducts from "./useProducts";

const useHome = () => {
    const { auth } = useContext(AuthContext);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { logoutUser } = useAuth();
    const navigate = useNavigate();
    const { products, loading, error, getProducts } = useProducts();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [primaryCategory, setPrimaryCategory] = useState({ value: "all", label: "Todos" });
    const [anchorOverflow, setAnchorOverflow] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [submittedKeyword, setSubmittedKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity, setToastSeverity] = useState("success");
    const userMenuRef = useRef(null);

    // CARGA LOS ARTÍCULOS DEL CARRITO DESDE LOCALSTORAGE AL MONTAR
    useEffect(() => {
        try {
            const raw = localStorage.getItem("cartItems");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) setCartItems(parsed);
            }
        } catch (e) {
            console.warn("Failed to load cart from localStorage", e);
        }
    }, []);



    // GUARDA LOS ARTÍCULOS DEL CARRITO EN LOCALSTORAGE
    useEffect(() => {
        try {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        } catch (e) {
            console.warn("Failed to save cart to localStorage", e);
        }
    }, [cartItems]);



    // MANEJA EL CLIC FUERA DEL MENÚ DE USUARIO PARA CERRARLO
    useEffect(() => {
        if (!anchorElUser) return;

        const handlePointerDown = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setAnchorElUser(null);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        return () => document.removeEventListener("mousedown", handlePointerDown);
    }, [anchorElUser]);



    // CIERRA EL MENÚ DEL USUARIO
    const handleCloseUserMenu = () => setAnchorElUser(null);



    // ABRE EL MENÚ DEL USUARIO
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);



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



    // MANEJA EL CLIC EN EL BOTÓN CONTACTAR
    const handleContactClick = () => alert("¡Se ha hecho clic en Contactar!");



    // ABRE EL CARRITO DE COMPRAS
    const handleOpenCart = () => setCartOpen(true);



    // CIERRA EL CARRITO DE COMPRAS
    const handleCloseCart = () => setCartOpen(false);



    // MUESTRA UN TOAST CON MENSAJE
    const showToast = (message, severity = "success") => {
        setToastMessage(message);
        setToastSeverity(severity);
        setToastOpen(true);
    };



    // CIERRA EL TOAST DE MENSAJE
    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') return;
        setToastOpen(false);
    };



    // AGREGA UN PRODUCTO AL CARRITO
    const handleAddToCart = (product) => {
        const id = product._id || product.id;
        setCartItems((prev) => {
            const exist = id ? prev.find((p) => (p._id || p.id) === id) : prev.find((p) => p.name === product.name);
            if (exist) {
                return prev.map((p) => ((p._id || p.id) === (exist._id || exist.id) || p.name === exist.name ? { ...p, qty: (p.qty || 1) + 1 } : p));
            }
            return [...prev, { ...product, qty: 1 }];
        });
        showToast("Se ha agregado con éxito", "success");
    };



    // QUITA UNA UNIDAD DEL PRODUCTO O LO ELIMINA DEL CARRITO
    const handleDecrementFromProduct = (product) => {
        const id = product._id || product.id;
        const exist = id ? cartItems.find((p) => (p._id || p.id) === id) : cartItems.find((p) => p.name === product.name);
        if (!exist) return;
        if ((exist.qty || 1) > 1) {
            handleUpdateQty(exist, (exist.qty || 1) - 1);
            showToast("Se ha quitado 1 unidad del carrito", "warning");
        } else {
            handleRemoveFromCart(exist);
            showToast("Se ha quitado del carrito", "warning");
        }
    };



    // ELIMINA TOTALMENTE UN PRODUCTO DEL CARRITO
    const handleRemoveFromCart = (item) => {
        const id = item._id || item.id;
        setCartItems((prev) => prev.filter((p) => id ? (p._id || p.id) !== id : p.name !== item.name));
    };



    // ACTUALIZA LA CANTIDAD DE UN PRODUCTO EN EL CARRITO
    const handleUpdateQty = (item, qty) => {
        const id = item._id || item.id;
        setCartItems((prev) => prev.map((p) => (id ? ((p._id || p.id) === id ? { ...p, qty } : p) : (p.name === item.name ? { ...p, qty } : p))));
    };



    // OBTIENE UN COLOR DE AVATAR BASADO EN EL NOMBRE
    const getAvatarColor = (name) => {
        const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];
        return colors[name.charCodeAt(0) % colors.length];
    };



    // MANEJA EL CAMBIO DE CATEGORÍA
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };



    // MANEJA EL CAMBIO DE TEXTO DE BÚSQUEDA
    const handleKeywordChange = (e) => setSearchKeyword(e.target.value);



    // MANEJA LA BÚSQUEDA DE PRODUCTOS
    const handleSearch = () => {
        setSubmittedKeyword(searchKeyword);
        setCurrentPage(1);
        getProducts(searchKeyword);
    };

    const filteredProducts = selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory);
    const sortedProducts = [...filteredProducts].sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    const productsPerPage = 12;
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const displayProducts = sortedProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    const settings = [
        { label: "Settings", action: "settings" },
        { label: "Logout", action: "logout" },
    ];

    const navItems = [
        { href: "/create", label: "Vender productos" },
        { href: "/contactanos", label: "Contáctanos" },
        { href: "/ubicaciones", label: "Carrito", isCart: true },
    ];

    const categories = [
        { value: "all", label: "Todos" },
        { value: "electronics", label: "Electrónicos" },
        { value: "clothes", label: "Ropa" },
        { value: "vehicles", label: "Vehículos" },
        { value: "medicina", label: "Medicina" },
        { value: "comida", label: "Comida" },
    ];

    return {
        auth,
        anchorElUser,
        drawerOpen,
        setDrawerOpen,
        loading,
        error,
        selectedCategory,
        setSelectedCategory,
        primaryCategory,
        setPrimaryCategory,
        anchorOverflow,
        setAnchorOverflow,
        cartOpen,
        cartItems,
        searchKeyword,
        currentPage,
        setCurrentPage,
        toastOpen,
        toastMessage,
        toastSeverity,
        userMenuRef,
        handleCloseUserMenu,
        handleOpenUserMenu,
        handleClickUserMenu,
        handleContactClick,
        handleOpenCart,
        handleCloseCart,
        showToast,
        handleCloseToast,
        handleAddToCart,
        handleDecrementFromProduct,
        handleRemoveFromCart,
        handleUpdateQty,
        getAvatarColor,
        handleCategoryChange,
        handleKeywordChange,
        handleSearch,
        sortedProducts,
        totalPages,
        displayProducts,
        settings,
        navItems,
        categories
    };
};

export default useHome;
