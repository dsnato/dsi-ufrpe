import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DashboardCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    count?: number;
    subtitle?: string;
    color: string;
    onPress: () => void;
}

/**
 * DashboardCard - Card moderno para dashboard com ícone, contador e navegação
 * 
 * @example
 * ```tsx
 * <DashboardCard
 *   icon="calendar"
 *   title="Reservas"
 *   count={25}
 *   subtitle="5 confirmadas"
 *   color="#0162B3"
 *   onPress={() => navigate('/reservas')}
 * />
 * ```
 */
export const DashboardCard: React.FC<DashboardCardProps> = ({
    icon,
    title,
    count,
    subtitle,
    color,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={[styles.card, { borderLeftColor: color }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={28} color={color} />
            </View>

            <View style={styles.content}>
                {count !== undefined && <Text style={styles.count}>{count}</Text>}
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>

            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    count: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1E293B',
        lineHeight: 36,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 2,
    },
});
