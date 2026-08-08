import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useProducts from "./useProducts";
import { AuthContext } from "./AuthContext";

const useCreateProduct = () => {
    const { createProduct, loading, error } = useProducts();
    const { auth } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity, setToastSeverity] = useState("success");
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();

    const steps = ["Información Básica", "Detalles del Producto", "Imagen y Confirmación"];



    // MANEJA EL CAMBIO DE FOTO DEL PRODUCTO Y CREA UNA VISTA PREVIA REDIMENSIONADA
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            ; (async () => {
                try {
                    const resized = await resizeAndCropImage(file, 1000);
                    setPhoto(resized);
                    const reader = new FileReader();
                    reader.onloadend = () => setPreview(reader.result);
                    reader.readAsDataURL(resized);
                } catch (err) {
                    console.error("Error resizing image:", err);
                    setPhoto(file);
                    const reader = new FileReader();
                    reader.onloadend = () => setPreview(reader.result);
                    reader.readAsDataURL(file);
                }
            })();
        }
    };



    // REDIMENSIONA Y RECORTA LA IMAGEN A UN TAMAÑO ESPECÍFICO
    const resizeAndCropImage = (file, size = 1000) =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement("canvas");
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext("2d");

                    const ratio = Math.max(size / img.width, size / img.height);
                    const w = img.width * ratio;
                    const h = img.height * ratio;
                    const dx = (size - w) / 2;
                    const dy = (size - h) / 2;

                    ctx.drawImage(img, dx, dy, w, h);

                    canvas.toBlob(
                        (blob) => {
                            if (!blob) return reject(new Error("Canvas is empty"));
                            const resizedFile = new File([blob], file.name, { type: file.type });
                            resolve(resizedFile);
                        },
                        file.type || "image/jpeg",
                        0.9
                    );
                } catch (err) {
                    reject(err);
                }
            };
            img.onerror = (e) => reject(e);
            const reader = new FileReader();
            reader.onload = (ev) => {
                img.src = ev.target.result;
            };
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });



    // ENVÍA EL PRODUCTO AL SERVIDOR
    const submitProduct = async () => {
        const userEmail = auth?.email || localStorage.getItem("email");

        const missingFields = [];
        if (!name) missingFields.push("Nombre");
        if (!category) missingFields.push("Categoría");
        if (!price) missingFields.push("Precio");
        if (!description) missingFields.push("Descripción");
        if (!photo) missingFields.push("Imagen");
        if (!userEmail) missingFields.push("Email de usuario");

        if (missingFields.length > 0) {
            setToastMessage(`Faltan campos: ${missingFields.join(", ")}`);
            setToastSeverity("error");
            setToastOpen(true);
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", userEmail);
        formData.append("photo", photo);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("category", category);

        await createProduct(formData);

        setToastMessage("Producto creado correctamente");
        setToastSeverity("success");
        setToastOpen(true);
        setName("");
        setPhoto(null);
        setPrice("");
        setDescription("");
        setPreview("");
        setCategory("");
    };



    // VALIDA SI SE PUEDE AVANZAR AL SIGUIENTE PASO
    const validateStep = (step) => {
        switch (step) {
            case 0:
                if (!name) {
                    setToastMessage("Por favor, completa el nombre del producto.");
                    setToastSeverity("error");
                    setToastOpen(true);
                    return false;
                }
                return true;
            case 1:
                if (!category || !price || !description) {
                    setToastMessage("Por favor, completa la categoría, precio y descripción.");
                    setToastSeverity("error");
                    setToastOpen(true);
                    return false;
                }
                return true;
            case 2:
                if (!photo) {
                    setToastMessage("Por favor, sube una imagen para el producto.");
                    setToastSeverity("error");
                    setToastOpen(true);
                    return false;
                }
                return true;
            default:
                return true;
        }
    };



    // AVANZA AL SIGUIENTE PASO
    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep(Math.min(steps.length - 1, activeStep + 1));
        }
    };



    // RETROCEDE A LA PÁGINA ANTERIOR
    const handleBack = () => {
        navigate("/");
    };

    return {
        loading,
        error,
        name,
        setName,
        preview,
        category,
        setCategory,
        price,
        setPrice,
        description,
        setDescription,
        toastOpen,
        setToastOpen,
        toastMessage,
        toastSeverity,
        activeStep,
        setActiveStep,
        steps,
        handlePhotoChange,
        submitProduct,
        handleNext,
        handleBack
    };
};

export default useCreateProduct;
