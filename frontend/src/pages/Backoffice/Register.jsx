import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Lock, User, UserPlus, ArrowRight, Loader, ShieldCheck, Truck } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Delivery');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/backoffice/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await register(username, password, role);
            setSuccess('User registered successfully! You can now login.');
            setTimeout(() => {
                navigate('/backoffice/login');
            }, 2000);
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page flex-center" style={{ background: 'radial-gradient(circle at top right, #1e1b4b, var(--color-bg-main))' }}>
            <div className="container" style={{ width: '100%', maxWidth: '420px' }}>
                <Card className="login-card">
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            style={{
                                width: '60px',
                                height: '60px',
                                background: 'var(--color-primary)',
                                borderRadius: '50%',
                                margin: '0 auto 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 20px var(--color-primary)'
                            }}
                        >
                            <UserPlus color="white" size={28} />
                        </motion.div>
                        <h1 className="text-gradient">Register User</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Create a new backoffice user</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            icon={User}
                            placeholder="Pick a username"
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={Lock}
                            placeholder="Pick a password"
                            required
                        />

                        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--color-text-dim)', fontSize: '0.875rem', fontWeight: '500' }}>Select Account Type</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setRole('Admin')}
                                    style={{
                                        padding: '1rem',
                                        background: role === 'Admin' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                        border: `2px solid ${role === 'Admin' ? 'var(--color-primary)' : 'var(--glass-border)'}`,
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <ShieldCheck
                                        size={24}
                                        color={role === 'Admin' ? 'var(--color-primary)' : 'var(--color-text-muted)'}
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                    <div style={{ fontWeight: '600', fontSize: '0.9rem', color: role === 'Admin' ? 'white' : 'var(--color-text-muted)' }}>Admin</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>Full Control</div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setRole('Delivery')}
                                    style={{
                                        padding: '1rem',
                                        background: role === 'Delivery' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                        border: `2px solid ${role === 'Delivery' ? 'var(--color-primary)' : 'var(--glass-border)'}`,
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <Truck
                                        size={24}
                                        color={role === 'Delivery' ? 'var(--color-primary)' : 'var(--color-text-muted)'}
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                    <div style={{ fontWeight: '600', fontSize: '0.9rem', color: role === 'Delivery' ? 'white' : 'var(--color-text-muted)' }}>Delivery</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>Field Ops</div>
                                </motion.div>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{ color: 'var(--color-error)', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}
                            >
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{ color: '#10b981', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}
                            >
                                {success}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? <Loader className="spin" size={20} /> : <>Create Account <ArrowRight size={18} /></>}
                        </Button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Link to="/backoffice/login" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                            Already have an account? Sign In
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Register;
