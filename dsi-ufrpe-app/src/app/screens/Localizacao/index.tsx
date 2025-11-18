import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ActionButton } from '../../../components/ActionButton';
import { InfoHeader } from '../../../components/InfoHeader';
import { MapEmbed } from '../../../components/MapEmbed';
import { Separator } from '../../../components/Separator';
import { useToast } from '../../../components/ToastContext';

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
    const { showSuccess, showError } = useToast();

    const [hotelInfo, setHotelInfo] = useState<HotelInfo>({
        nome: 'Hostify Hotel & Resort',
        endereco: 'Av. Boa Viagem, 5000',
        cidade: 'Recife',
        estado: 'PE',
        cep: '51030-000',
        telefone: '(81) 3333-4444',
        latitude: -8.1177,
        longitude: -34.8964,
    });

    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState<HotelInfo>(hotelInfo);
    const [saving, setSaving] = useState(false);

    // Verifica se o usuário é admin e carrega dados do hotel
    useEffect(() => {
        loadHotelData();
        checkUserRole();
    }, []);

    const checkUserRole = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role === 'admin') {
                setIsAdmin(true);
            }
        } catch (error) {
            console.error('Erro ao verificar role:', error);
        }
    };

    const loadHotelData = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('hotel_config')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Erro ao carregar dados do hotel:', error);
                return;
            }

            if (data) {
                setHotelInfo({
                    nome: data.nome || hotelInfo.nome,
                    endereco: data.endereco || hotelInfo.endereco,
                    cidade: data.cidade || hotelInfo.cidade,
                    estado: data.estado || hotelInfo.estado,
                    cep: data.cep || hotelInfo.cep,
                    telefone: data.telefone || hotelInfo.telefone,
                    latitude: data.latitude || hotelInfo.latitude,
                    longitude: data.longitude || hotelInfo.longitude,
                });
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditPress = () => {
        setEditData({ ...hotelInfo });
        setShowEditModal(true);
    };

    const geocodeAddress = async (endereco: string, cidade: string, estado: string) => {
        try {
            const query = `${endereco}, ${cidade}, ${estado}, Brasil`;
            console.log('� Iniciando geocodificação...');
            console.log('📍 Endereço completo:', query);
            
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
            console.log('🌐 URL da API:', url);
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'DSI-UFRPE-App/1.0'
                }
            });
            
            console.log('📡 Status da resposta:', response.status);
            
            if (!response.ok) {
                console.error('❌ Erro na requisição:', response.status, response.statusText);
                return null;
            }
            
            const data = await response.json();
            console.log('📦 Dados recebidos:', JSON.stringify(data, null, 2));
            
            if (data && data.length > 0) {
                const coords = {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon)
                };
                console.log('✅ Coordenadas encontradas:', coords);
                console.log('📌 Nome do local:', data[0].display_name);
                return coords;
            }
            
            console.warn('⚠️ Nenhum resultado encontrado para o endereço');
            return null;
        } catch (error) {
            console.error('❌ Erro na geocodificação:', error);
            if (error instanceof Error) {
                console.error('📄 Mensagem do erro:', error.message);
                console.error('📚 Stack trace:', error.stack);
            }
            return null;
        }
    };    const handleSaveEdit = async () => {
        try {
            setSaving(true);

            // Validações básicas
            if (!editData.nome.trim() || !editData.endereco.trim()) {
                showError('Nome e endereço são obrigatórios.');
                return;
            }

            if (!editData.cidade.trim() || !editData.estado.trim()) {
                showError('Cidade e estado são obrigatórios para localizar no mapa.');
                return;
            }

            // Buscar coordenadas automaticamente
            console.log('💾 Tentando salvar com dados:', editData);
            showSuccess('Buscando coordenadas do endereço...');
            const coords = await geocodeAddress(editData.endereco, editData.cidade, editData.estado);
            
            if (!coords) {
                console.error('🚫 Falha ao obter coordenadas');
                showError('Não foi possível encontrar este endereço. Tente usar um endereço mais completo (ex: Rua, Número, Bairro).');
                return;
            }
            
            console.log('🎯 Coordenadas obtidas com sucesso:', coords);

            // Atualiza os dados com as coordenadas encontradas
            const dataToSave = {
                ...editData,
                latitude: coords.latitude,
                longitude: coords.longitude
            };

            // Verifica se já existe configuração
            const { data: existing } = await supabase
                .from('hotel_config')
                .select('id')
                .single();

            let result;
            if (existing) {
                // Atualiza
                result = await supabase
                    .from('hotel_config')
                    .update({
                        nome: dataToSave.nome,
                        endereco: dataToSave.endereco,
                        cidade: dataToSave.cidade,
                        estado: dataToSave.estado,
                        cep: dataToSave.cep,
                        telefone: dataToSave.telefone,
                        latitude: dataToSave.latitude,
                        longitude: dataToSave.longitude,
                    })
                    .eq('id', existing.id);
            } else {
                // Insere
                result = await supabase
                    .from('hotel_config')
                    .insert([{
                        nome: dataToSave.nome,
                        endereco: dataToSave.endereco,
                        cidade: dataToSave.cidade,
                        estado: dataToSave.estado,
                        cep: dataToSave.cep,
                        telefone: dataToSave.telefone,
                        latitude: dataToSave.latitude,
                        longitude: dataToSave.longitude,
                    }]);
            }

            if (result.error) {
                throw result.error;
            }

            setHotelInfo({ ...dataToSave });
            setShowEditModal(false);
            showSuccess('Informações do hotel atualizadas com sucesso!');
        } catch (error: any) {
            console.error('Erro ao salvar:', error);
            showError(`Erro ao salvar: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

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

                        {/* Botão de Edição para Admins */}
                        {isAdmin && (
                            <View style={styles.adminSection}>
                                <ActionButton
                                    variant="primary"
                                    icon="create-outline"
                                    onPress={handleEditPress}
                                >
                                    Editar Informações do Hotel
                                </ActionButton>
                            </View>
                        )}

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

            {/* Modal de Edição */}
            <Modal
                visible={showEditModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowEditModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Editar Informações do Hotel</Text>
                            <TouchableOpacity onPress={() => setShowEditModal(false)}>
                                <Ionicons name="close" size={24} color="#132F3B" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalScroll}>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Nome do Hotel *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editData.nome}
                                    onChangeText={(text) => setEditData({ ...editData, nome: text })}
                                    placeholder="Nome do hotel"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Endereço *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editData.endereco}
                                    onChangeText={(text) => setEditData({ ...editData, endereco: text })}
                                    placeholder="Rua, número"
                                />
                            </View>

                            <View style={styles.formRow}>
                                <View style={[styles.formGroup, { flex: 2 }]}>
                                    <Text style={styles.label}>Cidade</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={editData.cidade}
                                        onChangeText={(text) => setEditData({ ...editData, cidade: text })}
                                        placeholder="Cidade"
                                    />
                                </View>

                                <View style={[styles.formGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Estado</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={editData.estado}
                                        onChangeText={(text) => setEditData({ ...editData, estado: text })}
                                        placeholder="UF"
                                        maxLength={2}
                                    />
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>CEP</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editData.cep}
                                    onChangeText={(text) => setEditData({ ...editData, cep: text })}
                                    placeholder="00000-000"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Telefone</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editData.telefone}
                                    onChangeText={(text) => setEditData({ ...editData, telefone: text })}
                                    placeholder="(00) 0000-0000"
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={styles.helperText}>
                                <Ionicons name="information-circle" size={16} color="#10B981" />
                                <Text style={styles.helperTextContent}>
                                    As coordenadas para o mapa serão obtidas automaticamente a partir do endereço informado.
                                </Text>
                            </View>
                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <ActionButton
                                variant="secondary"
                                onPress={() => setShowEditModal(false)}
                                disabled={saving}
                                style={{ flex: 1 }}
                            >
                                Cancelar
                            </ActionButton>
                            <ActionButton
                                variant="primary"
                                icon="checkmark-circle-outline"
                                onPress={handleSaveEdit}
                                disabled={saving}
                                style={{ flex: 1 }}
                            >
                                {saving ? 'Salvando...' : 'Salvar'}
                            </ActionButton>
                        </View>
                    </View>
                </View>
            </Modal>
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
    adminSection: {
        marginTop: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#132F3B',
    },
    modalScroll: {
        padding: 20,
    },
    formGroup: {
        marginBottom: 16,
    },
    formRow: {
        flexDirection: 'row',
        gap: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#132F3B',
        backgroundColor: '#FFFFFF',
    },
    helperText: {
        flexDirection: 'row',
        gap: 8,
        padding: 12,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        marginTop: 8,
    },
    helperTextContent: {
        flex: 1,
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
});
