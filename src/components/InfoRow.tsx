import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type InfoRowProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    iconColor?: string;
    labelColor?: string;
    valueColor?: string;
};

export function InfoRow({
    icon,
    label,
    value,
    iconColor = '#0162B3',
    labelColor = '#64748B',
    valueColor = '#1E293B'
}: InfoRowProps) {
    return (
        <View style={styles.infoRow}>
            <Ionicons name={icon} size={20} color={iconColor} />
            <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: labelColor }]}>{label}</Text>
                <Text style={[styles.infoValue, { color: valueColor }]}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        paddingVertical: 8,
    },
    infoTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 24,
    },
});
