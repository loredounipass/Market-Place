import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const useSettings = () => {
    const { t } = useTranslation();
    const [selectedSection, setSelectedSection] = useState('userProfile');

    const sections = [
        { id: 'userProfile', label: 'user_profile', icon: 'user' },
        { id: 'changePassword', label: 'change_password', icon: 'lock' },
        { id: 'twoFactorAuth', label: 'two_factor_auth', icon: 'shield' },
        { id: 'languageSelector', label: 'language_selector', icon: 'globe' },
        { id: 'verifyEmail', label: 'verify_email', icon: 'shield' },
    ];

    const icons = {
        user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        lock: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
        shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        globe: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
    };

    return {
        t,
        selectedSection,
        setSelectedSection,
        sections,
        icons
    };
};

export default useSettings;
