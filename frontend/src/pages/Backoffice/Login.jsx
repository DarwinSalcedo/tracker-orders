import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Lock, User, ArrowRight, Loader } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/backoffice/dashboard'); // Redirect after login
        } catch (err) {
            setError(err.message || 'Failed to login');
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
                            <Lock color="white" size={28} />
                        </motion.div>
                        <h1 className="text-gradient">Unknown Tracker</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Sign in to access backoffice</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            icon={User}
                            placeholder="Enter your username"
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={Lock}
                            placeholder="Enter your password"
                            required
                        />

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{ color: 'var(--color-error)', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? <Loader className="spin" size={20} /> : <>Sign In <ArrowRight size={18} /></>}
                        </Button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            For demo use: admin / password123
                        </span>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
