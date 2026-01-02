import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import StatusTimeline from '../../components/ui/StatusTimeline';
import { MapPin, Truck, Calendar, Activity } from 'lucide-react';
import Button from '../../components/ui/Button';

const OrderDetails = ({ order, onBack }) => {
    if (!order) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ width: '100%', maxWidth: '800px' }}
        >
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button variant="secondary" onClick={onBack}>&larr; Tracking Portal</Button>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>WAYBILL NUMBER</p>
                    <span className="text-gradient" style={{ fontWeight: '700', fontSize: '1.4rem' }}>
                        #{order.trackingId}
                    </span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Main Status Card */}
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                            <Truck size={32} color="var(--color-success)" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{order.status.replace('_', ' ').toUpperCase()}</h2>
                            <p style={{ color: 'var(--color-text-muted)' }}>Status Manifest</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        {order.createdAt && (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <Calendar size={18} color="var(--color-primary)" />
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Registered</p>
                                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )}
                        {order.currentLocation && (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <MapPin size={18} color="var(--color-accent)" />
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Last Location</p>
                                    <p>{order.currentLocation.lat.toFixed(4)}, {order.currentLocation.lng.toFixed(4)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Shipment Details Card */}
                <Card>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={18} color="var(--color-accent)" /> Shipment Logistics
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        Routing and destination matrix.
                    </p>
                    <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                        <p><strong>Origin:</strong> {order.pickup ? `${order.pickup.lat}, ${order.pickup.lng}` : 'N/A'}</p>
                        <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.5rem 0' }} />
                        <p><strong>Destination:</strong> {order.dropoff ? `${order.dropoff.lat}, ${order.dropoff.lng}` : 'N/A'}</p>
                    </div>
                    {/* Here we would integrate a map like Google Maps or Leaflet */}
                    <div style={{ marginTop: '1rem', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                        Map Visualization Placeholder
                    </div>
                </Card>
            </div>

            <StatusTimeline history={order.history} />
        </motion.div>
    );
};

export default OrderDetails;
