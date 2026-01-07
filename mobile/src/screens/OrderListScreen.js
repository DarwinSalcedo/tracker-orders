import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';

const OrderListScreen = ({ navigation, route }) => {
    const [orders, setOrders] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const filterType = route.params?.filterType || 'active';

    const filterOrders = (allOrders) => {
        return allOrders.filter(order => {
            const isCompleted = ['delivered', 'cancelled', 'completed'].includes(order.status_code);
            return filterType === 'history' ? isCompleted : !isCompleted;
        });
    };

    const loadOrders = async () => {
        try {
            const data = await orderService.getMyOrders();
            setOrders(filterOrders(data));
        } catch (error) {
            console.log(error);
        }
    };

    // Use useFocusEffect to reload data when screen gains focus
    useFocusEffect(
        useCallback(() => {
            loadOrders();
        }, [filterType])
    );

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadOrders();
        setRefreshing(false);
    }, [filterType]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OrderDetails', { order: item })}
        >
            <View style={styles.header}>
                <Text style={styles.id}>#{item.external_order_id || item.id}</Text>
                <View style={[styles.badge, { backgroundColor: getStatusColor(item.status_code || 'created') }]}>
                    <Text style={styles.badgeText}>{item.status_label || item.status_code}</Text>
                </View>
            </View>
            <Text style={styles.label}>To:</Text>
            <Text style={styles.address} numberOfLines={2}>{item.dropoff_address || 'No destination provided'}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                ListEmptyComponent={<Text style={styles.empty}>No assigned shipments found.</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'created': return '#e0e0e0';
        case 'picked_up': return '#fff3cd';
        case 'in_transit': return '#cce5ff';
        case 'delivered': return '#d4edda';
        default: return '#f8f9fa';
    }
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f7fa' },
    card: { backgroundColor: 'white', padding: 15, marginHorizontal: 15, marginTop: 15, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    id: { fontWeight: 'bold', fontSize: 16, color: '#333' },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeText: { fontSize: 12, fontWeight: '600', color: '#333', textTransform: 'uppercase' },
    label: { fontSize: 12, color: '#888', marginTop: 5 },
    address: { color: '#444', fontSize: 15, marginTop: 2 },
    empty: { textAlign: 'center', marginTop: 50, color: '#888' }
});

export default OrderListScreen;
