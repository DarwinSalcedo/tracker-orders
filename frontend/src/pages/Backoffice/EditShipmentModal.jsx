import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import {
    X,
    Mail,
    User,
    MessageSquare,
    MapPin,
    Hash,
    Loader,
    Save
} from 'lucide-react';
import { geocodeAddress } from '../../services/geocodingService';
import AddressAutocomplete from '../../components/ui/AddressAutocomplete';

const EditShipmentModal = ({ isOpen, onClose, shipment, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        customerName: '',
        customerPhone: '',
        deliveryPerson: '',
        deliveryInstructions: '',
        pickupLat: '',
        pickupLng: '',
        pickupAddress: '',
        dropoffLat: '',
        dropoffLng: '',
        dropoffAddress: ''
    });

    useEffect(() => {
        if (shipment) {
            setFormData({
                email: shipment.email || '',
                customerName: shipment.customer_name || '',
                customerPhone: shipment.customer_phone || '',
                deliveryPerson: shipment.delivery_person || '',
                deliveryInstructions: shipment.delivery_instructions || '',
                pickupLat: shipment.pickup_lat || '',
                pickupLng: shipment.pickup_lng || '',
                pickupAddress: shipment.pickup_address || '',
                dropoffLat: shipment.dropoff_lat || '',
                dropoffLng: shipment.dropoff_lng || '',
                dropoffAddress: shipment.dropoff_address || ''
            });
        }
    }, [shipment]);

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
            const updateData = {
                email: formData.email,
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                deliveryPerson: formData.deliveryPerson,
                deliveryInstructions: formData.deliveryInstructions,
                pickupLat: formData.pickupLat ? parseFloat(formData.pickupLat) : null,
                pickupLng: formData.pickupLng ? parseFloat(formData.pickupLng) : null,
                pickupAddress: formData.pickupAddress,
                dropoffLat: formData.dropoffLat ? parseFloat(formData.dropoffLat) : null,
                dropoffLng: formData.dropoffLng ? parseFloat(formData.dropoffLng) : null,
                dropoffAddress: formData.dropoffAddress
            };

            await onUpdate(shipment.id, updateData);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update shipment');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: 'var(--spacing-md)'
            }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{
                        width: '100%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}
                >
                    <Card style={{ padding: 0, background: 'var(--color-bg-main)', border: '1px solid var(--glass-border)' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ color: 'var(--color-primary)' }}><Hash size={24} /></div>
                                <h3 style={{ margin: 0 }}>Edit Shipment <span style={{ color: 'var(--color-primary)' }}>#{shipment?.id}</span></h3>
                            </div>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: 'var(--spacing-lg)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                {/* Basic Info */}
                                <div>
                                    <h4 style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shipment Logistics</h4>
                                    <Input
                                        label="Customer Name"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        icon={User}
                                    />
                                    <Input
                                        label="Phone Number"
                                        name="customerPhone"
                                        value={formData.customerPhone}
                                        onChange={handleChange}
                                        icon={Hash}
                                    />
                                    <Input
                                        label="Client Email (Optional)"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        icon={Mail}
                                    />
                                    <Input
                                        label="Delivery Person (Optional)"
                                        name="deliveryPerson"
                                        value={formData.deliveryPerson}
                                        onChange={handleChange}
                                        icon={User}
                                    />
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                            Instructions
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <MessageSquare size={18} style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--color-text-muted)' }} />
                                            <textarea
                                                name="deliveryInstructions"
                                                value={formData.deliveryInstructions}
                                                onChange={handleChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem 0.75rem 2.8rem',
                                                    background: 'var(--glass-bg)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: 'var(--radius-md)',
                                                    color: 'var(--color-text-main)',
                                                    fontSize: '1rem',
                                                    minHeight: '80px',
                                                    resize: 'vertical'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location Info */}
                                <div>
                                    <h4 style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Route Parameters</h4>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <MapPin size={14} color="var(--color-accent)" /> Pickup Location
                                        </p>
                                        <AddressAutocomplete
                                            label="Address"
                                            name="pickupAddress"
                                            value={formData.pickupAddress}
                                            onChange={handleChange}
                                            onSelect={(suggestion) => handleAddressSelect('pickup', suggestion)}
                                            placeholder="Enter address..."
                                        />
                                        {formData.pickupLat && (
                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                                Coords: {parseFloat(formData.pickupLat).toFixed(4)}, {parseFloat(formData.pickupLng).toFixed(4)}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <MapPin size={14} color="var(--color-success)" /> Destination Location
                                        </p>
                                        <AddressAutocomplete
                                            label="Address"
                                            name="dropoffAddress"
                                            value={formData.dropoffAddress}
                                            onChange={handleChange}
                                            onSelect={(suggestion) => handleAddressSelect('dropoff', suggestion)}
                                            placeholder="Enter address..."
                                        />
                                        {formData.dropoffLat && (
                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                                Coords: {parseFloat(formData.dropoffLat).toFixed(4)}, {parseFloat(formData.dropoffLng).toFixed(4)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-stack" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                                <Button type="submit" variant="primary" disabled={loading}>
                                    {loading ? <Loader className="spin" size={18} /> : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Save size={18} /> Save Manifest Changes
                                        </div>
                                    )}
                                </Button>
                            </div>

                            {error && (
                                <p style={{ color: 'var(--color-error)', marginTop: '1rem', textAlign: 'center' }}>{error}</p>
                            )}
                        </form>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditShipmentModal;
