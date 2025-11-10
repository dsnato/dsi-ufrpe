import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type TitleSectionProps = {
    title: string;
    subtitle: string;
    badge?: React.ReactNode;
};

export function TitleSection({ title, subtitle, badge }: TitleSectionProps) {
    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
                <Text style={styles.title}>{title}</Text>
                {badge}
            </View>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <View style={styles.separator} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1E293B',
        flex: 1,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        textTransform: 'uppercase',
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#E2E8F0',
        marginTop: 20,
    },
});
