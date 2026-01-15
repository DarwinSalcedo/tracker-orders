import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Lock, User, ArrowRight, Loader } from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle';
import LanguageSwitcher from '../../components/ui/LanguageSwitcher';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            // We can't easily know role here without consuming user context properly, but assuming user object is available
            // Actually, best to let the user login flow handle the initial navigation, or check the stored user
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const role = JSON.parse(savedUser).role;
                if (role === 'SuperAdmin') {
                    navigate('/super-admin/dashboard', { replace: true });
                } else {
                    navigate('/backoffice/dashboard', { replace: true });
                }
            }
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(username, password);
            if (result.user.role === 'SuperAdmin') {
                navigate('/super-admin/dashboard', { replace: true });
            } else {
                navigate('/backoffice/dashboard', { replace: true });
            }
        } catch (err) {
            setError(typeof err === 'string' ? err : (err.message || 'Failed to login'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page flex-center" style={{ background: 'radial-gradient(circle at top right, var(--color-bg-secondary), var(--color-bg-main))', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <LanguageSwitcher />
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
                            <Lock color="white" size={28} />
                        </motion.div>
                        <h1 className="text-gradient">EnCaminar</h1>
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
                        <Link to="/backoffice/register" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                            Need an account? Register here
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
