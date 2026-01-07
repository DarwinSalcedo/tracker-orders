import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { authService } from '../services/authService';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const userData = await authService.getUser();
            setUser(userData);
        };
        loadUser();
    }, []);

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: 'destructive',
                    onPress: async () => {
                        await authService.logout();
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters");
            return;
        }

        setChangingPassword(true);
        try {
            await authService.changePassword(currentPassword, newPassword);
            Alert.alert("Success", "Password changed successfully");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            const msg = error.response?.data?.error || "Failed to change password";
            Alert.alert("Error", msg);
        } finally {
            setChangingPassword(false);
        }
    };

    if (!user) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2196F3" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={40} color="#fff" />
                </View>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.role}>{user.role}</Text>
                {user.companyName && <Text style={styles.company}>{user.companyName}</Text>}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Change Password</Text>
                <View style={styles.card}>
                    <Text style={styles.label}>Current Password</Text>
                    <TextInput
                        style={styles.input}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry
                        placeholder="••••••••"
                    />

                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        placeholder="••••••••"
                    />

                    <Text style={styles.label}>Confirm New Password</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholder="••••••••"
                    />

                    <Button
                        title={changingPassword ? "Updating..." : "Update Password"}
                        onPress={handleChangePassword}
                        disabled={changingPassword}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                    <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f7fa' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { alignItems: 'center', padding: 30, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2196F3', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    username: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    role: { fontSize: 16, color: '#666', marginTop: 5 },
    company: { fontSize: 18, color: '#2196F3', marginTop: 5, fontWeight: '600' },

    section: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },

    label: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '600' },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },

    logoutButton: { backgroundColor: '#ff4444', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 12 },
    logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default ProfileScreen;
