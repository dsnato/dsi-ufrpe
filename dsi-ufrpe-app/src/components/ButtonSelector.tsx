import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ButtonSelectorProps {
    label: string;
    options: Array<{ label: string; value: string; icon?: keyof typeof Ionicons.glyphMap }>;
    value: string;
    onSelect: (value: string) => void;
    helperText?: string;
    isDarkMode?: boolean;
}

export const ButtonSelector: React.FC<ButtonSelectorProps> = ({
    label,
    options,
    value,
    onSelect,
    helperText,
    isDarkMode = false,
}) => {
    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: isDarkMode ? '#F1F5F9' : '#132F3B' }]}>{label}</Text>
            {helperText && <Text style={[styles.helperText, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>{helperText}</Text>}
            <View style={styles.buttonsContainer}>
                {options.map((option) => {
                    const isSelected = value === option.value;
                    return (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: isSelected
                                        ? '#8B5CF6'
                                        : isDarkMode ? '#1E293B' : '#F1F5F9',
                                    borderColor: isSelected
                                        ? '#8B5CF6'
                                        : isDarkMode ? '#334155' : '#E2E8F0',
                                },
                            ]}
                            onPress={() => onSelect(option.value)}
                            activeOpacity={0.7}
                        >
                            {option.icon && (
                                <Ionicons
                                    name={option.icon}
                                    size={20}
                                    color={isSelected ? '#FFFFFF' : isDarkMode ? '#94A3B8' : '#64748B'}
                                />
                            )}
                            <Text style={[
                                styles.buttonText,
                                {
                                    color: isSelected
                                        ? '#FFFFFF'
                                        : isDarkMode ? '#94A3B8' : '#64748B',
                                    fontWeight: isSelected ? '600' : '500',
                                },
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    helperText: {
        fontSize: 12,
        marginBottom: 8,
    },
    buttonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
        gap: 6,
    },
    buttonText: {
        fontSize: 14,
    },
});

