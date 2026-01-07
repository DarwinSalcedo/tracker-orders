import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { authService } from '../services/authService';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await authService.login(username, password);
            navigation.replace('MainTabs');
        } catch (error) {
            Alert.alert('Error', 'Invalid credentials or connection error');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tracker Delivery</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={loading} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 28, marginBottom: 30, textAlign: 'center', fontWeight: 'bold' },
    input: { height: 50, borderWidth: 1, borderColor: '#ddd', marginBottom: 15, paddingHorizontal: 15, borderRadius: 8, fontSize: 16 },
    buttonContainer: { marginTop: 10 }
});

export default LoginScreen;
