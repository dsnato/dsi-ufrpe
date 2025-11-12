import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface QuickActionButtonProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
}

/**
 * QuickActionButton - Botão de ação rápida com ícone
 * 
 * @example
 * ```tsx
 * <QuickActionButton
 *   icon="add-circle-outline"
 *   label="Nova Reserva"
 *   onPress={handleCreate}
 *   variant="primary"
 * />
 * ```
 */
export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
    icon,
    label,
    onPress,
    variant = 'primary',
}) => {
    const isPrimary = variant === 'primary';

    return (
        <TouchableOpacity
            style={[styles.button, isPrimary ? styles.primary : styles.secondary]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Ionicons
                name={icon}
                size={20}
                color={isPrimary ? '#FFFFFF' : '#0162B3'}
            />
            <Text style={[styles.label, isPrimary ? styles.primaryText : styles.secondaryText]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 8,
        flex: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    primary: {
        backgroundColor: '#0162B3',
    },
    secondary: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#0162B3',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    primaryText: {
        color: '#FFFFFF',
    },
    secondaryText: {
        color: '#0162B3',
    },
});
