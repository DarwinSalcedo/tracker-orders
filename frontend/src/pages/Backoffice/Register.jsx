import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Lock, User, UserPlus, ArrowRight, Loader, ShieldCheck } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Delivery');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

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
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-dim)', fontSize: '0.875rem' }}>Role</label>
                            <div style={{ position: 'relative' }}>
                                <ShieldCheck size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <select
                                    className="input-field"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    style={{ width: '100%', paddingLeft: '40px', appearance: 'none' }}
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Delivery">Delivery</option>
                                </select>
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
