import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
    Package,
    Search,
    Plus,
    ExternalLink,
    Loader,
    RefreshCw,
    Clock,
    CheckCircle,
    Truck,
    ClipboardList,
    Boxes,
    Navigation,
    Edit2,
    Archive,
    Settings,
    Link,
    Hash,
    Copy,
    Check
} from 'lucide-react';
import Input from '../../components/ui/Input';
import EditShipmentModal from './EditShipmentModal';
import StatusManagement from './StatusManagement';
import UserManagement from './UserManagement';
import { Users } from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle';
import LanguageSwitcher from '../../components/ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoading, setActionLoading] = useState(null); // tracking ID of order being updated
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingShipment, setEditingShipment] = useState(null);
    const [activeTab, setActiveTab] = useState('shipments'); // 'shipments', 'users', or 'completed'
    const [copiedId, setCopiedId] = useState(null);

    const fetchOrders = async () => {
        try {
            const [ordersData, statusesData] = await Promise.all([
                orderService.getAllOrders(),
                orderService.getStatuses()
            ]);
            setOrders(ordersData);
            setStatuses(statusesData);
        } catch (err) {
            console.error('Failed to fetch data:', err);
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

    const handleUpdateStatus = async (orderId, statusCode) => {
        setActionLoading(orderId);
        try {
            await orderService.updateOrder(orderId, { statusCode });
            await fetchOrders();
        } catch (err) {
            console.error('Failed to update status:', err);
            alert('Failed to update status. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdateShipment = async (id, updateData) => {
        try {
            await orderService.updateOrder(id, updateData);
            await fetchOrders();
        } catch (err) {
            console.error('Failed to update shipment:', err);
            throw err;
        }
    };

    const handleCopyLink = (id, token) => {
        const link = `${window.location.origin}/track/${token}`;
        navigator.clipboard.writeText(link);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const openEditModal = (shipment) => {
        setEditingShipment(shipment);
        setIsEditModalOpen(true);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.email && order.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()));

        const isNotDeleted = order.status_code !== 'deleted';

        // Tab filtering
        if (activeTab === 'completed') {
            return matchesSearch && isNotDeleted && order.status_code === 'completed';
        } else if (activeTab === 'shipments') {
            return matchesSearch && isNotDeleted && order.status_code !== 'completed';
        }

        return matchesSearch && isNotDeleted;
    });

    const getStatusBadgeStyle = (code) => {
        switch (code) {
            case 'created': return { bg: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)' };
            case 'picked_up': return { bg: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-accent)' };
            case 'in_transit': return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)' };
            case 'delivered': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)' };
            case 'completed': return { bg: 'rgba(71, 85, 105, 0.1)', color: 'var(--color-text-muted)' };
            case 'in_sorting': return { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)' };
            default: return { bg: 'rgba(148, 163, 184, 0.1)', color: 'var(--color-text-muted)' };
        }
    };

    const stats = [
        { label: 'Total Shipments', value: orders.length, icon: Boxes, color: 'var(--color-primary)' },
        { label: 'In Transit', value: orders.filter(o => o.status_code === 'in_transit').length, icon: Truck, color: 'var(--color-warning)' },
        { label: 'Delivered', value: orders.filter(o => o.status_code === 'delivered').length, icon: CheckCircle, color: 'var(--color-success)' },
        { label: 'New Today', value: orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length, icon: Navigation, color: 'var(--color-accent)' },
    ];

    if (loading && !refreshing) {
        return (
            <div className="page flex-center">
                <Loader className="spin" size={48} color="var(--color-primary)" />
            </div>
        );
    }

    const renderShipmentsContent = () => (
        <>
            {/* Stats Grid */}
            {activeTab === 'shipments' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
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
            )}

            {/* Main Content Area */}
            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ClipboardList size={20} color="var(--color-primary)" />
                        <h3 style={{ margin: 0 }}>{activeTab === 'shipments' ? 'Shipment Manifest' : 'Completed Shipments'}</h3>
                    </div>
                    <div style={{ width: '300px' }}>
                        <Input
                            placeholder="Search Shipment ID or Client..."
                            icon={Search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ marginBottom: 0 }}
                        />
                    </div>
                </div>

                <div className="responsive-table-container">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--glass-border)', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <th style={{ padding: '1rem 1.5rem' }}>Waybill / ID</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Client</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Registered</th>
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
                                        className="dashboard-row"
                                    >
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <span
                                                style={{ fontWeight: '600', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }}
                                                onClick={() => openEditModal(order)}
                                            >
                                                #{order.id}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ fontWeight: '500', color: 'var(--color-text-main)' }}>
                                                {order.customer_name || <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>Guest</span>}
                                            </div>
                                            {order.email && <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{order.email}</div>}
                                            {order.customer_phone && (
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Hash size={12} /> {order.customer_phone}
                                                </div>
                                            )}
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
                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                <button
                                                    style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                                                    title="View Tracking"
                                                    onClick={() => {
                                                        if (order.share_token) {
                                                            navigate(`/track/${order.share_token}`, { state: { fromDashboard: true } });
                                                        } else {
                                                            navigate(`/track?id=${order.id}&email=${order.email}`, { state: { fromDashboard: true } });
                                                        }
                                                    }}
                                                >
                                                    <ExternalLink size={18} />
                                                </button>

                                                {user?.role === 'Admin' && order.status_code !== 'completed' && (
                                                    <button
                                                        style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                                                        title="Edit Shipment"
                                                        onClick={() => openEditModal(order)}
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                )}

                                                {order.share_token && (
                                                    <button
                                                        style={{ color: copiedId === order.id ? 'var(--color-success)' : 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                                                        title="Copy Share Link"
                                                        onClick={() => handleCopyLink(order.id, order.share_token)}
                                                    >
                                                        {copiedId === order.id ? <Check size={18} /> : <Copy size={18} />}
                                                    </button>
                                                )}

                                                <select
                                                    value={order.status_code}
                                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                    disabled={actionLoading === order.id || order.status_code === 'completed'}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.05)',
                                                        color: 'rgba(207, 207, 207, 1)',
                                                        border: '1px solid var(--glass-border)',
                                                        borderRadius: '4px',
                                                        fontSize: '0.8rem',
                                                        padding: '0.2rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {statuses
                                                        .filter(s => {
                                                            if (s.code === 'deleted') return false;
                                                            // If delivered, only allow delivered and completed
                                                            if (order.status_code === 'delivered') {
                                                                return s.code === 'delivered' || s.code === 'completed';
                                                            }
                                                            // If completed, only show completed
                                                            if (order.status_code === 'completed') {
                                                                return s.code === 'completed';
                                                            }
                                                            // Otherwise, show all except completed (unless already completed)
                                                            return s.code !== 'completed';
                                                        })
                                                        .map(s => (
                                                            <option key={s.id} value={s.code}>{s.label}</option>
                                                        ))
                                                    }
                                                </select>

                                                {order.status_code === 'delivered' && (
                                                    <button
                                                        style={{ color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                                                        title="Complete Shipment"
                                                        onClick={() => handleUpdateStatus(order.id, 'completed')}
                                                        disabled={actionLoading === order.id}
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}

                                                {actionLoading === order.id && <Loader size={14} className="spin" style={{ color: 'var(--color-primary)' }} />}
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        No shipments found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );

    const renderShipmentControls = () => (
        <div className="flex-stack" style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="secondary" onClick={handleRefresh} disabled={refreshing} title={t('dashboard.refresh')}>
                <RefreshCw size={18} className={refreshing ? 'spin' : ''} />
            </Button>
            {user?.role === 'Admin' && (
                <Button variant="primary" onClick={() => navigate('/backoffice/create-order')}>
                    <Plus size={18} /> {t('dashboard.register_shipment')}
                </Button>
            )}
            <LanguageSwitcher />
            <ThemeToggle variant="minimal" />
            <Button variant="outline" onClick={logout} style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>
                {t('common.logout')}
            </Button>
        </div>
    );

    return (
        <div className="page" style={{ padding: 'var(--spacing-md) 0', background: 'var(--color-bg-main)' }}>
            <div className="container">
                {/* Header */}
                <header className="flex-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{user?.companyName || 'Global Tracker'}</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>{t('dashboard.logged_as')} {user?.username} ({user?.role})</p>
                    </div>
                    {activeTab === 'shipments' ? renderShipmentControls() : (
                        <div className="flex-stack" style={{ display: 'flex', gap: '1rem' }}>
                            <LanguageSwitcher />
                            <ThemeToggle variant="minimal" />
                            <Button variant="outline" onClick={logout} style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>
                                {t('common.logout')}
                            </Button>
                        </div>
                    )}
                </header>

                {/* Tabs (Admin Only) */}
                {user?.role === 'Admin' && (
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        <button
                            onClick={() => setActiveTab('shipments')}
                            style={{
                                background: 'none', border: 'none', color: activeTab === 'shipments' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: '600', borderBottom: activeTab === 'shipments' ? '2px solid var(--color-primary)' : 'none',
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            <Package size={18} /> {t('dashboard.tabs.shipments')}
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            style={{
                                background: 'none', border: 'none', color: activeTab === 'users' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: '600', borderBottom: activeTab === 'users' ? '2px solid var(--color-primary)' : 'none',
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            <Users size={18} /> {t('dashboard.tabs.users')}
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            style={{
                                background: 'none', border: 'none', color: activeTab === 'completed' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: '600', borderBottom: activeTab === 'completed' ? '2px solid var(--color-primary)' : 'none',
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            <CheckCircle size={18} /> {t('dashboard.tabs.completed')}
                        </button>
                        <button
                            onClick={() => setActiveTab('statuses')}
                            style={{
                                background: 'none', border: 'none', color: activeTab === 'statuses' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: '600', borderBottom: activeTab === 'statuses' ? '2px solid var(--color-primary)' : 'none',
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            <Settings size={18} /> {t('dashboard.tabs.statuses')}
                        </button>
                    </div>
                )}

                {user?.role !== 'Admin' && (
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                        <button
                            onClick={() => setActiveTab('shipments')}
                            style={{
                                background: 'none', border: 'none', color: activeTab === 'shipments' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: '600', borderBottom: activeTab === 'shipments' ? '2px solid var(--color-primary)' : 'none',
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            <Package size={18} /> {t('dashboard.tabs.shipments')}
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            style={{
                                background: 'none', border: 'none', color: activeTab === 'completed' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: '600', borderBottom: activeTab === 'completed' ? '2px solid var(--color-primary)' : 'none',
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            <CheckCircle size={18} /> {t('dashboard.tabs.completed')}
                        </button>
                    </div>
                )}

                {activeTab === 'shipments' || activeTab === 'completed' ? renderShipmentsContent() : (
                    activeTab === 'users' ? <UserManagement /> : <StatusManagement />
                )}
            </div>

            <EditShipmentModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                shipment={editingShipment}
                onUpdate={handleUpdateShipment}
            />
        </div>
    );
};

export default Dashboard;
