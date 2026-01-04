import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Truck, ShieldCheck, ArrowRight, Boxes } from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div className="page flex-center" style={{
            background: 'radial-gradient(circle at center, var(--color-bg-secondary) 0%, var(--color-bg-main) 100%)',
            padding: '2rem',
            position: 'relative'
        }}>
            <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <LanguageSwitcher />
                <ThemeToggle />
            </div>
            <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-gradient">Global Tracker</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                        {t('home.subtitle')}
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <Card hover onClick={() => navigate('/track')} className="pointer">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%' }}>
                                <Truck size={40} color="var(--color-primary)" />
                            </div>
                            <h3>{t('home.track_card_title')}</h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                {t('home.track_card_desc')}
                            </p>
                            <Button variant="outline" onClick={() => navigate('/track')} fullWidth>
                                {t('track.button')}
                            </Button>
                        </div>
                    </Card>

                    <Card hover onClick={() => navigate(isAuthenticated ? '/backoffice/dashboard' : '/backoffice/login')} className="pointer">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '50%' }}>
                                <ShieldCheck size={40} color="var(--color-accent)" />
                            </div>
                            <h3>{t('home.portal_card_title')}</h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                {t('home.portal_card_desc')}
                            </p>
                            <Button variant="primary" onClick={() => navigate(isAuthenticated ? '/backoffice/dashboard' : '/backoffice/login')} fullWidth>
                                {isAuthenticated ? t('home.go_to_dashboard') : t('common.login')} <ArrowRight size={16} />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Home;
