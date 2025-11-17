import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { InfoHeader } from '../../../components/InfoHeader';
import { MapEmbed } from '../../../components/MapEmbed';
import { Separator } from '../../../components/Separator';

interface HotelInfo {
    nome: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    telefone: string;
    latitude: number;
    longitude: number;
}

export default function LocalizacaoScreen() {
    const router = useRouter();

    // Dados fictícios do hotel (futuramente virão do banco/context)
    const [hotelInfo] = useState<HotelInfo>({
        nome: 'Hostify Hotel & Resort',
        endereco: 'Av. Boa Viagem, 5000',
        cidade: 'Recife',
        estado: 'PE',
        cep: '51030-000',
        telefone: '(81) 3333-4444',
        latitude: -8.1177,
        longitude: -34.8964,
    });

    const handleBackPress = () => {
        router.push('/screens/home' as any);
    };

    const openInMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${hotelInfo.latitude},${hotelInfo.longitude}`;
        Linking.openURL(url).catch(() => {
            Alert.alert('Erro', 'Não foi possível abrir o mapa');
        });
    };

    const callHotel = () => {
        const phoneNumber = hotelInfo.telefone.replace(/\D/g, '');
        Linking.openURL(`tel:${phoneNumber}`).catch(() => {
            Alert.alert('Erro', 'Não foi possível fazer a ligação');
        });
    };

    return (
        <View style={styles.container}>
            <InfoHeader entity="Localização" onBackPress={handleBackPress} />

            {/* Conteúdo com fundo branco e bordas arredondadas */}
            <View style={styles.content}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Map Card */}
                    <View style={styles.mapCard}>
                        <View style={styles.mapContainer}>
                            <MapEmbed
                                latitude={hotelInfo.latitude}
                                longitude={hotelInfo.longitude}
                                hotelName={hotelInfo.nome}
                                address={hotelInfo.endereco}
                                city={hotelInfo.cidade}
                                state={hotelInfo.estado}
                            />
                        </View>
                    </View>

                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        {/* Hotel Name */}
                        <View style={styles.infoHeader}>
                            <Ionicons name="business" size={24} color="#2176ff" />
                            <View style={styles.headerTextContainer}>
                                <Text style={styles.hotelName}>{hotelInfo.nome}</Text>

                            </View>
                        </View>

                        <Separator />

                        {/* Address Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="location" size={20} color="#2176ff" />
                                <Text style={styles.sectionTitle}>Endereço</Text>
                            </View>
                            <Text style={styles.addressText}>{hotelInfo.endereco}</Text>
                            <Text style={styles.addressText}>
                                {hotelInfo.cidade} - {hotelInfo.estado}, {hotelInfo.cep}
                            </Text>
                        </View>

                        <Separator />

                        {/* Contact Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="call" size={20} color="#2176ff" />
                                <Text style={styles.sectionTitle}>Telefone</Text>
                            </View>
                            <Text style={styles.contactText}>{hotelInfo.telefone}</Text>
                        </View>

                        <Separator />

                        {/* Action Buttons */}
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity style={styles.actionButton} onPress={openInMaps}>
                                <Ionicons name="navigate" size={20} color="#FFFFFF" />
                                <Text style={styles.actionText}>Abrir no Mapa</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Info Footer */}
                        <View style={styles.infoFooter}>
                            <Ionicons name="information-circle" size={18} color="#666" />
                            <Text style={styles.infoFooterText}>
                                Toque no marcador do mapa para mais informações
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#132F3B',
    },
    content: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 20,
        paddingTop: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    mapCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    mapContainer: {
        height: 300,
        width: '100%',
    },
    infoCard: {
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    headerTextContainer: {
        flex: 1,
    },
    hotelName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#132F3B',
        marginBottom: 4,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22C55E',
    },
    statusText: {
        fontSize: 13,
        color: '#22C55E',
        fontWeight: '500',
    },
    section: {
        marginVertical: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#132F3B',
    },
    addressText: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
        marginLeft: 28,
    },
    contactText: {
        fontSize: 16,
        color: '#2176ff',
        fontWeight: '600',
        marginLeft: 28,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginVertical: 16,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2176ff',
        paddingVertical: 14,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    actionButtonSecondary: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#2176ff',
    },
    actionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    actionTextSecondary: {
        color: '#2176ff',
    },
    infoFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        marginTop: 8,
    },
    infoFooterText: {
        flex: 1,
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
});
