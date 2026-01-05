import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderService } from '../../services/orderService';
import { geocodeAddress } from '../../services/geocodingService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import {
    Truck,
    Mail,
    MapPin,
    ArrowLeft,
    CheckCircle,
    Loader,
    Hash,
    ClipboardList,
    User,
    MessageSquare
} from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle';
import LanguageSwitcher from '../../components/ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const CreateOrder = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [createdOrder, setCreatedOrder] = useState(null);

    const [formData, setFormData] = useState({
        trackingId: `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        email: '',
        customerName: '',
        customerPhone: '',
        pickupLat: '',
        pickupLng: '',
        pickupAddress: '',
        dropoffLat: '',
        dropoffLng: '',
        dropoffAddress: '',
        deliveryPerson: '',
        deliveryInstructions: '',
        externalOrderId: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressBlur = async (type) => {
        const address = type === 'pickup' ? formData.pickupAddress : formData.dropoffAddress;
        if (!address) return;

        const result = await geocodeAddress(address);
        if (result) {
            setFormData(prev => ({
                ...prev,
                [`${type}Lat`]: result.lat,
                [`${type}Lng`]: result.lng
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                trackingId: formData.trackingId,
                email: formData.email,
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                pickup: formData.pickupLat && formData.pickupLng ? {
                    lat: parseFloat(formData.pickupLat),
                    lng: parseFloat(formData.pickupLng),
                    address: formData.pickupAddress
                } : null,
                dropoff: formData.dropoffLat && formData.dropoffLng ? {
                    lat: parseFloat(formData.dropoffLat),
                    lng: parseFloat(formData.dropoffLng),
                    address: formData.dropoffAddress
                } : null,
                deliveryPerson: formData.deliveryPerson,
                deliveryInstructions: formData.deliveryInstructions,
                externalOrderId: formData.externalOrderId
            };

            const response = await orderService.createOrder(payload);
            setCreatedOrder(response);
            setSuccess(true);
            setTimeout(() => navigate('/backoffice/dashboard'), 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to register shipment');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="page flex-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ textAlign: 'center' }}
                >
                    <div style={{ padding: '2rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'inline-block', marginBottom: '1.5rem', border: '1px solid var(--color-success)' }}>
                        <CheckCircle size={64} color="var(--color-success)" />
                    </div>
                    <h1>Shipment Registered!</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Updating manifest and redirecting...</p>
                    {createdOrder?.share_token && (
                        <div style={{
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1.5rem',
                            marginBottom: '1.5rem',
                            maxWidth: '500px',
                            margin: '0 auto 1.5rem'
                        }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Shareable Tracking Link:</p>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    readOnly
                                    value={`${window.location.origin}/track/${createdOrder.share_token}`}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        background: 'var(--color-bg-secondary)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'var(--color-text-main)',
                                        fontSize: '0.9rem'
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/track/${createdOrder.share_token}`);
                                    }}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        background: 'var(--color-primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="page" style={{ padding: '2rem', background: 'var(--color-bg-main)' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <Button variant="ghost" onClick={() => navigate('/backoffice/dashboard')} style={{ paddingLeft: 0, marginBottom: '1rem' }}>
                            <ArrowLeft size={18} /> {t('common.back')}
                        </Button>
                        <h1 className="text-gradient">{t('dashboard.register_shipment')}</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Initialize a new tracking waybill in the system.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <LanguageSwitcher />
                        <ThemeToggle variant="minimal" />
                    </div>
                </header>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* General Info */}
                        <Card>
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ClipboardList size={20} color="var(--color-primary)" /> Shipment Information
                            </h3>
                            <Input
                                label="Waybill / Tracking ID"
                                name="trackingId"
                                value={formData.trackingId}
                                onChange={handleChange}
                                icon={Hash}
                                required
                            />
                            <Input
                                label={t('track.client') + ' (Optional)'}
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                icon={User}
                            />
                            <Input
                                label={t('track.customer_phone') + ' (Optional)'}
                                name="customerPhone"
                                value={formData.customerPhone}
                                onChange={handleChange}
                                placeholder="+1 234 567 890"
                                icon={Hash}
                            />
                            <Input
                                label="External Reference (Optional)"
                                name="externalOrderId"
                                value={formData.externalOrderId}
                                onChange={handleChange}
                                placeholder="e.g. ORD-12345"
                                icon={Hash}
                            />
                            <Input
                                label="Client Email (Optional)"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="customer@example.com"
                                icon={Mail}
                            />
                            <Input
                                label="Delivery Person (Optional)"
                                name="deliveryPerson"
                                value={formData.deliveryPerson}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                                icon={User}
                            />
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                    Delivery Instructions (Optional)
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <MessageSquare size={18} style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--color-text-muted)' }} />
                                    <textarea
                                        name="deliveryInstructions"
                                        value={formData.deliveryInstructions}
                                        onChange={handleChange}
                                        placeholder="e.g. Leave at front door"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem 0.75rem 2.8rem',
                                            background: 'var(--glass-bg)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: 'var(--radius-md)',
                                            color: 'var(--color-text-main)',
                                            fontSize: '1rem',
                                            minHeight: '100px',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Pickup Info */}
                        <Card>
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={20} color="var(--color-accent)" /> Pickup Location (Optional)
                            </h3>
                            <Input
                                label="Pickup Address"
                                name="pickupAddress"
                                value={formData.pickupAddress}
                                onChange={handleChange}
                                onBlur={() => handleAddressBlur('pickup')}
                                placeholder="Enter address to auto-fill coordinates"
                                icon={MapPin}
                            />
                            {formData.pickupLat && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '-1rem', marginBottom: '1rem' }}>
                                    ✓ Geocoded: {parseFloat(formData.pickupLat).toFixed(4)}, {parseFloat(formData.pickupLng).toFixed(4)}
                                </p>
                            )}
                        </Card>

                        {/* Dropoff Info */}
                        <Card>
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={20} color="var(--color-success)" /> Destination (Optional)
                            </h3>
                            <Input
                                label="Dropoff Address"
                                name="dropoffAddress"
                                value={formData.dropoffAddress}
                                onChange={handleChange}
                                onBlur={() => handleAddressBlur('dropoff')}
                                placeholder="Enter address to auto-fill coordinates"
                                icon={MapPin}
                            />
                            {formData.dropoffLat && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '-1rem', marginBottom: '1rem' }}>
                                    ✓ Geocoded: {parseFloat(formData.dropoffLat).toFixed(4)}, {parseFloat(formData.dropoffLng).toFixed(4)}
                                </p>
                            )}
                        </Card>

                        {/* Submit Card */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            {error && (
                                <div style={{ color: 'var(--color-error)', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', textAlign: 'center' }}>
                                    {error}
                                </div>
                            )}
                            <Button type="submit" fullWidth disabled={loading}>
                                {loading ? <Loader className="spin" size={20} /> : 'Register Shipment & Generate Waybill'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOrder;
