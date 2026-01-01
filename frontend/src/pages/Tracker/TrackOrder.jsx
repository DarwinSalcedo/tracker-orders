import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Search, Mail, Loader, ArrowLeft } from 'lucide-react';
import { orderService } from '../../services/orderService';
import OrderDetails from './OrderDetails';
import { useNavigate } from 'react-router-dom';

const TrackOrder = () => {
    const navigate = useNavigate();
    const [trackingId, setTrackingId] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderData, setOrderData] = useState(null);

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
            background: 'radial-gradient(ellipse at top, #0f172a, #000000)'
        }}>
            {/* Header / Nav */}
            <div className="container" style={{ width: '100%', marginBottom: '2rem', display: 'flex', justifyContent: 'flex-start' }}>
                {!orderData && (
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        <ArrowLeft size={18} /> Back to Home
                    </Button>
                )}
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
                                    <h1 className="text-gradient">Track Order</h1>
                                    <p style={{ color: 'var(--color-text-muted)' }}>Enter your tracking ID and email to see details.</p>
                                </div>

                                <form onSubmit={handleTrack}>
                                    <Input
                                        label="Tracking ID"
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
                                        {loading ? <Loader className="spin" size={20} /> : 'Track Order'}
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
