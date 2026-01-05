import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet marker icon issue with Vite/React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom icons for different markers
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

// Helper component to adjust map bounds
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
        <div style={{ height: '400px', minHeight: '300px', maxHeight: '50vh', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
            <MapContainer
                center={points[0]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
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
