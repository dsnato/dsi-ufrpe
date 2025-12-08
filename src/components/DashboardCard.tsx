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
    backgroundColor?: string;
    iconBackground?: string;
    countColor?: string;
    titleColor?: string;
    subtitleColor?: string;
    chevronColor?: string;
}

const hexToRgba = (hexColor: string, alpha = 0.15) => {
    const hex = hexColor.replace('#', '');

    if (hex.length !== 6) {
        return hexColor;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * DashboardCard - Card moderno para dashboard com ícone, contador e navegação
 */
export const DashboardCard: React.FC<DashboardCardProps> = ({
    icon,
    title,
    count,
    subtitle,
    color,
    onPress,
    backgroundColor,
    iconBackground,
    countColor,
    titleColor,
    subtitleColor,
    chevronColor,
}) => {
    const resolvedIconBackground = iconBackground || hexToRgba(color, 0.15);

    return (
        <TouchableOpacity
            style={[
                styles.card,
                { borderLeftColor: color },
                backgroundColor && { backgroundColor },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: resolvedIconBackground }]}>
                <Ionicons name={icon} size={28} color={color} />
            </View>

            <View style={styles.content}>
                {count !== undefined && (
                    <Text style={[styles.count, countColor && { color: countColor }]}>{count}</Text>
                )}
                <Text style={[styles.title, titleColor && { color: titleColor }]}>{title}</Text>
                {subtitle && (
                    <Text style={[styles.subtitle, subtitleColor && { color: subtitleColor }]}>
                        {subtitle}
                    </Text>
                )}
            </View>

            <Ionicons name="chevron-forward" size={20} color={chevronColor || '#94A3B8'} />
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

