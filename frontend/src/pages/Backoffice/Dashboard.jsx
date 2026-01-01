import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
    Package,
    Search,
    Plus,
    MoreVertical,
    ExternalLink,
    Loader,
    RefreshCw,
    TrendingUp,
    Clock,
    CheckCircle,
    Truck
} from 'lucide-react';
import Input from '../../components/ui/Input';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getAllOrders();
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadgeStyle = (code) => {
        switch (code) {
            case 'created': return { bg: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)' };
            case 'picked_up': return { bg: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-accent)' };
            case 'in_transit': return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)' };
            case 'delivered': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)' };
            default: return { bg: 'rgba(148, 163, 184, 0.1)', color: 'var(--color-text-muted)' };
        }
    };

    const stats = [
        { label: 'Total Orders', value: orders.length, icon: Package, color: 'var(--color-primary)' },
        { label: 'In Transit', value: orders.filter(o => o.status_code === 'in_transit').length, icon: Truck, color: 'var(--color-warning)' },
        { label: 'Delivered', value: orders.filter(o => o.status_code === 'delivered').length, icon: CheckCircle, color: 'var(--color-success)' },
        { label: 'New Today', value: orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length, icon: TrendingUp, color: 'var(--color-accent)' },
    ];

    if (loading && !refreshing) {
        return (
            <div className="page flex-center">
                <Loader className="spin" size={48} color="var(--color-primary)" />
            </div>
        );
    }

    return (
        <div className="page" style={{ padding: '2rem', background: 'var(--color-bg-main)' }}>
            <div className="container">
                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Backoffice Dashboard</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Welcome back, {user?.name}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Button variant="secondary" onClick={handleRefresh} disabled={refreshing}>
                            <RefreshCw size={18} className={refreshing ? 'spin' : ''} />
                        </Button>
                        <Button variant="primary" onClick={() => alert('Create Order Modal/Page')}>
                            <Plus size={18} /> New Order
                        </Button>
                        <Button variant="outline" onClick={logout} style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>
                            Logout
                        </Button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {stats.map((stat, i) => (
                        <Card key={i} style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{stat.label}</p>
                                    <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{stat.value}</h3>
                                </div>
                                <div style={{ padding: '0.75rem', background: `${stat.color}15`, borderRadius: '12px' }}>
                                    <stat.icon size={24} color={stat.color} />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Main Content Area */}
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <h3 style={{ margin: 0 }}>Order History</h3>
                        <div style={{ width: '300px' }}>
                            <Input
                                placeholder="Search by ID or Email..."
                                icon={Search}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ marginBottom: 0 }}
                            />
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '1rem 1.5rem' }}>Tracking ID</th>
                                    <th style={{ padding: '1rem 1.5rem' }}>Customer</th>
                                    <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem' }}>Created</th>
                                    <th style={{ padding: '1rem 1.5rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length > 0 ? filteredOrders.map((order, i) => {
                                    const statusStyle = getStatusBadgeStyle(order.status_code);
                                    return (
                                        <motion.tr
                                            key={order.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>#{order.id}</span>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ fontSize: '0.95rem' }}>{order.email}</div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    backgroundColor: statusStyle.bg,
                                                    color: statusStyle.color,
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {order.status_label}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                                    <Clock size={14} />
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <button style={{ color: 'var(--color-text-muted)' }} title="View Details" onClick={() => alert(`View details for ${order.id}`)}>
                                                        <ExternalLink size={18} />
                                                    </button>
                                                    <button style={{ color: 'var(--color-text-muted)' }} title="Quick Edit" onClick={() => alert(`Quick edit for ${order.id}`)}>
                                                        <MoreVertical size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                            No orders found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
