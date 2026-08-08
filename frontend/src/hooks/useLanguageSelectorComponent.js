import { useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const useLanguageSelectorComponent = () => {
    const { language, handleLanguageChange } = useLanguage();
    const { t } = useTranslation();

    const languageOptions = {
        es: 'Español',
        en: 'English',
    };


    // CARGA EL IDIOMA GUARDADO EN LOCALSTORAGE AL MONTAR EL COMPONENTE
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            handleLanguageChange(savedLanguage);
            i18n.changeLanguage(savedLanguage);
        }
    }, [handleLanguageChange]);



    // MANEJA EL CAMBIO DE IDIOMA SELECCIONADO
    const handleChange = (event) => {
        const newLanguage = event.target.value;
        handleLanguageChange(newLanguage);
        i18n.changeLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    };

    return {
        t,
        language,
        languageOptions,
        handleChange
    };
};

export default useLanguageSelectorComponent;
