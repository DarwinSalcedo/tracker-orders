import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Building, UserPlus, Shield, Loader, LogOut, Copy, Check } from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle';

const SuperAdminDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    // Forms
    const [newCompany, setNewCompany] = useState({ name: '', plan: 'pro' });
    const [newAdmin, setNewAdmin] = useState({ username: '', password: '', companyId: '' });

    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            // Re-using public endpoint for now, or could create an admin one with more details
            const response = await api.get('/companies');
            setCompanies(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCompany = async (e) => {
        e.preventDefault();
        try {
            await api.post('/companies', newCompany);
            setStatus({ type: 'success', message: 'Company created!' });
            setNewCompany({ name: '', plan: 'pro' });
            fetchCompanies();
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.error || 'Failed' });
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/admin', newAdmin);
            setStatus({ type: 'success', message: `Admin created for company ID ${newAdmin.companyId}!` });
            setNewAdmin({ username: '', password: '', companyId: '' });
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.error || 'Failed' });
        }
    };

    const getShortId = (id) => {
        if (!id) return '';
        return '...' + id.slice(-4);
    };

    const handleCopyId = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="page" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Super Admin</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Platform Management Dashboard</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <ThemeToggle />
                    <Button variant="outline" onClick={() => { logout(); navigate('/backoffice/login'); }}>
                        <LogOut size={18} /> Logout
                    </Button>
                </div>
            </header>

            {status.message && (
                <div style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: status.type === 'success' ? '#10b981' : '#ef4444',
                    border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {status.type === 'success' ? <Shield size={18} /> : <LogOut size={18} />}
                    {status.message}
                </div>
            )}

            {/* Stats / Overview Row */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <Card style={{ minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            padding: '1rem',
                            borderRadius: '50%',
                            background: 'var(--color-primary-light)',
                            color: 'var(--color-primary)'
                        }}>
                            <Building size={24} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Total Companies</h4>
                            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{companies.length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                {/* Create Company */}
                <Card>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <UserPlus size={20} className="text-primary" /> New Company
                    </h3>
                    <form onSubmit={handleCreateCompany} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Input
                            label="Company Name"
                            value={newCompany.name}
                            onChange={e => setNewCompany({ ...newCompany, name: e.target.value })}
                            placeholder="e.g. Acme Logistics"
                            required
                        />
                        <div className="premium-input-container">
                            <label className="premium-input-label">Plan</label>
                            <div className="premium-input-wrapper">
                                <select
                                    className="premium-input"
                                    value={newCompany.plan}
                                    onChange={e => setNewCompany({ ...newCompany, plan: e.target.value })}
                                >
                                    <option value="free">Free</option>
                                    <option value="pro">Pro</option>
                                    <option value="enterprise">Enterprise</option>
                                </select>
                            </div>
                        </div>
                        <Button type="submit" fullWidth>Create Company</Button>
                    </form>
                </Card>

                {/* Create Admin */}
                <Card>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Shield size={20} className="text-primary" /> Create Company Admin
                    </h3>
                    <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="premium-input-container">
                            <label className="premium-input-label">Target Company</label>
                            <div className="premium-input-wrapper">
                                <select
                                    className="premium-input"
                                    value={newAdmin.companyId}
                                    onChange={e => setNewAdmin({ ...newAdmin, companyId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Company...</option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} (ID: {getShortId(c.id)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <Input
                            label="Admin Username"
                            value={newAdmin.username}
                            onChange={e => setNewAdmin({ ...newAdmin, username: e.target.value })}
                            placeholder="username"
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={newAdmin.password}
                            onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                            placeholder="••••••••"
                            required
                        />
                        <Button type="submit" fullWidth>Create Admin User</Button>
                    </form>
                </Card>
            </div>

            {/* Company List */}
            <Card>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building size={20} className="text-primary" /> System Companies
                </h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>ID</th>
                                <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Name</th>
                                <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Plan</th>
                                <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map(c => (
                                <tr key={c.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontFamily: 'monospace' }}>{getShortId(c.id)}</span>
                                        <button
                                            onClick={() => handleCopyId(c.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: copiedId === c.id ? 'var(--color-success)' : 'var(--color-text-muted)',
                                                padding: '4px',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                            title="Copy full ID"
                                        >
                                            {copiedId === c.id ? <Check size={14} /> : <Copy size={14} />}
                                        </button>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{c.name}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            background: c.plan === 'pro' ? 'var(--color-primary)' : 'var(--glass-bg)',
                                            border: c.plan === 'pro' ? 'none' : '1px solid var(--glass-border)',
                                            color: c.plan === 'pro' ? 'white' : 'var(--color-text)',
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase',
                                            fontWeight: 'bold',
                                            letterSpacing: '0.05em'
                                        }}>
                                            {c.plan}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                        {new Date(c.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default SuperAdminDashboard;
