import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Lock, User, UserPlus, ArrowRight, Loader, ShieldCheck, Truck, Building } from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle';
import api from '../../services/api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // Role is fixed to Delivery for public registration
    const [role] = useState('Delivery');
    const [companyId, setCompanyId] = useState('');
    const [companies, setCompanies] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/backoffice/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Fetch companies on mount
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await api.get('/companies');
                setCompanies(response.data);
                // Default to first company if available, or stay empty to force user to choose
                // setCompanyId(response.data[0]?.id || ''); 
            } catch (err) {
                console.error("Failed to fetch companies", err);
            }
        };
        fetchCompanies();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!companyId) {
            setError('Please select a company.');
            return;
        }

        setLoading(true);

        try {
            await register(username, password, role, companyId);
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
        <div className="page flex-center" style={{ background: 'radial-gradient(circle at top right, var(--color-bg-secondary), var(--color-bg-main))', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
                <ThemeToggle variant="minimal" />
            </div>
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
                        <h1 className="text-gradient">Register Delivery</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Join your organization's fleet</p>
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

                        {/* Company Selection */}
                        <div className="premium-input-container">
                            <label className="premium-input-label">Organization</label>
                            <div className="premium-input-wrapper">
                                <Building size={18} className="premium-input-icon" />
                                <select
                                    name="companyId"
                                    value={companyId}
                                    onChange={(e) => setCompanyId(e.target.value)}
                                    className="premium-input with-icon"
                                    style={{ appearance: 'none', cursor: 'pointer' }}
                                    required
                                >
                                    <option value="">Select your company...</option>
                                    {companies.map(company => (
                                        <option key={company.id} value={company.id}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Hidden Role Display (Optional, just to inform they are registering as Delivery) */}
                        <div style={{
                            padding: '0.75rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '1.5rem',
                            marginTop: '1rem'
                        }}>
                            <Truck size={20} color="#10b981" />
                            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                                Registering as <strong>Delivery Driver</strong>
                            </span>
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
