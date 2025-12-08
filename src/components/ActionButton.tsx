import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ActionButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
type ActionButtonTone = 'light' | 'dark';

type ActionButtonProps = TouchableOpacityProps & {
    variant?: ActionButtonVariant;
    icon?: keyof typeof Ionicons.glyphMap;
    children: string;
    tone?: ActionButtonTone;
};

type VariantStyle = {
    container: {
        backgroundColor: string;
        borderWidth?: number;
        borderColor?: string;
    };
    text: {
        color: string;
    };
    icon: string;
};

const VARIANT_STYLES: Record<ActionButtonVariant, Record<ActionButtonTone, VariantStyle>> = {
    primary: {
        light: {
            container: {
                backgroundColor: '#0162B3',
                borderWidth: 0,
            },
            text: {
                color: '#FFFFFF',
            },
            icon: '#FFFFFF',
        },
        dark: {
            container: {
                backgroundColor: '#0B5ED7',
                borderWidth: 1,
                borderColor: '#60A5FA',
            },
            text: {
                color: '#F8FAFC',
            },
            icon: '#F8FAFC',
        },
    },
    secondary: {
        light: {
            container: {
                backgroundColor: '#FFFFFF',
                borderWidth: 1.5,
                borderColor: '#0162B3',
            },
            text: {
                color: '#0162B3',
            },
            icon: '#0162B3',
        },
        dark: {
            container: {
                backgroundColor: 'rgba(15, 23, 42, 0.01)',
                borderWidth: 1.5,
                borderColor: '#3B82F6',
            },
            text: {
                color: '#E2E8F0',
            },
            icon: '#93C5FD',
        },
    },
    danger: {
        light: {
            container: {
                backgroundColor: '#FFFFFF',
                borderWidth: 1.5,
                borderColor: '#EF4444',
            },
            text: {
                color: '#EF4444',
            },
            icon: '#EF4444',
        },
        dark: {
            container: {
                backgroundColor: 'rgba(69, 10, 10, 0.6)',
                borderWidth: 1.5,
                borderColor: '#F87171',
            },
            text: {
                color: '#FECACA',
            },
            icon: '#FCA5A5',
        },
    },
    success: {
        light: {
            container: {
                backgroundColor: '#10B981',
                borderWidth: 0,
            },
            text: {
                color: '#FFFFFF',
            },
            icon: '#FFFFFF',
        },
        dark: {
            container: {
                backgroundColor: '#059669',
                borderWidth: 1,
                borderColor: '#34D399',
            },
            text: {
                color: '#ECFDF5',
            },
            icon: '#ECFDF5',
        },
    },
    warning: {
        light: {
            container: {
                backgroundColor: '#F59E0B',
                borderWidth: 0,
            },
            text: {
                color: '#FFFFFF',
            },
            icon: '#FFFFFF',
        },
        dark: {
            container: {
                backgroundColor: '#B45309',
                borderWidth: 1,
                borderColor: '#FBBF24',
            },
            text: {
                color: '#FFF7ED',
            },
            icon: '#FFF7ED',
        },
    },
};

export function ActionButton({
    variant = 'primary',
    icon,
    children,
    style,
    tone = 'light',
    ...rest
}: ActionButtonProps) {
    const variantStyle = VARIANT_STYLES[variant][tone];

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
        borderColor: 'transparent',
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

