import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';
import AddressAutocomplete from '../../components/ui/AddressAutocomplete';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import {
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
        deliveryPersonId: '',
        deliveryInstructions: '',
        externalOrderId: ''
    });

    const [deliveryUsers, setDeliveryUsers] = useState([]);



    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getAllUsers();
                setDeliveryUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressSelect = (type, suggestion) => {
        setFormData(prev => ({
            ...prev,
            [`${type}Address`]: suggestion.displayName,
            [`${type}Lat`]: suggestion.lat,
            [`${type}Lng`]: suggestion.lng
        }));
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
                deliveryPerson: formData.deliveryPersonId ? deliveryUsers.find(u => u.id === parseInt(formData.deliveryPersonId))?.username : '',
                deliveryPersonId: formData.deliveryPersonId,
                deliveryInstructions: formData.deliveryInstructions,
                externalOrderId: formData.externalOrderId
            };

            const response = await orderService.createOrder(payload);
            setCreatedOrder(response);
            setSuccess(true);
            setTimeout(() => navigate('/backoffice/dashboard'), 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || t('create_order.error_generic'));
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
                    <h1>{t('create_order.success_title')}</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>{t('create_order.success_message')}</p>
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
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{t('create_order.share_link')}:</p>
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
                                    {t('create_order.copy_link')}
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
                        <h1 className="text-gradient">{t('create_order.title')}</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>{t('create_order.subtitle')}</p>
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
                                <ClipboardList size={20} color="var(--color-primary)" /> {t('create_order.section_shipment')}
                            </h3>
                            <Input
                                label={t('create_order.label_waybill')}
                                name="trackingId"
                                value={formData.trackingId}
                                onChange={handleChange}
                                icon={Hash}
                                required
                            />
                            <Input
                                label={t('track.client') + ' ' + t('create_order.optional')}
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                icon={User}
                            />
                            <Input
                                label={t('track.customer_phone') + ' ' + t('create_order.optional')}
                                name="customerPhone"
                                value={formData.customerPhone}
                                onChange={handleChange}
                                placeholder="+1 234 567 890"
                                icon={Hash}
                            />
                            <Input
                                label={t('create_order.label_external') + ' ' + t('create_order.optional')}
                                name="externalOrderId"
                                value={formData.externalOrderId}
                                onChange={handleChange}
                                placeholder="e.g. ORD-12345"
                                icon={Hash}
                            />
                            <Input
                                label={t('create_order.label_email') + ' ' + t('create_order.optional')}
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="customer@example.com"
                                icon={Mail}
                            />
                            <div className="premium-input-container">
                                <label className="premium-input-label">{t('create_order.label_delivery_person') + ' ' + t('create_order.optional')}</label>
                                <div className="premium-input-wrapper">
                                    <User size={18} className="premium-input-icon" />
                                    <select
                                        name="deliveryPersonId"
                                        value={formData.deliveryPersonId}
                                        onChange={handleChange}
                                        className="premium-input with-icon"
                                        style={{ appearance: 'none', cursor: 'pointer' }}
                                    >
                                        <option value="">{t('create_order.placeholder_select_delivery')}</option>
                                        {deliveryUsers.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.username}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                    {t('create_order.label_instructions') + ' ' + t('create_order.optional')}
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <MessageSquare size={18} style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--color-text-muted)' }} />
                                    <textarea
                                        name="deliveryInstructions"
                                        value={formData.deliveryInstructions}
                                        onChange={handleChange}
                                        placeholder={t('create_order.placeholder_instructions')}
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
                                <MapPin size={20} color="var(--color-accent)" /> {t('create_order.section_pickup') + ' ' + t('create_order.optional')}
                            </h3>
                            <AddressAutocomplete
                                label={t('create_order.section_pickup')}
                                name="pickupAddress"
                                value={formData.pickupAddress}
                                onChange={handleChange}
                                onSelect={(suggestion) => handleAddressSelect('pickup', suggestion)}
                                placeholder={t('create_order.address_auto')}
                            />
                            {formData.pickupLat && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '0.5rem', marginBottom: '1rem' }}>
                                    ✓ {t('create_order.geocoded')}: {parseFloat(formData.pickupLat).toFixed(4)}, {parseFloat(formData.pickupLng).toFixed(4)}
                                </p>
                            )}
                        </Card>

                        {/* Dropoff Info */}
                        <Card>
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={20} color="var(--color-success)" /> {t('create_order.section_dropoff') + ' ' + t('create_order.optional')}
                            </h3>
                            <AddressAutocomplete
                                label={t('create_order.section_dropoff')}
                                name="dropoffAddress"
                                value={formData.dropoffAddress}
                                onChange={handleChange}
                                onSelect={(suggestion) => handleAddressSelect('dropoff', suggestion)}
                                placeholder={t('create_order.address_auto')}
                            />
                            {formData.dropoffLat && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '0.5rem', marginBottom: '1rem' }}>
                                    ✓ {t('create_order.geocoded')}: {parseFloat(formData.dropoffLat).toFixed(4)}, {parseFloat(formData.dropoffLng).toFixed(4)}
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
                                {loading ? <Loader className="spin" size={20} /> : t('create_order.submit_btn')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOrder;
