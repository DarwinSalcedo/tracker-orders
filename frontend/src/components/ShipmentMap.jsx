import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Maximize2, Minimize2 } from 'lucide-react';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});


const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const dropoffIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const currentIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


const ChangeView = ({ bounds }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [bounds, map]);
    return null;
};

const ShipmentMap = ({ pickup, dropoff, currentLocation }) => {
    const points = [];
    const markers = [];

    if (pickup?.lat && pickup?.lng) {
        const pos = [pickup.lat, pickup.lng];
        points.push(pos);
        markers.push({ pos, icon: pickupIcon, label: 'Pickup Point' });
    }

    if (currentLocation?.lat && currentLocation?.lng) {
        const pos = [currentLocation.lat, currentLocation.lng];
        points.push(pos);
        markers.push({ pos, icon: currentIcon, label: 'Current Shipment Location' });
    }

    if (dropoff?.lat && dropoff?.lng) {
        const pos = [dropoff.lat, dropoff.lng];
        points.push(pos);
        markers.push({ pos, icon: dropoffIcon, label: 'Destination' });
    }

    const [isMaximized, setIsMaximized] = useState(false);

    const toggleMaximize = () => setIsMaximized(!isMaximized);

    const containerStyle = isMaximized ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: 'var(--color-bg-main)',
        borderRadius: 0
    } : {
        height: '400px',
        minHeight: '300px',
        maxHeight: '50vh',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--glass-border)',
        position: 'relative'
    };

    if (points.length === 0) {
        return (
            <div style={{
                height: '400px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '1rem',
                color: 'var(--color-text-muted)'
            }}>
                <MapPin size={48} opacity={0.5} />
                <p>No location data available for this manifest.</p>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <button
                onClick={toggleMaximize}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 1000,
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-main)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                title={isMaximized ? "Minimize Map" : "Maximize Map"}
            >
                {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <MapContainer
                key={isMaximized ? 'maximized' : 'minimized'}
                center={points[0]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={isMaximized}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {markers.map((m, i) => (
                    <Marker key={i} position={m.pos} icon={m.icon}>
                        <Popup>{m.label}</Popup>
                    </Marker>
                ))}

                <ChangeView bounds={points} />
            </MapContainer>
        </div>
    );
};

export default ShipmentMap;
