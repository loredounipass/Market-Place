import { useState, useEffect } from 'react';
import Products from '../services/products'; 

export default function useProducts() {
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null);

    const getProducts = async (query = "") => {
        setLoading(true);
        try {
            const response = await Products.getProducts(query); 
            if (response.data && Array.isArray(response.data)) {
                setProducts(response.data); 
            } else {
                setError('Formato de datos inesperado'); 
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message); 
        } finally {
            setLoading(false); 
        }
    };

    
    const createProduct = async (productData) => {
        setLoading(true);
        try {
            const response = await Products.createProduct(productData); 

            if (response.data) {
                await getProducts(); 
            } else {
                setError('Error al crear el producto'); 
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message); 
        } finally {
            setLoading(false); 
        }
    };

   
    useEffect(() => {
        getProducts();
    }, []);

    return {
        products, 
        loading, 
        error, 
        getProducts, 
        createProduct,
    };
}
