import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type TitleSectionProps = {
    title: string;
    subtitle: string;
    badge?: React.ReactNode;
    titleColor?: string;
    subtitleColor?: string;
    separatorColor?: string;
};

export function TitleSection({
    title,
    subtitle,
    badge,
    titleColor = '#1E293B',
    subtitleColor = '#64748B',
    separatorColor = '#E2E8F0'
}: TitleSectionProps) {
    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
                <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
                {badge}
            </View>
            <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
            <View style={[styles.separator, { backgroundColor: separatorColor }]} />
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
        flex: 1,
    },
    subtitle: {
        fontSize: 16,
        textTransform: 'uppercase',
    },
    separator: {
        width: '100%',
        height: 1,
        marginTop: 20,
    },
});
