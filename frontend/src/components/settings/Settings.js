import React from 'react';
import ChangePasswordComponent from './ChangePasswordComponent';
import TwoFactorAuthComponent from './TwoFactorAuthComponent';
import LanguageSelectorComponent from './LanguageSelectorComponent';
import UserProfileComponent from './UserProfileComponent';
import VerifyEmailComponent from './VerifyEmailComponent';
import { Link } from 'react-router-dom';
import useSettings from '../../hooks/useSettings';

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
    const {
        t,
        selectedSection,
        setSelectedSection,
        sections,
        icons
    } = useSettings();

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
