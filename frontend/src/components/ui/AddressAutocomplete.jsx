import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader, X } from 'lucide-react';
import Input from './Input';
import { searchAddress } from '../../services/geocodingService';
import './styles/AddressAutocomplete.css';

const AddressAutocomplete = ({ label, value, onChange, onSelect, placeholder, name, required }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const query = e.target.value;
        onChange(e);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (query.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setIsLoading(true);
        debounceRef.current = setTimeout(async () => {
            const results = await searchAddress(query);
            setSuggestions(results);
            setShowSuggestions(true);
            setIsLoading(false);
        }, 800);
    };

    const handleSelect = (suggestion) => {
        onSelect(suggestion);
        setShowSuggestions(false);
        // We artificially trigger an event to update the parent input value if needed, 
        // but typically the parent handles the 'value' prop update via onSelect logic 
        // essentially setting the address text to suggestion.displayName
    };

    return (
        <div className="address-autocomplete-wrapper" ref={wrapperRef}>
            <div style={{ position: 'relative' }}>
                <Input
                    label={label}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    icon={MapPin}
                    required={required}
                    autoComplete="off"
                />
                {isLoading && (
                    <div style={{ position: 'absolute', right: '12px', top: '38px' }}>
                        <Loader size={16} className="spin" color="var(--color-primary)" />
                    </div>
                )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSelect(suggestion)}>
                            <MapPin size={14} className="suggestion-icon" />
                            <span>{suggestion.displayName}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AddressAutocomplete;
