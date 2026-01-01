import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Package, ShieldCheck, ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="page flex-center" style={{
            background: 'radial-gradient(circle at center, #1e1b4b 0%, var(--color-bg-main) 100%)',
            padding: '2rem'
        }}>
            <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }} className="text-gradient">Unknown Tracker</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                        Next-generation logistics tracking system. Real-time updates with premium precision.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <Card hover onClick={() => navigate('/track')} className="pointer">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%' }}>
                                <Package size={40} color="var(--color-primary)" />
                            </div>
                            <h3>Track Your Order</h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                Check the status of your shipment in real-time.
                            </p>
                            <Button variant="outline" onClick={() => navigate('/track')} fullWidth>
                                Track Now
                            </Button>
                        </div>
                    </Card>

                    <Card hover onClick={() => navigate('/backoffice/login')} className="pointer">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '50%' }}>
                                <ShieldCheck size={40} color="var(--color-accent)" />
                            </div>
                            <h3>Backoffice Access</h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                Manage orders, update status, and view analytics.
                            </p>
                            <Button variant="primary" onClick={() => navigate('/backoffice/login')} fullWidth>
                                Login <ArrowRight size={16} />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Home;
