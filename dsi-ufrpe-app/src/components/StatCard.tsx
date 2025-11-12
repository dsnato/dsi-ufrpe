import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    value: string | number;
    label: string;
    trend?: 'up' | 'down';
    trendValue?: string;
}

/**
 * StatCard - Card de estatística compacto com ícone e valor
 * 
 * @example
 * ```tsx
 * <StatCard
 *   icon="calendar-outline"
 *   value={15}
 *   label="Hoje"
 *   trend="up"
 *   trendValue="+3"
 * />
 * ```
 */
export const StatCard: React.FC<StatCardProps> = ({
    icon,
    value,
    label,
    trend,
    trendValue,
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={24} color="#0162B3" />
            </View>

            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>

            {trend && trendValue && (
                <View style={styles.trendContainer}>
                    <Ionicons
                        name={trend === 'up' ? 'trending-up' : 'trending-down'}
                        size={14}
                        color={trend === 'up' ? '#10B981' : '#EF4444'}
                    />
                    <Text style={[styles.trendText, { color: trend === 'up' ? '#10B981' : '#EF4444' }]}>
                        {trendValue}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        flex: 1,
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    value: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        color: '#64748B',
        textAlign: 'center',
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 4,
    },
    trendText: {
        fontSize: 12,
        fontWeight: '600',
    },
});
