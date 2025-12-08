import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type StatusBadgeProps = {
    text: string;
    color: string;
};

export function StatusBadge({ text, color }: StatusBadgeProps) {
    return (
        <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginLeft: 12,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
});
