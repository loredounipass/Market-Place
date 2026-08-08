import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const useLogin = () => {
    const { loginUser, error } = useAuth();
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const isMounted = useRef(true);


    // LIMPIA LA REFERENCIA DE MONTAJE AL DESMONTAR EL COMPONENTE
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);



    // MANEJA EL ENVÍO DEL FORMULARIO DE INICIO DE SESIÓN
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget));

        localStorage.setItem("email", data.email);
        setLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const responseMessage = await loginUser(data);
            if (isMounted.current) {
                if (responseMessage && responseMessage.msg === "Código de verificación enviado a tu correo electrónico.") {
                    navigate("/verifytoken");
                } else if (responseMessage && responseMessage.msg === "Logged in!") {
                    navigate("/");
                } else {
                    setOpenSnackbar(true);
                }
            }
        } catch (e) {
            if (isMounted.current) {
                setOpenSnackbar(true);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };



    // CIERRA EL SNACKBAR DE ERROR
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return {
        error,
        openSnackbar,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        loading,
        handleSubmit,
        handleCloseSnackbar
    };
};

export default useLogin;
