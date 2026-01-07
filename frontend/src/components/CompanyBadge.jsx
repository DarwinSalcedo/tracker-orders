import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const CompanyBadge = () => {
    const { user } = useAuth();
    const { theme } = useTheme();

    if (!user?.companyName) return null;

    const isDark = theme === 'dark' || theme === 'night';

    return (
        <div style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 9999,
            padding: '0.5rem 1rem',
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: isDark ? '#fff' : '#000',
            fontSize: '0.9rem',
            fontWeight: 500,
            pointerEvents: 'none', // Allow clicking through if it obscures something important
            transition: 'all 0.3s ease'
        }}>
            <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981', // Green dot indicator
                boxShadow: '0 0 8px #10B981'
            }} />
            {user.companyName}
        </div>
    );
};

export default CompanyBadge;
