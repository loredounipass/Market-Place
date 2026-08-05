import React, { useEffect } from 'react';
import { useLanguage } from '../../hooks/LanguageContext';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

function LanguageSelectorComponent() {
    const { language, handleLanguageChange } = useLanguage();
    const { t } = useTranslation();

    const languageOptions = {
        es: 'Español',
        en: 'English',
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            handleLanguageChange(savedLanguage);
            i18n.changeLanguage(savedLanguage);
        }
    }, [handleLanguageChange]);

    const handleChange = (event) => {
        const newLanguage = event.target.value;
        handleLanguageChange(newLanguage);
        i18n.changeLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    };

    return (
        <div className="mt-6 p-4 bg-white rounded shadow-lg shadow-black/5 max-w-xs mx-auto border border-gray-200">
            <h2 className="text-lg text-gray-900 mb-3">{t('language_selection')}</h2>
            <select
                value={language}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border border-gray-300 bg-white focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
            >
                {Object.entries(languageOptions).map(([key, value]) => (
                    <option key={key} value={key}>
                        {language === key ? '✓ ' : ''}{value}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default LanguageSelectorComponent;