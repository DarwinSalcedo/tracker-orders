import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Building, UserPlus, Shield, Loader, LogOut } from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle';

const SuperAdminDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="page" style={{ padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-gradient">Super Admin</h1>
                    <p>Platform Management</p>
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
                    borderRadius: '8px',
                    marginBottom: '2rem',
                    background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: status.type === 'success' ? '#10b981' : '#ef4444',
                    border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}`
                }}>
                    {status.message}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Create Company */}
                <Card>
                    <h3><Building size={20} /> New Company</h3>
                    <form onSubmit={handleCreateCompany} style={{ marginTop: '1rem' }}>
                        <Input
                            label="Company Name"
                            value={newCompany.name}
                            onChange={e => setNewCompany({ ...newCompany, name: e.target.value })}
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
                    <h3><Shield size={20} /> Create Company Admin</h3>
                    <form onSubmit={handleCreateAdmin} style={{ marginTop: '1rem' }}>
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
                                        <option key={c.id} value={c.id}>{c.name} (ID: {c.id})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <Input
                            label="Admin Username"
                            value={newAdmin.username}
                            onChange={e => setNewAdmin({ ...newAdmin, username: e.target.value })}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={newAdmin.password}
                            onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                            required
                        />
                        <Button type="submit" fullWidth>Create Admin User</Button>
                    </form>
                </Card>

                {/* Company List */}
                <Card style={{ gridColumn: '1 / -1' }}>
                    <h3>System Companies</h3>
                    <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ padding: '1rem' }}>ID</th>
                                    <th style={{ padding: '1rem' }}>Name</th>
                                    <th style={{ padding: '1rem' }}>Plan</th>
                                    <th style={{ padding: '1rem' }}>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.map(c => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '1rem' }}>{c.id}</td>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{c.name}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                background: 'var(--color-primary)',
                                                color: 'white',
                                                fontSize: '0.8rem'
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
        </div>
    );
};

export default SuperAdminDashboard;
