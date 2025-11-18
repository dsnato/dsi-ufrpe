import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface FeatureInputCardProps {
    label: string;
    description: string;
    value: string | number;
    onChangeValue: (value: string | number) => void;
    type: 'text' | 'number' | 'select';
    options?: string[];
    iconName?: keyof typeof Ionicons.glyphMap;
}

export const FeatureInputCard: React.FC<FeatureInputCardProps> = ({
    label,
    description,
    value,
    onChangeValue,
    type,
    options = [],
    iconName = 'information-circle-outline',
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Ionicons name={iconName} size={20} color="#0162B3" />
                <Text style={styles.label}>{label}</Text>
            </View>
            
            <Text style={styles.description}>{description}</Text>

            {type === 'select' ? (
                <View style={styles.selectContainer}>
                    <Text style={styles.selectLabel}>Opções disponíveis:</Text>
                    {options.map((option) => (
                        <Text key={option} style={styles.option}>• {option}</Text>
                    ))}
                    <Text style={styles.note}>
                        Use os campos de formulário acima para selecionar
                    </Text>
                </View>
            ) : (
                <TextInput
                    style={styles.input}
                    value={String(value)}
                    onChangeText={(text) => {
                        if (type === 'number') {
                            const num = parseFloat(text);
                            onChangeValue(isNaN(num) ? 0 : num);
                        } else {
                            onChangeValue(text);
                        }
                    }}
                    keyboardType={type === 'number' ? 'numeric' : 'default'}
                    placeholder={`Digite o ${label.toLowerCase()}`}
                    placeholderTextColor="#94A3B8"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#132F3B',
        marginLeft: 8,
    },
    description: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 12,
    },
    selectContainer: {
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    selectLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#132F3B',
        marginBottom: 8,
    },
    option: {
        fontSize: 14,
        color: '#64748B',
        marginLeft: 8,
        marginVertical: 2,
    },
    note: {
        fontSize: 12,
        color: '#94A3B8',
        fontStyle: 'italic',
        marginTop: 8,
    },
    input: {
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#132F3B',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
});
