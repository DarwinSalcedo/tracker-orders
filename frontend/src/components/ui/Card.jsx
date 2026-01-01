import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false }) => {
    return (
        <motion.div
            className={`glass-panel ${className}`}
            style={{ padding: 'var(--spacing-lg)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hover ? { y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

export default Card;
