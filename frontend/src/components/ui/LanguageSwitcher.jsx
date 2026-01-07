import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
    { code: 'en-US', label: 'English', flag: '🇺🇸' },
    { code: 'es-AR', label: 'Español', flag: '🇦🇷' },
    { code: 'pt-BR', label: 'Português', flag: '🇧🇷' }
];

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    const handleSelect = (code) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div style={{ position: 'relative' }} ref={containerRef}>
            <motion.button
                whileHover={{ scale: 1.05, background: 'var(--glass-border)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
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
                <span>{currentLang.code.split('-')[0].toUpperCase()}</span>
                <ChevronDown size={14} style={{ opacity: 0.6 }} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'absolute',
                            top: '120%',
                            right: 0,
                            background: 'white',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            padding: '0.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                            minWidth: '160px',
                            zIndex: 100
                        }}
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleSelect(lang.code)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.6rem 0.8rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: i18n.language === lang.code ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                                    color: i18n.language === lang.code ? 'var(--color-primary)' : 'var(--color-text-main)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    textAlign: 'left',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (i18n.language !== lang.code) e.currentTarget.style.background = 'var(--glass-border)';
                                }}
                                onMouseLeave={(e) => {
                                    if (i18n.language !== lang.code) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
                                    <span>{lang.label}</span>
                                </div>
                                {i18n.language === lang.code && <Check size={14} />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSwitcher;
