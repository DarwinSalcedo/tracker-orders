import React, { useEffect, useState } from 'react';
import { statusService } from '../../services/statusService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    Loader,
    Settings,
    Activity,
    AlertCircle,
    GripVertical
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StatusManagement = () => {
    const { t } = useTranslation();
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
        if (!window.confirm(t('statuses.delete_confirm'))) return;
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

    const handleReorder = async (newOrder) => {
        setStatuses(newOrder); // Optimistic UI update
        try {
            await statusService.reorderStatuses(newOrder);
        } catch (err) {
            console.error('Failed to save order:', err);
            await fetchStatuses(); // Revert on failure
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}><Loader className="spin" /></div>;

    return (
        <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Header & Add Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0 }}>{t('statuses.title')}</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{t('statuses.subtitle')}</p>
                </div>
                <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? <X size={18} /> : <Plus size={18} />}
                    {showAddForm ? t('statuses.btn_cancel') : t('statuses.btn_add')}
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
                                    label={t('statuses.modal_code')}
                                    placeholder="e.g. out_for_delivery"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                                    required
                                />
                                <Input
                                    label={t('statuses.modal_label')}
                                    placeholder="e.g. Out for Delivery"
                                    value={formData.label}
                                    onChange={e => setFormData({ ...formData, label: e.target.value })}
                                    required
                                />
                                <Input
                                    label={t('statuses.modal_desc')}
                                    placeholder="Brief explanation for tracker..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                                <Button type="submit" disabled={actionLoading === 'create'} style={{ marginBottom: '1rem' }}>
                                    {actionLoading === 'create' ? <Loader className="spin" size={18} /> : t('statuses.btn_create')}
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Draggable List */}
            <Card style={{ padding: '1rem' }}>
                <div style={{
                    display: 'grid', gridTemplateColumns: '40px 1fr 2fr 80px 100px', padding: '0.5rem 1rem',
                    color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem'
                }}>
                    <div></div>
                    <div>{t('statuses.table_code')}</div>
                    <div>{t('statuses.table_desc')}</div>
                    <div style={{ textAlign: 'center' }}>{t('statuses.table_system')}</div>
                    <div style={{ textAlign: 'right' }}>{t('statuses.table_actions')}</div>
                </div>

                <Reorder.Group axis="y" values={statuses} onReorder={handleReorder}>
                    {statuses.map((status) => (
                        <Reorder.Item key={status.id} value={status} style={{ listStyle: 'none' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '40px 1fr 2fr 80px 100px',
                                padding: '1rem',
                                background: 'var(--glass-bg)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                marginBottom: '0.5rem',
                                alignItems: 'center'
                            }}>
                                <div style={{ cursor: 'grab', display: 'flex', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                                    <GripVertical size={20} />
                                </div>

                                <div>
                                    {editingId === status.id ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <input
                                                value={editData.label}
                                                onChange={e => setEditData({ ...editData, label: e.target.value })}
                                                style={{
                                                    background: 'var(--color-bg-secondary)',
                                                    border: '1px solid var(--color-primary)',
                                                    color: 'var(--color-text-main)',
                                                    padding: '0.5rem',
                                                    borderRadius: '6px',
                                                    fontSize: '0.9rem',
                                                    width: '100%'
                                                }}
                                            />
                                            <code style={{ fontSize: '0.75rem', opacity: 0.5 }}>{status.code}</code>
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{status.label}</div>
                                            <code style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{status.code}</code>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    {editingId === status.id ? (
                                        <textarea
                                            value={editData.description}
                                            onChange={e => setEditData({ ...editData, description: e.target.value })}
                                            style={{
                                                width: '100%',
                                                background: 'var(--color-bg-secondary)',
                                                border: '1px solid var(--glass-border)',
                                                color: 'var(--color-text-main)',
                                                padding: '0.5rem',
                                                borderRadius: '6px',
                                                fontSize: '0.85rem',
                                                minHeight: '60px'
                                            }}
                                        />
                                    ) : (
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{status.description}</p>
                                    )}
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    {status.is_system ? (
                                        <Settings size={16} color="var(--color-primary)" title="System Protected" />
                                    ) : (
                                        <Activity size={16} color="var(--color-accent)" title="Custom Status" />
                                    )}
                                </div>

                                <div style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
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
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </Card>

            {/* Warning Note */}
            <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <AlertCircle size={20} color="var(--color-warning)" style={{ marginTop: '0.1rem' }} />
                <div>
                    <h4 style={{ margin: '0 0 0.25rem', color: 'var(--color-warning)' }}>{t('statuses.warning_title')}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        {t('statuses.warning_desc')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StatusManagement;
