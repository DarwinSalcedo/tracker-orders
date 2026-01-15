import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Terminal, Sparkles } from 'lucide-react';
import packageJson from '../../../package.json';

const VersionBadge = () => {
    const [isHovered, setIsHovered] = useState(false);

    // Extracted from package.json
    const version = packageJson.version;

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
                position: 'fixed',
                bottom: '1.5rem',
                left: '1.5rem',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
            }}
        >
            <motion.div
                layout
                style={{
                    background: isHovered
                        ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)'
                        : 'var(--glass-bg)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '20px',
                    padding: '0.4rem 0.8rem',
                    boxShadow: isHovered
                        ? '0 8px 32px rgba(99, 102, 241, 0.3)'
                        : '0 4px 6px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: isHovered ? 'white' : 'var(--color-text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    boxSizing: 'border-box'
                }}
            >
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <AnimatePresence mode='wait'>
                        {isHovered ? (
                            <motion.div
                                key="sparkles"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                            >
                                <Sparkles size={14} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="terminal"
                                initial={{ scale: 0, rotate: 180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: -180 }}
                            >
                                <Terminal size={14} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                    <motion.span layout>v{version}</motion.span>
                </div>

                {isHovered && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}
                    >
                        <span style={{ marginLeft: '0.25rem', opacity: 0.8 }}>| PROD</span>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default VersionBadge;
