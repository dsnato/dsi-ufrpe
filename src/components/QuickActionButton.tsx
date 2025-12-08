import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type QuickActionButtonVariant = 'primary' | 'secondary';
type QuickActionButtonSurface = 'light' | 'dark';

interface QuickActionButtonProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    variant?: QuickActionButtonVariant;
    surface?: QuickActionButtonSurface;
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
const BUTTON_THEMES: Record<QuickActionButtonSurface, Record<QuickActionButtonVariant, {
    backgroundColor: string;
    borderColor?: string;
    borderWidth?: number;
    textColor: string;
    iconColor: string;
    shadowColor: string;
}>> = {
    light: {
        primary: {
            backgroundColor: '#0162B3',
            textColor: '#FFFFFF',
            iconColor: '#FFFFFF',
            borderColor: '#0162B3',
            borderWidth: 0,
            shadowColor: 'rgba(15, 23, 42, 0.15)',
        },
        secondary: {
            backgroundColor: '#FFFFFF',
            textColor: '#0162B3',
            iconColor: '#0162B3',
            borderColor: '#0162B3',
            borderWidth: 1.5,
            shadowColor: 'rgba(15, 23, 42, 0.1)',
        },
    },
    dark: {
        primary: {
            backgroundColor: '#0B5ED7',
            textColor: '#F8FAFC',
            iconColor: '#F8FAFC',
            borderColor: '#3B82F6',
            borderWidth: 1,
            shadowColor: 'rgba(0, 0, 0, 0.45)',
        },
        secondary: {
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            textColor: '#E2E8F0',
            iconColor: '#93C5FD',
            borderColor: '#1D4ED8',
            borderWidth: 1.5,
            shadowColor: 'rgba(8, 47, 73, 0.6)',
        },
    },
};

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
    icon,
    label,
    onPress,
    variant = 'primary',
    surface = 'light',
}) => {
    const palette = BUTTON_THEMES[surface][variant];

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: palette.backgroundColor,
                    borderColor: palette.borderColor,
                    borderWidth: palette.borderWidth ?? 0,
                    shadowColor: palette.shadowColor,
                },
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Ionicons
                name={icon}
                size={20}
                color={palette.iconColor}
            />
            <Text style={[styles.label, { color: palette.textColor }]}>
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
        elevation: 3,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
});

