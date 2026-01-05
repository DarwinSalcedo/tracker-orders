import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import OrderDetails from './OrderDetails';
import { Loader, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TokenTrack = () => {
    const { t } = useTranslation();
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const response = await axios.get(`${API_URL}/api/track/${token}`);
                setOrderData(response.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.error || 'Invalid or expired tracking link');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchOrder();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="page flex-center">
                <Loader className="spin" size={48} color="var(--color-primary)" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="page flex-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', maxWidth: '400px' }}
                >
                    <div style={{
                        padding: '2rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '50%',
                        display: 'inline-block',
                        marginBottom: '1.5rem',
                        border: '1px solid var(--color-error)'
                    }}>
                        <AlertCircle size={64} color="var(--color-error)" />
                    </div>
                    <h2>{t('track.not_found')}</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>{error}</p>
                    <button
                        onClick={() => navigate('/track')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        {t('track.back_to_search')}
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="page flex-center" style={{ padding: '2rem' }}>
            <OrderDetails
                order={{
                    ...orderData,
                    currentLocation: orderData.location
                }}
                onBack={() => navigate('/track')}
            />
        </div>
    );
};

export default TokenTrack;
