import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ActionButtonVariant = 'primary' | 'danger' | 'success' | 'warning';

type ActionButtonProps = TouchableOpacityProps & {
    variant?: ActionButtonVariant;
    icon?: keyof typeof Ionicons.glyphMap;
    children: string;
};

const VARIANT_STYLES = {
    primary: {
        container: {
            backgroundColor: '#0162B3',
            borderWidth: 0,
        },
        text: {
            color: '#FFFFFF',
        },
        icon: '#FFFFFF',
    },
    danger: {
        container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: '#EF4444',
        },
        text: {
            color: '#EF4444',
        },
        icon: '#EF4444',
    },
    success: {
        container: {
            backgroundColor: '#10B981',
            borderWidth: 0,
        },
        text: {
            color: '#FFFFFF',
        },
        icon: '#FFFFFF',
    },
    warning: {
        container: {
            backgroundColor: '#F59E0B',
            borderWidth: 0,
        },
        text: {
            color: '#FFFFFF',
        },
        icon: '#FFFFFF',
    },
};

export function ActionButton({
    variant = 'primary',
    icon,
    children,
    style,
    ...rest
}: ActionButtonProps) {
    const variantStyle = VARIANT_STYLES[variant];

    return (
        <TouchableOpacity
            style={[
                styles.button,
                variantStyle.container,
                style,
            ]}
            {...rest}
        >
            {icon && (
                <Ionicons
                    name={icon}
                    size={20}
                    color={variantStyle.icon}
                    style={styles.icon}
                />
            )}
            <Text style={[styles.text, variantStyle.text]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 48,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    icon: {
        marginRight: 8,
    },
});
