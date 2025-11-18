import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ButtonSelectorProps {
    label: string;
    options: Array<{ label: string; value: string; icon?: keyof typeof Ionicons.glyphMap }>;
    value: string;
    onSelect: (value: string) => void;
    helperText?: string;
}

export const ButtonSelector: React.FC<ButtonSelectorProps> = ({
    label,
    options,
    value,
    onSelect,
    helperText,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            {helperText && <Text style={styles.helperText}>{helperText}</Text>}
            <View style={styles.buttonsContainer}>
                {options.map((option) => {
                    const isSelected = value === option.value;
                    return (
                        <TouchableOpacity
                            key={option.value}
                            style={[styles.button, isSelected && styles.buttonSelected]}
                            onPress={() => onSelect(option.value)}
                            activeOpacity={0.7}
                        >
                            {option.icon && (
                                <Ionicons
                                    name={option.icon}
                                    size={20}
                                    color={isSelected ? '#FFFFFF' : '#64748B'}
                                />
                            )}
                            <Text style={[styles.buttonText, isSelected && styles.buttonTextSelected]}>
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
        color: '#132F3B',
        marginBottom: 4,
    },
    helperText: {
        fontSize: 12,
        color: '#64748B',
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
        backgroundColor: '#F1F5F9',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        gap: 6,
    },
    buttonSelected: {
        backgroundColor: '#8B5CF6',
        borderColor: '#8B5CF6',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748B',
    },
    buttonTextSelected: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
