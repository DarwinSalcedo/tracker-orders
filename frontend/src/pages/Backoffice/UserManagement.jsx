import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { UserCheck, Trash2, Loader, User, Shield, Clock, Lock } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';
import { useTranslation } from 'react-i18next';

const UserManagement = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [resetUser, setResetUser] = useState(null); // User object to reset
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleApprove = async (id) => {
        setActionLoading(id);
        try {
            await userService.approveUser(id);
            await fetchUsers();
        } catch (err) {
            alert(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('users.delete_confirm'))) return;
        setActionLoading(id);
        try {
            await userService.deleteUser(id);
            await fetchUsers();
        } catch (err) {
            alert(err);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}><Loader className="spin" /></div>;

    return (
        <>
            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <h3 style={{ margin: 0 }}>{t('users.title')}</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
                        {t('users.subtitle')}
                    </p>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--glass-border)', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left' }}>{t('users.table_user_role')}</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left' }}>{t('users.table_status')}</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left' }}>{t('users.table_joined')}</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>{t('users.table_actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, i) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    style={{ borderBottom: '1px solid var(--glass-border)' }}
                                >
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>
                                                <User size={18} color="var(--color-primary)" />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{user.username}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Shield size={10} /> {user.role}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        {user.is_approved ? (
                                            <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '500' }}>{t('users.status_approved')}</span>
                                        ) : (
                                            <span style={{ color: 'var(--color-warning)', fontSize: '0.85rem', fontWeight: '500' }}>{t('users.status_pending')}</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Clock size={12} /> {new Date(user.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            {!user.is_approved && (
                                                <Button
                                                    size="small"
                                                    onClick={() => handleApprove(user.id)}
                                                    disabled={actionLoading === user.id}
                                                >
                                                    {actionLoading === user.id ? <Loader size={14} className="spin" /> : <UserCheck size={16} />} {t('users.action_approve')}
                                                </Button>
                                            )}
                                            <button
                                                style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', opacity: 0.7 }}
                                                onClick={() => handleDelete(user.id)}
                                                disabled={actionLoading === user.id}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button
                                                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', opacity: 0.7 }}
                                                onClick={() => {
                                                    setResetUser(user);
                                                    setIsResetModalOpen(true);
                                                }}
                                                title="Reset Password"
                                            >
                                                <Lock size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <ChangePasswordModal
                isOpen={isResetModalOpen}
                onClose={() => {
                    setIsResetModalOpen(false);
                    setResetUser(null);
                }}
                targetUserId={resetUser?.id}
            />
        </>
    );
};

export default UserManagement;
