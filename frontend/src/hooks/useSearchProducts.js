import { useState } from 'react';
import useProducts from './useProducts';

const useSearchProducts = () => {
    const { products, loading, error } = useProducts();
    const [keyword, setKeyword] = useState('');
    const [submittedKeyword, setSubmittedKeyword] = useState('');



    // MANEJA EL CAMBIO DE PALABRA CLAVE
    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    };



    // MANEJA EL CLIC EN BUSCAR
    const handleSearchClick = () => {
        setSubmittedKeyword(keyword);
    };

    const filteredProducts = products.filter((product) => {
        const key = submittedKeyword.toLowerCase();
        const name = product.name ? product.name.toLowerCase() : '';
        const description = product.description ? product.description.toLowerCase() : '';
        return key && (name.includes(key) || description.includes(key));
    });

    return {
        loading,
        error,
        keyword,
        submittedKeyword,
        handleKeywordChange,
        handleSearchClick,
        filteredProducts
    };
};

export default useSearchProducts;
