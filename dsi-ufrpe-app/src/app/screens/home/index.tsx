import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeDashboard: React.FC = () => {
    const navigation = useNavigation();

    const handleLoginClick = () => {
        navigation.navigate('Login' as never);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo ao Dashboard</Text>
            <Text style={styles.subtitle}>Acesse sua conta para continuar.</Text>
            <TouchableOpacity style={styles.button} onPress={handleLoginClick}>
                <Text style={styles.buttonText}>Ir para Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f6fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 5,
        backgroundColor: '#2d98da',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeDashboard;