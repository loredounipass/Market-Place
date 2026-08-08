import { useState, useRef, useEffect } from "react";
import useAuth from "./useAuth";

const useRegister = () => {
    const { registerUser, error } = useAuth();
    const isMounted = useRef(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    // LIMPIA LA REFERENCIA DE MONTAJE AL DESMONTAR EL COMPONENTE
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);


    const passwordsMatch = password === confirmPassword || confirmPassword === "";



    // MANEJA EL ENVÍO DEL FORMULARIO DE REGISTRO
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setOpenSnackbar(true);
            return;
        }

        const data = Object.fromEntries(new FormData(event.currentTarget));
        setLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await registerUser(data);
        } catch (e) {
            if (isMounted.current) setOpenSnackbar(true);
        } finally {
            if (isMounted.current) setLoading(false);
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
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        loading,
        passwordsMatch,
        handleSubmit,
        handleCloseSnackbar
    };
};

export default useRegister;
