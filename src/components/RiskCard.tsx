import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RiskCardProps {
    riskLevel: 'low_risk' | 'medium_risk' | 'high_risk';
    probability: number;
    confidence: number;
    color: string;
    icon: string;
    name: string;
    isDarkMode: boolean;
}

export const RiskCard: React.FC<RiskCardProps> = ({
    riskLevel,
    probability,
    confidence,
    color,
    icon,
    name,
    isDarkMode,
}) => {
    return (
        <View style={[
            styles.card,
            {
                borderLeftColor: color,
                backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
            }
        ]}>
            <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                <Text style={styles.icon}>{icon}</Text>
            </View>

            <View style={styles.content}>
                <Text style={[
                    styles.name,
                    { color: isDarkMode ? '#F1F5F9' : '#132F3B' }
                ]}>{name}</Text>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={[
                            styles.statLabel,
                            { color: isDarkMode ? '#94A3B8' : '#64748B' }
                        ]}>Probabilidade</Text>
                        <Text style={[styles.statValue, { color }]}>
                            {probability.toFixed(1)}%
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[
                            styles.statLabel,
                            { color: isDarkMode ? '#94A3B8' : '#64748B' }
                        ]}>Confiança</Text>
                        <Text style={[
                            styles.statValue,
                            { color: isDarkMode ? '#E2E8F0' : '#132F3B' }
                        ]}>
                            {confidence.toFixed(1)}%
                        </Text>
                    </View>
                </View>

                {/* Barra de probabilidade */}
                <View style={[
                    styles.progressBar,
                    { backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' }
                ]}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${probability}%`,
                                backgroundColor: color,
                            },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        borderLeftWidth: 4,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        fontSize: 32,
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
});

