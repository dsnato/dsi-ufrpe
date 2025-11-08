import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
    onGoBack?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, onGoBack }) => {
    return (
        <View style={styles.container}>
            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
            <Text style={styles.title}>Ops!</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.buttonContainer}>
                {onRetry && (
                    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                        <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                    </TouchableOpacity>
                )}

                {onGoBack && (
                    <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
                        <Ionicons name="arrow-back-outline" size={20} color="#0162B3" />
                        <Text style={styles.backButtonText}>Voltar</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        marginTop: 16,
        marginBottom: 8,
    },
    message: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0162B3',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#0162B3',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    backButtonText: {
        color: '#0162B3',
        fontSize: 16,
        fontWeight: '600',
    },
});
