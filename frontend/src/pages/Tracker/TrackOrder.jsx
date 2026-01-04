import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Search, Mail, Loader, ArrowLeft, LayoutDashboard, Globe } from 'lucide-react';
import { orderService } from '../../services/orderService';
import OrderDetails from './OrderDetails';
import ThemeToggle from '../../components/ui/ThemeToggle';

const TrackOrder = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [searchParams] = useSearchParams();
    const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
    const [email, setEmail] = useState(searchParams.get('email') || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        const idParam = searchParams.get('id');
        const emailParam = searchParams.get('email');
        if (idParam && emailParam) {
            handleAutoTrack(idParam, emailParam);
        }
    }, []);

    const handleAutoTrack = async (id, mail) => {
        setLoading(true);
        setError('');
        try {
            const data = await orderService.trackOrder(id, mail);
            setOrderData(data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Order not found or invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!trackingId || !email) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await orderService.trackOrder(trackingId, email);
            setOrderData(data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Order not found or invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setOrderData(null);
        setTrackingId('');
        setEmail('');
    };

    return (
        <div className="page flex-center" style={{
            flexDirection: 'column',
            paddingTop: '2rem',
            paddingBottom: '2rem',
            background: 'radial-gradient(ellipse at top, var(--color-bg-secondary), var(--color-bg-main))'
        }}>
            {/* Header / Nav */}
            <div className="container" style={{ width: '100%', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {!orderData ? (
                        <div className="flex-stack-sm" style={{ display: 'flex', gap: '1rem' }}>
                            <Button variant="secondary" onClick={() => navigate(-1)}>
                                <ArrowLeft size={18} /> Back
                            </Button>
                            {isAuthenticated && (
                                <Button variant="ghost" onClick={() => navigate('/backoffice/dashboard')}>
                                    <LayoutDashboard size={18} /> Dashboard
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div /> // Spacer
                    )}
                    <ThemeToggle variant="minimal" />
                </div>
            </div>

            <div className="container" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <AnimatePresence mode="wait">
                    {!orderData ? (
                        <motion.div
                            key="search-form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            style={{ width: '100%', maxWidth: '450px' }}
                        >
                            <Card>
                                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                    <h1 className="text-gradient">Track Shipment</h1>
                                    <p style={{ color: 'var(--color-text-muted)' }}>Enter your waybill number and email to follow the delivery.</p>
                                </div>

                                <form onSubmit={handleTrack}>
                                    <Input
                                        label="Waybill Number / Tracking ID"
                                        placeholder="e.g. TRK-12345678"
                                        icon={Search}
                                        value={trackingId}
                                        onChange={(e) => setTrackingId(e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="name@example.com"
                                        icon={Mail}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            style={{ color: 'var(--color-error)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    <Button type="submit" fullWidth disabled={loading}>
                                        {loading ? <Loader className="spin" size={20} /> : 'Track Shipment'}
                                    </Button>
                                </form>
                            </Card>
                        </motion.div>
                    ) : (
                        <OrderDetails order={orderData} onBack={clearSearch} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TrackOrder;
