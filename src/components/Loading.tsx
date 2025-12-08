import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingProps {
    message?: string;
    isDarkMode?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Carregando...', isDarkMode = false }) => {
    const colors = isDarkMode
        ? { spinner: '#FACC15', text: '#CBD5E1', bg: 'transparent' }
        : { spinner: '#0162B3', text: '#64748B', bg: 'transparent' };

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <ActivityIndicator size="large" color={colors.spinner} />
            <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    message: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
    },
});
