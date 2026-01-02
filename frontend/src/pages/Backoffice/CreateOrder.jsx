import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderService } from '../../services/orderService';
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
    ClipboardList
} from 'lucide-react';

const CreateOrder = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        trackingId: `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        email: '',
        pickupLat: '',
        pickupLng: '',
        dropoffLat: '',
        dropoffLng: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                trackingId: formData.trackingId,
                email: formData.email,
                pickup: { lat: parseFloat(formData.pickupLat), lng: parseFloat(formData.pickupLng) },
                dropoff: { lat: parseFloat(formData.dropoffLat), lng: parseFloat(formData.dropoffLng) }
            };

            await orderService.createOrder(payload);
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
                    <div style={{ padding: '2rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'inline-block', marginBottom: '1.5rem' }}>
                        <CheckCircle size={64} color="var(--color-success)" />
                    </div>
                    <h1>Shipment Registered!</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Updating manifest and redirecting...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="page" style={{ padding: '2rem', background: 'var(--color-bg-main)' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <header style={{ marginBottom: '2rem' }}>
                    <Button variant="ghost" onClick={() => navigate('/backoffice/dashboard')} style={{ paddingLeft: 0, marginBottom: '1rem' }}>
                        <ArrowLeft size={18} /> Back to Command Center
                    </Button>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Register New Shipment</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Initialize a new tracking waybill in the system.</p>
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
                                label="Client Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="customer@example.com"
                                icon={Mail}
                                required
                            />
                        </Card>

                        {/* Pickup Info */}
                        <Card>
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={20} color="var(--color-accent)" /> Pickup Location
                            </h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Input
                                    label="Latitude"
                                    name="pickupLat"
                                    type="number"
                                    step="any"
                                    value={formData.pickupLat}
                                    onChange={handleChange}
                                    placeholder="e.g. 19.4326"
                                    required
                                />
                                <Input
                                    label="Longitude"
                                    name="pickupLng"
                                    type="number"
                                    step="any"
                                    value={formData.pickupLng}
                                    onChange={handleChange}
                                    placeholder="e.g. -99.1332"
                                    required
                                />
                            </div>
                        </Card>

                        {/* Dropoff Info */}
                        <Card>
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={20} color="var(--color-success)" /> Destination (Dropoff)
                            </h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Input
                                    label="Latitude"
                                    name="dropoffLat"
                                    type="number"
                                    step="any"
                                    value={formData.dropoffLat}
                                    onChange={handleChange}
                                    placeholder="e.g. 19.4000"
                                    required
                                />
                                <Input
                                    label="Longitude"
                                    name="dropoffLng"
                                    type="number"
                                    step="any"
                                    value={formData.dropoffLng}
                                    onChange={handleChange}
                                    placeholder="e.g. -99.1000"
                                    required
                                />
                            </div>
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
