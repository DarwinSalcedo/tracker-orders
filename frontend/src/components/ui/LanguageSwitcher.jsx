import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en-US' ? 'es-AR' : 'en-US';
        i18n.changeLanguage(newLang);
    };

    const currentLang = i18n.language === 'en-US' ? 'EN' : 'ES';

    return (
        <motion.button
            whileHover={{ scale: 1.05, background: 'var(--glass-border)' }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '20px',
                padding: '0.4rem 0.8rem',
                color: 'var(--color-text-main)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)'
            }}
        >
            <Globe size={14} color="var(--color-primary)" />
            <span style={{ minWidth: '1.5rem' }}>{currentLang}</span>
        </motion.button>
    );
};

export default LanguageSwitcher;
