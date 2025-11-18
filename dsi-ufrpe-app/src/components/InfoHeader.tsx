import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type InfoHeaderProps = {
    entity: string; // "Quartos", "Clientes", "Funcionários", etc
    onBackPress: () => void;
    action?: string; // "Detalhes", "Adição", "Edição"
};

export function InfoHeader({ entity, onBackPress, action = 'Detalhes' }: InfoHeaderProps) {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.breadcrumb}>
                <Text style={styles.breadcrumbText}>{entity}</Text>
                <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                <Text style={styles.breadcrumbTextActive}>{action}</Text>
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
        backgroundColor: '#132F3B',
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
        color: '#E0F2FE',
        opacity: 0.7,
    },
    breadcrumbTextActive: {
        fontSize: 14,
        color: '#FFE157',
        fontWeight: '600',
    },
});
