import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChangePasswordComponent from './ChangePasswordComponent';
import TwoFactorAuthComponent from './TwoFactorAuthComponent';
import LanguageSelectorComponent from './LanguageSelectorComponent';
import UserProfileComponent from './UserProfileComponent';
import VerifyEmailComponent from './VerifyEmailComponent';
import { Link } from 'react-router-dom';

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

const renderSection = (selectedSection) => {
    switch (selectedSection) {
        case 'userProfile': return <UserProfileComponent />;
        case 'changePassword': return <ChangePasswordComponent />;
        case 'twoFactorAuth': return <TwoFactorAuthComponent />;
        case 'languageSelector': return <LanguageSelectorComponent />;
        case 'verifyEmail': return <VerifyEmailComponent />;
        default: return null;
    }
};

function Settings() {
    const { t } = useTranslation();
    const [selectedSection, setSelectedSection] = useState('userProfile');

    return (
        <div className="mt-12 flex min-h-[80vh] w-full">
            <div className="bg-white flex w-full rounded-xl overflow-hidden shadow-2xl shadow-black/10">
                <div className="w-1/4 sm:w-20 lg:w-48 bg-gray-200">
                    <nav>
                        {sections.map(({ id, label, icon }) => (
                            <button
                                key={id}
                                onClick={() => setSelectedSection(id)}
                                className={`flex items-center gap-3 w-full px-4 py-3 transition-colors ${
                                    selectedSection === id
                                        ? 'bg-green-300 text-white'
                                        : 'bg-transparent text-inherit hover:bg-green-500 hover:text-white'
                                }`}
                            >
                                <span className={`${selectedSection === id ? 'text-white' : 'text-inherit'} shrink-0`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[icon]} />
                                    </svg>
                                </span>
                                <span className="hidden lg:block text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                                    {t(label)}
                                </span>
                            </button>
                        ))}
                        <Link
                            to="/"
                            className="flex items-center gap-3 w-full px-4 py-3 text-inherit hover:bg-green-500 hover:text-white transition-colors"
                        >
                            <span className="shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </span>
                            <span className="hidden lg:block text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                                {t('go_back')}
                            </span>
                        </Link>
                    </nav>
                </div>
                <div className="flex-grow p-4">
                    <div className="flex items-center">
                        <svg className="w-8 h-8 mr-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h1 className="text-xl sm:text-2xl text-gray-900">{t('settings_title')}</h1>
                    </div>
                    <hr className="my-3 border-gray-200" />
                    {renderSection(selectedSection)}
                </div>
            </div>
        </div>
    );
}

export default Settings;