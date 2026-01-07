import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import OrderListScreen from '../screens/OrderListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { TouchableOpacity, Text } from 'react-native';
import { authService } from '../services/authService';

const Tab = createBottomTabNavigator();

const MainTabNavigator = ({ navigation }) => {

    // Header logout button reuse
    const handleLogout = async () => {
        await authService.logout();
        navigation.replace('Login');
    };

    const headerRight = () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
            <Text style={{ color: '#ff4444', fontSize: 16 }}>Logout</Text>
        </TouchableOpacity>
    );

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerRight: headerRight,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Active') {
                        iconName = focused ? 'cube' : 'cube-outline';
                    } else if (route.name === 'History') {
                        iconName = focused ? 'time' : 'time-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen
                name="Active"
                component={OrderListScreen}
                initialParams={{ filterType: 'active' }}
                options={{ title: 'Active Shipments' }}
            />
            <Tab.Screen
                name="History"
                component={OrderListScreen}
                initialParams={{ filterType: 'history' }}
                options={{ title: 'History' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'My Profile', headerRight: null }}
            />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
