import React from 'react';
import useLanguageSelectorComponent from '../../hooks/useLanguageSelectorComponent';

function LanguageSelectorComponent() {
    const {
        t,
        language,
        languageOptions,
        handleChange
    } = useLanguageSelectorComponent();

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