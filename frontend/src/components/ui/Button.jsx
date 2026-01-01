import React from 'react';
import { motion } from 'framer-motion';
import './styles/Button.css';

const Button = ({ children, variant = 'primary', onClick, type = 'button', disabled = false, fullWidth = false }) => {
    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            className={`premium-button ${variant} ${fullWidth ? 'full-width' : ''}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
};

export default Button;
