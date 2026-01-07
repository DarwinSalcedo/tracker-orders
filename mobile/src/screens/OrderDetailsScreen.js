import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, ScrollView, TouchableOpacity, Linking, Platform, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { orderService } from '../services/orderService';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const OrderDetailsScreen = ({ route, navigation }) => {
    const { order } = route.params;
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isMapFullScreen, setIsMapFullScreen] = useState(false);
    const mapRef = useRef(null);
    const fullScreenMapRef = useRef(null);

    // Status tracking
    const [currentStatus, setCurrentStatus] = useState(order.status_code);
    const [selectedStatus, setSelectedStatus] = useState(order.status_code);
    const [statusLabel, setStatusLabel] = useState(order.status_label || order.status_code);

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const data = await orderService.getStatuses();
                setStatuses(data.filter(s => s.code !== 'created' && s.code !== 'completed'));
            } catch (e) { console.log(e); }
        };
        fetchStatuses();
    }, []);

    const handleStatusUpdate = async () => {
        if (selectedStatus === currentStatus) {
            Alert.alert("Info", "Please select a different status to update.");
            return;
        }

        const statusObj = statuses.find(s => s.code === selectedStatus);
        if (!statusObj) return;

        setLoading(true);
        try {
            // Get Location
            let locData = {};
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    const loc = await Location.getCurrentPositionAsync({});
                    locData = { lat: loc.coords.latitude, lng: loc.coords.longitude };
                }
            } catch (err) {
                console.log("Location error", err);
            }

            await orderService.updateOrder(order.id, {
                statusCode: statusObj.code,
                ...locData
            });
            setCurrentStatus(selectedStatus);
            setStatusLabel(statusObj.label);
            Alert.alert("Success", `Shipment marked as ${statusObj.label}`);
        } catch (error) {
            Alert.alert("Error", "Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    const handleCallCustomer = () => {
        if (order.customer_phone) {
            Linking.openURL(`tel:${order.customer_phone}`);
        }
    };

    const openMaps = (lat, lng, label) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const labelStr = label || 'Location';
        const url = Platform.select({
            ios: `${scheme}${labelStr}@${latLng}`,
            android: `${scheme}${latLng}(${labelStr})`
        });
        Linking.openURL(url);
    };

    const animateToPin = (lat, lng, ref) => {
        if (ref.current && lat && lng) {
            ref.current.animateToRegion({
                latitude: parseFloat(lat),
                longitude: parseFloat(lng),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        }
    };

    const initialLat = order.pickup_lat ? parseFloat(order.pickup_lat) : 0;
    const initialLng = order.pickup_lng ? parseFloat(order.pickup_lng) : 0;

    const getStatusBadgeColor = (code) => {
        switch (code) {
            case 'created': return '#e0e0e0';
            case 'picked_up': return '#fff3cd';
            case 'in_transit': return '#cce5ff';
            case 'delivered': return '#d4edda';
            case 'cancelled': return '#f8d7da';
            default: return '#f8f9fa';
        }
    };

    const isOrderCompleted = ['delivered', 'cancelled', 'completed'].includes(currentStatus);

    const MapViewContent = ({ style = {}, showControls = false, mapReference }) => (
        <View style={style}>
            <MapView
                ref={mapReference}
                style={{ width: '100%', height: '100%' }}
                initialRegion={{
                    latitude: initialLat,
                    longitude: initialLng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                {order.pickup_lat && <Marker coordinate={{ latitude: parseFloat(order.pickup_lat), longitude: parseFloat(order.pickup_lng) }} title="Pickup" pinColor="blue" />}
                {order.dropoff_lat && <Marker coordinate={{ latitude: parseFloat(order.dropoff_lat), longitude: parseFloat(order.dropoff_lng) }} title="Dropoff" pinColor="green" />}
            </MapView>

            {/* Quick Navigation Buttons (On Map) */}
            <View style={styles.mapNavOverlay}>
                {order.pickup_lat && (
                    <TouchableOpacity
                        style={[styles.mapNavButton, { backgroundColor: '#2196F3' }]}
                        onPress={() => animateToPin(order.pickup_lat, order.pickup_lng, mapReference)}
                    >
                        <Ionicons name="location" size={16} color="white" />
                        <Text style={styles.mapNavText}>Pickup</Text>
                    </TouchableOpacity>
                )}
                {order.dropoff_lat && (
                    <TouchableOpacity
                        style={[styles.mapNavButton, { backgroundColor: '#4CAF50', marginTop: 8 }]}
                        onPress={() => animateToPin(order.dropoff_lat, order.dropoff_lng, mapReference)}
                    >
                        <Ionicons name="flag" size={16} color="white" />
                        <Text style={styles.mapNavText}>Drop</Text>
                    </TouchableOpacity>
                )}
            </View>

            {showControls && (
                <TouchableOpacity
                    style={styles.maximizeButton}
                    onPress={() => setIsMapFullScreen(true)}
                >
                    <Ionicons name="expand" size={20} color="#333" />
                </TouchableOpacity>
            )}
            {!showControls && (
                <TouchableOpacity
                    style={styles.closeMapButton}
                    onPress={() => setIsMapFullScreen(false)}
                >
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MapViewContent style={{ flex: 1 }} showControls={true} mapReference={mapRef} />
            </View>

            <Modal visible={isMapFullScreen} animationType="slide" onRequestClose={() => setIsMapFullScreen(false)}>
                <MapViewContent style={{ flex: 1 }} showControls={false} mapReference={fullScreenMapRef} />
            </Modal>

            <ScrollView style={styles.infoScroll} contentContainerStyle={styles.infoContent}>
                <View style={styles.headerRow}>
                    <Text style={styles.title} selectable={true}>{order.id}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor(currentStatus) }]}>
                        <Text style={styles.statusText}>{statusLabel}</Text>
                    </View>
                </View>

                {/* Customer Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Customer</Text>
                    <Text style={styles.detailText}>Name: {order.customer_name || 'N/A'}</Text>
                    <TouchableOpacity onPress={handleCallCustomer} style={styles.phoneRow}>
                        <Text style={styles.detailText}>Phone: {order.customer_phone || 'N/A'}</Text>
                        {order.customer_phone && <Ionicons name="call" size={18} color="#2196F3" style={{ marginLeft: 8 }} />}
                    </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                {/* Addresses */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Logistics</Text>

                    <View style={styles.addressRow}>
                        <Text style={styles.label}>Pickup:</Text>
                        {order.pickup_lat && (
                            <TouchableOpacity onPress={() => openMaps(order.pickup_lat, order.pickup_lng, 'Pickup')}>
                                <View style={styles.navButton}>
                                    <Ionicons name="navigate" size={14} color="white" />
                                    <Text style={styles.navButtonText}>Go</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={styles.address}>{order.pickup_address || "N/A"}</Text>

                    <View style={[styles.addressRow, { marginTop: 10 }]}>
                        <Text style={styles.label}>Dropoff:</Text>
                        {order.dropoff_lat && (
                            <TouchableOpacity onPress={() => openMaps(order.dropoff_lat, order.dropoff_lng, 'Dropoff')}>
                                <View style={styles.navButton}>
                                    <Ionicons name="navigate" size={14} color="white" />
                                    <Text style={styles.navButtonText}>Go</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={styles.address}>{order.dropoff_address || "N/A"}</Text>
                </View>

                <View style={styles.divider} />

                {/* Instructions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notes</Text>
                    {order.delivery_instructions ? (
                        <Text style={styles.instructions}>{order.delivery_instructions}</Text>
                    ) : (
                        <Text style={styles.italic}>No delivery instructions provided.</Text>
                    )}
                </View>

                <View style={styles.divider} />

                {/* Status Update */}
                <View style={styles.actionContainer}>
                    <Text style={styles.sectionTitle}>Update Status</Text>

                    {isOrderCompleted ? (
                        <View style={styles.completedMessage}>
                            <Ionicons name="checkmark-circle" size={48} color="green" style={{ alignSelf: 'center', marginBottom: 10 }} />
                            <Text style={styles.completedText}>This shipment is {statusLabel.toLowerCase()}.</Text>
                            <Text style={styles.completedSubText}>No further updates allowed.</Text>
                        </View>
                    ) : (
                        <>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedStatus}
                                    onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                                    enabled={!loading}
                                    style={{ height: 50, width: '100%' }}
                                >
                                    {statuses.map((status) => (
                                        <Picker.Item key={status.id} label={status.label} value={status.code} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={{ marginTop: 10 }}>
                                <Button
                                    title={loading ? "Updating..." : "Update Status"}
                                    onPress={handleStatusUpdate}
                                    disabled={loading || selectedStatus === currentStatus}
                                    color="#2196F3"
                                />
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    mapContainer: { height: 250, position: 'relative' },
    maximizeButton: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'white', padding: 8, borderRadius: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
    closeMapButton: { position: 'absolute', top: 40, right: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 25 },
    mapNavOverlay: { position: 'absolute', top: 10, left: 10 },
    mapNavButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1 },
    mapNavText: { color: 'white', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },

    infoScroll: { flex: 1 },
    infoContent: { padding: 20, paddingBottom: 40 },

    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 20, fontWeight: 'bold' },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    statusText: { fontWeight: 'bold', textTransform: 'capitalize', color: '#333' },

    section: { marginBottom: 15 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },

    addressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    navButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4CAF50', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    navButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },

    label: { fontWeight: '600', color: '#666', fontSize: 14 },
    address: { marginTop: 2, color: '#333', fontSize: 15, lineHeight: 20 },
    detailText: { fontSize: 15, color: '#444', marginBottom: 4 },
    phoneRow: { flexDirection: 'row', alignItems: 'center' },

    instructions: { color: '#555', fontSize: 15, lineHeight: 22, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8 },
    italic: { fontStyle: 'italic', color: '#999' },

    actionContainer: { marginTop: 10 },
    pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 15, marginTop: 10, backgroundColor: '#f9f9f9', justifyContent: 'center' },
    completedMessage: { alignItems: 'center', padding: 20, backgroundColor: '#f0fcf4', borderRadius: 8, marginTop: 10 },
    completedText: { fontSize: 18, fontWeight: 'bold', color: 'green', marginBottom: 5 },
    completedSubText: { color: '#666' }
});

export default OrderDetailsScreen;
