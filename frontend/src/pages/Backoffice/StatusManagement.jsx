import React, { useEffect, useState } from 'react';
import { statusService } from '../../services/statusService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Link,
    Trash2,
    Edit2,
    Save,
    X,
    Loader,
    Settings,
    Activity,
    AlertCircle,
    Info
} from 'lucide-react';

const StatusManagement = () => {
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form States
    const [formData, setFormData] = useState({ code: '', label: '', description: '' });
    const [editData, setEditData] = useState({ label: '', description: '' });

    const fetchStatuses = async () => {
        try {
            const data = await statusService.getAllStatuses();
            setStatuses(data);
        } catch (err) {
            console.error('Failed to fetch statuses:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatuses();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setActionLoading('create');
        try {
            await statusService.createStatus(formData);
            setFormData({ code: '', label: '', description: '' });
            setShowAddForm(false);
            await fetchStatuses();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdate = async (id) => {
        setActionLoading(id);
        try {
            await statusService.updateStatus(id, editData);
            setEditingId(null);
            await fetchStatuses();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this status? This cannot be undone if not in use.')) return;
        setActionLoading(id);
        try {
            await statusService.deleteStatus(id);
            await fetchStatuses();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete status');
        } finally {
            setActionLoading(null);
        }
    };

    const startEditing = (status) => {
        setEditingId(status.id);
        setEditData({ label: status.label, description: status.description });
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}><Loader className="spin" /></div>;

    return (
        <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Header & Add Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Workflow Statuses</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Define the lifecycle stages for shipments.</p>
                </div>
                <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? <X size={18} /> : <Plus size={18} />}
                    {showAddForm ? 'Cancel' : 'Add New Status'}
                </Button>
            </div>

            {/* Add Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <Card style={{ padding: '1.5rem', border: '1px solid var(--color-primary)33' }}>
                            <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                                <Input
                                    label="Code (Internal ID)"
                                    placeholder="e.g. out_for_delivery"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Label (Display Name)"
                                    placeholder="e.g. Out for Delivery"
                                    value={formData.label}
                                    onChange={e => setFormData({ ...formData, label: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Description"
                                    placeholder="Brief explanation for tracker..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                                <Button type="submit" disabled={actionLoading === 'create'} style={{ marginBottom: '1rem' }}>
                                    {actionLoading === 'create' ? <Loader className="spin" size={18} /> : 'Create Status'}
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List Table */}
            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <div className="responsive-table-container">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--glass-border)', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Status / Code</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>External Description</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>System</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statuses.map((status) => (
                                <tr key={status.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        {editingId === status.id ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <input
                                                    value={editData.label}
                                                    onChange={e => setEditData({ ...editData, label: e.target.value })}
                                                    style={{ background: 'var(--glass-bg)', border: '1px solid var(--color-primary)', color: 'var(--color-text-main)', padding: '0.4rem', borderRadius: '4px' }}
                                                />
                                                <code style={{ fontSize: '0.75rem', opacity: 0.5 }}>{status.code}</code>
                                            </div>
                                        ) : (
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{status.label}</div>
                                                <code style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{status.code}</code>
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {editingId === status.id ? (
                                            <textarea
                                                value={editData.description}
                                                onChange={e => setEditData({ ...editData, description: e.target.value })}
                                                style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text-main)', padding: '0.4rem', borderRadius: '4px', fontSize: '0.85rem' }}
                                            />
                                        ) : (
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', maxWidth: '250px' }}>{status.description}</p>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        {status.is_system ? (
                                            <Settings size={16} color="var(--color-primary)" title="System Protected" />
                                        ) : (
                                            <Activity size={16} color="var(--color-accent)" title="Custom Status" />
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            {editingId === status.id ? (
                                                <>
                                                    <Button size="small" variant="primary" onClick={() => handleUpdate(status.id)} disabled={actionLoading === status.id}>
                                                        {actionLoading === status.id ? <Loader className="spin" size={14} /> : <Save size={16} />}
                                                    </Button>
                                                    <Button size="small" variant="secondary" onClick={() => setEditingId(null)}>
                                                        <X size={16} />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button size="small" variant="ghost" onClick={() => startEditing(status)}>
                                                        <Edit2 size={16} />
                                                    </Button>
                                                    {!status.is_system && (
                                                        <Button size="small" variant="ghost" onClick={() => handleDelete(status.id)} disabled={actionLoading === status.id} style={{ color: 'var(--color-error)' }}>
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Warning Note */}
            <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <AlertCircle size={20} color="var(--color-warning)" style={{ marginTop: '0.1rem' }} />
                <div>
                    <h4 style={{ margin: '0 0 0.25rem', color: 'var(--color-warning)' }}>Mandatory Statuses</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        Statuses marked with the gear icon are required for the application's core logic and cannot be deleted. You can, however, update their labels and descriptions.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StatusManagement;
