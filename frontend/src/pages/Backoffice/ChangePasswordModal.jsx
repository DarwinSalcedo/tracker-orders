import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Check, Loader } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { userService } from '../../services/userService';

const ChangePasswordModal = ({ isOpen, onClose, targetUserId }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const isAdminReset = !!targetUserId;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }

        if (newPassword.length < 6) {
            setStatus({ type: 'error', message: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            if (isAdminReset) {
                await userService.resetPassword(targetUserId, newPassword);
                setStatus({ type: 'success', message: 'User password reset successfully!' });
            } else {
                await userService.changePassword(currentPassword, newPassword);
                setStatus({ type: 'success', message: 'Password updated successfully!' });
            }

            // Clear form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Close after success
            setTimeout(() => {
                onClose();
                setStatus({ type: '', message: '' });
            }, 1500);
        } catch (err) {
            setStatus({ type: 'error', message: err });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    style={{ width: '100%', maxWidth: '400px' }}
                >
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Lock size={20} className="text-primary" /> {isAdminReset ? 'Reset User Password' : 'Change Password'}
                            </h3>
                            <button
                                onClick={onClose}
                                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {status.message && (
                            <div style={{
                                padding: '0.75rem',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                fontSize: '0.9rem',
                                background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: status.type === 'success' ? '#10b981' : '#ef4444',
                                border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}>
                                {status.type === 'success' ? <Check size={16} /> : <X size={16} />}
                                {status.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {!isAdminReset && (
                                <Input
                                    label="Current Password"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                />
                            )}
                            <Input
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm New Password"
                            />

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <Button type="button" variant="secondary" onClick={onClose} fullWidth>
                                    Cancel
                                </Button>
                                <Button type="submit" fullWidth disabled={loading}>
                                    {loading ? <Loader className="spin" size={18} /> : (isAdminReset ? 'Reset Password' : 'Update Password')}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChangePasswordModal;
