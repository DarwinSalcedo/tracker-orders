import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { authService } from '../services/authService';

import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [initialRoute, setInitialRoute] = useState('Login');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await authService.getUser();
                if (userData) {
                    setInitialRoute('MainTabs');
                }
            } catch (e) {
                console.log(e);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute}>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} options={{ title: 'Shipment Details' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
