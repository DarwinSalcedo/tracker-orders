import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Truck, Package, MapPin, Clock } from 'lucide-react';

const StatusTimeline = ({ history = [] }) => {
    // Sort history by timestamp descending (newest first)
    const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const getIcon = (status) => {
        switch (status) {
            case 'created': return Package;
            case 'picked_up': return Truck; // Or Box with arrow up
            case 'in_transit': return Truck;
            case 'delivered': return CheckCircle;
            default: return Clock;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'created': return 'var(--color-primary)';
            case 'in_transit': return 'var(--color-warning)';
            case 'delivered': return 'var(--color-success)';
            default: return 'var(--color-text-muted)';
        }
    };

    return (
        <div className="timeline-container" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                Tracking History
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {sortedHistory.map((event, index) => {
                    const Icon = getIcon(event.status);
                    const color = getStatusColor(event.status);
                    const isLatest = index === 0;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{ display: 'flex', gap: '1rem', position: 'relative' }}
                        >
                            {/* Line connector */}
                            {index !== sortedHistory.length - 1 && (
                                <div style={{
                                    position: 'absolute',
                                    left: '19px',
                                    top: '40px',
                                    bottom: '-30px',
                                    width: '2px',
                                    background: 'var(--glass-border)',
                                    zIndex: 0
                                }} />
                            )}

                            <div style={{
                                zIndex: 1,
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: isLatest ? color : 'var(--bg-secondary)',
                                border: `2px solid ${isLatest ? color : 'var(--glass-border)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: isLatest ? `0 0 15px ${color}66` : 'none',
                                flexShrink: 0
                            }}>
                                <Icon size={isLatest ? 20 : 18} color={isLatest ? 'white' : 'var(--color-text-muted)'} />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                    <span style={{
                                        fontWeight: isLatest ? '600' : '400',
                                        color: isLatest ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                                        textTransform: 'capitalize'
                                    }}>
                                        {event.status.replace('_', ' ')}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                        {new Date(event.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                {event.location && (event.location.lat || event.location.address) && (
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <MapPin size={14} />
                                        {event.location.address || `Lat: ${event.location.lat}, Lng: ${event.location.lng}`}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default StatusTimeline;
