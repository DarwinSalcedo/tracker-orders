import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Zap, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = ({ variant = 'default' }) => {
    const { theme, setTheme } = useTheme();

    const themes = [
        { id: 'light', icon: Sun, label: 'Light', color: '#F59E0B' },
        { id: 'dark', icon: Moon, label: 'Dark', color: '#6366F1' },
        { id: 'night', icon: Zap, label: 'Night', color: '#8B5CF6' }
    ];

    const currentTheme = themes.find(t => t.id === theme) || themes[1];

    if (variant === 'minimal') {
        return (
            <button
                onClick={() => setTheme()}
                style={{
                    padding: '0.5rem',
                    borderRadius: '12px',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    color: currentTheme.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                }}
                title={`Current: ${currentTheme.label}. Click to switch.`}
            >
                <currentTheme.icon size={20} />
            </button>
        );
    }

    return (
        <div style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'var(--glass-bg)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--glass-border)',
            width: 'fit-content'
        }}>
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: theme === t.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                        color: theme === t.id ? t.color : 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                        border: theme === t.id ? `1px solid ${t.color}33` : '1px solid transparent'
                    }}
                >
                    <t.icon size={16} />
                    <span className="desktop-only">{t.label}</span>
                </button>
            ))}
        </div>
    );
};

export default ThemeToggle;
