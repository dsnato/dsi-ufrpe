import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type InfoHeaderColors = {
    background?: string;
    breadcrumb?: string;
    accent?: string;
    backIcon?: string;
};

type InfoHeaderProps = {
    entity: string; // "Quartos", "Clientes", "Funcionários", etc
    onBackPress: () => void;
    action?: string; // "Detalhes", "Adição", "Edição"
    colors?: InfoHeaderColors;
};

const DEFAULT_COLORS: Required<InfoHeaderColors> = {
    background: '#132F3B',
    breadcrumb: '#E0F2FE',
    accent: '#FFE157',
    backIcon: '#FFFFFF',
};

export function InfoHeader({ entity, onBackPress, action = 'Detalhes', colors }: InfoHeaderProps) {
    const palette = { ...DEFAULT_COLORS, ...colors };
    
    return (
        <View style={[styles.header, { backgroundColor: palette.background }]}>
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color={palette.backIcon}/>
            </TouchableOpacity>
            <View style={styles.breadcrumb}>
                <Text style={[styles.breadcrumbText, { color: palette.breadcrumb }]}>{entity}</Text>
                <Ionicons name="chevron-forward" size={16} color={palette.breadcrumb} />
                <Text style={[styles.breadcrumbTextActive, { color: palette.accent }]}>{action}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
    backButton: {
        marginRight: 16,
    },
    breadcrumb: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    breadcrumbText: {
        fontSize: 14,
        opacity: 0.7,
    },
    breadcrumbTextActive: {
        fontSize: 14,
        fontWeight: '600',
    },
});
