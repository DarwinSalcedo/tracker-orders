import React from 'react';
import './styles/Input.css';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, icon: Icon, required = false, ...props }) => {
    return (
        <div className="premium-input-container">
            {label && <label htmlFor={name} className="premium-input-label">{label}</label>}
            <div className="premium-input-wrapper">
                {Icon && <Icon size={18} className="premium-input-icon" />}
                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`premium-input ${Icon ? 'with-icon' : ''}`}
                    {...props}
                />
            </div>
        </div>
    );
};

export default Input;
