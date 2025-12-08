import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
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

    const [isDarkMode, setIsDarkMode] = useState(false);
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
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const preferredTheme = user.user_metadata?.preferred_theme;
            setIsDarkMode(preferredTheme === 'dark');
        } catch (error) {
            console.error('Erro ao carregar preferência de tema:', error);
        }
    };

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
            console.log('  Iniciando geocodificação...');
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
    }; const handleSaveEdit = async () => {
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

    const palettes = useMemo(() => ({
        light: {
            background: '#132F3B',
            content: '#FFFFFF',
            text: '#132F3B',
            textSecondary: '#64748B',
            cardBg: '#FFFFFF',
            border: '#E2E8F0',
            iconPrimary: '#2176ff',
            buttonPrimary: '#2176ff',
            buttonText: '#FFFFFF',
            modalBg: '#FFFFFF',
            modalOverlay: 'rgba(0, 0, 0, 0.5)',
            inputBg: '#FFFFFF',
            inputBorder: '#E2E8F0',
            sectionBg: '#F8FAFC',
            helperBg: '#F1F5F9',
            breadcrumb: '#E0F2FE',
            accent: '#FFE157',
            backIcon: '#FFFFFF',
        },
        dark: {
            background: '#050C18',
            content: '#0B1624',
            text: '#F1F5F9',
            textSecondary: '#94A3B8',
            cardBg: 'rgba(26, 35, 50, 0.4)',
            border: 'rgba(45, 59, 79, 0.6)',
            iconPrimary: '#60A5FA',
            buttonPrimary: '#60A5FA',
            buttonText: '#0B1624',
            modalBg: '#0B1624',
            modalOverlay: 'rgba(0, 0, 0, 0.7)',
            inputBg: 'rgba(26, 35, 50, 0.4)',
            inputBorder: 'rgba(45, 59, 79, 0.6)',
            sectionBg: 'rgba(15, 23, 42, 0.5)',
            helperBg: 'rgba(26, 35, 50, 0.6)',
            breadcrumb: '#94A3B8',
            accent: '#FDE047',
            backIcon: '#E2E8F0',
        }
    }), []);

    const theme = useMemo(() => palettes[isDarkMode ? 'dark' : 'light'], [isDarkMode, palettes]);

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
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <InfoHeader
                entity="Localização"
                onBackPress={handleBackPress}
                colors={{
                    background: theme.background,
                    breadcrumb: theme.breadcrumb,
                    accent: theme.accent,
                    backIcon: theme.backIcon,
                }}
            />

            {/* Conteúdo com fundo branco e bordas arredondadas */}
            <View style={[styles.content, { backgroundColor: theme.content }]}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Map Card */}
                    <View style={[styles.mapCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
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
                    <View style={[styles.infoCard, { backgroundColor: theme.content }]}>
                        {/* Hotel Name */}
                        <View style={styles.infoHeader}>
                            <Ionicons name="business" size={24} color={theme.iconPrimary} />
                            <View style={styles.headerTextContainer}>
                                <Text style={[styles.hotelName, { color: theme.text }]}>{hotelInfo.nome}</Text>

                            </View>
                        </View>

                        <Separator />

                        {/* Address Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="location" size={20} color={theme.iconPrimary} />
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>Endereço</Text>
                            </View>
                            <Text style={[styles.addressText, { color: theme.textSecondary }]}>{hotelInfo.endereco}</Text>
                            <Text style={[styles.addressText, { color: theme.textSecondary }]}>
                                {hotelInfo.cidade} - {hotelInfo.estado}, {hotelInfo.cep}
                            </Text>
                        </View>

                        <Separator />

                        {/* Contact Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="call" size={20} color={theme.iconPrimary} />
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>Telefone</Text>
                            </View>
                            <Text style={[styles.contactText, { color: theme.iconPrimary }]}>{hotelInfo.telefone}</Text>
                        </View>

                        <Separator />

                        {/* Action Buttons */}
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.buttonPrimary }]} onPress={openInMaps}>
                                <Ionicons name="navigate" size={20} color={theme.buttonText} />
                                <Text style={[styles.actionText, { color: theme.buttonText }]}>Abrir no Mapa</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Botão de Edição para Admins */}
                        {isAdmin && (
                            <View style={styles.adminSection}>
                                <ActionButton
                                    variant="primary"
                                    icon="create-outline"
                                    onPress={handleEditPress}
                                    tone={isDarkMode ? 'dark' : 'light'}
                                >
                                    Editar Informações do Hotel
                                </ActionButton>
                            </View>
                        )}

                        {/* Info Footer */}
                        <View style={[styles.infoFooter, { backgroundColor: theme.sectionBg }]}>
                            <Ionicons name="information-circle" size={18} color={theme.textSecondary} />
                            <Text style={[styles.infoFooterText, { color: theme.textSecondary }]}>
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
                <View style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}>
                    <View style={[styles.modalContent, { backgroundColor: theme.modalBg }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Editar Informações do Hotel</Text>
                            <TouchableOpacity onPress={() => setShowEditModal(false)}>
                                <Ionicons name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalScroll}>
                            <View style={styles.formGroup}>
                                <Text style={[styles.label, { color: theme.text }]}>Nome do Hotel *</Text>
                                <TextInput
                                    style={[styles.input, {
                                        backgroundColor: theme.inputBg,
                                        borderColor: theme.inputBorder,
                                        color: theme.text
                                    }]}
                                    value={editData.nome}
                                    onChangeText={(text) => setEditData({ ...editData, nome: text })}
                                    placeholder="Nome do hotel"
                                    placeholderTextColor={theme.textSecondary}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={[styles.label, { color: theme.text }]}>Endereço *</Text>
                                <TextInput
                                    style={[styles.input, {
                                        backgroundColor: theme.inputBg,
                                        borderColor: theme.inputBorder,
                                        color: theme.text
                                    }]}
                                    value={editData.endereco}
                                    onChangeText={(text) => setEditData({ ...editData, endereco: text })}
                                    placeholder="Rua, número"
                                    placeholderTextColor={theme.textSecondary}
                                />
                            </View>

                            <View style={styles.formRow}>
                                <View style={[styles.formGroup, { flex: 2 }]}>
                                    <Text style={[styles.label, { color: theme.text }]}>Cidade</Text>
                                    <TextInput
                                        style={[styles.input, {
                                            backgroundColor: theme.inputBg,
                                            borderColor: theme.inputBorder,
                                            color: theme.text
                                        }]}
                                        value={editData.cidade}
                                        onChangeText={(text) => setEditData({ ...editData, cidade: text })}
                                        placeholder="Cidade"
                                        placeholderTextColor={theme.textSecondary}
                                    />
                                </View>

                                <View style={[styles.formGroup, { flex: 1 }]}>
                                    <Text style={[styles.label, { color: theme.text }]}>Estado</Text>
                                    <TextInput
                                        style={[styles.input, {
                                            backgroundColor: theme.inputBg,
                                            borderColor: theme.inputBorder,
                                            color: theme.text
                                        }]}
                                        value={editData.estado}
                                        onChangeText={(text) => setEditData({ ...editData, estado: text })}
                                        placeholder="UF"
                                        placeholderTextColor={theme.textSecondary}
                                        maxLength={2}
                                    />
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={[styles.label, { color: theme.text }]}>CEP</Text>
                                <TextInput
                                    style={[styles.input, {
                                        backgroundColor: theme.inputBg,
                                        borderColor: theme.inputBorder,
                                        color: theme.text
                                    }]}
                                    value={editData.cep}
                                    onChangeText={(text) => setEditData({ ...editData, cep: text })}
                                    placeholder="00000-000"
                                    placeholderTextColor={theme.textSecondary}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={[styles.label, { color: theme.text }]}>Telefone</Text>
                                <TextInput
                                    style={[styles.input, {
                                        backgroundColor: theme.inputBg,
                                        borderColor: theme.inputBorder,
                                        color: theme.text
                                    }]}
                                    value={editData.telefone}
                                    onChangeText={(text) => setEditData({ ...editData, telefone: text })}
                                    placeholder="(00) 0000-0000"
                                    placeholderTextColor={theme.textSecondary}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={[styles.helperText, { backgroundColor: theme.helperBg }]}>
                                <Ionicons name="information-circle" size={16} color={theme.iconPrimary} />
                                <Text style={[styles.helperTextContent, { color: theme.textSecondary }]}>
                                    As coordenadas para o mapa serão obtidas automaticamente a partir do endereço informado.
                                </Text>
                            </View>
                        </ScrollView>

                        <View style={[styles.modalButtons, { borderTopColor: theme.border }]}>
                            <ActionButton
                                variant="secondary"
                                onPress={() => setShowEditModal(false)}
                                disabled={saving}
                                style={{ flex: 1 }}
                                tone={isDarkMode ? 'dark' : 'light'}
                            >
                                Cancelar
                            </ActionButton>
                            <ActionButton
                                variant="primary"
                                icon="checkmark-circle-outline"
                                onPress={handleSaveEdit}
                                disabled={saving}
                                style={{ flex: 1 }}
                                tone={isDarkMode ? 'dark' : 'light'}
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
    },
    content: {
        flex: 1,
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
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
    },
    mapContainer: {
        height: 300,
        width: '100%',
    },
    infoCard: {
        padding: 20,
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
    },
    addressText: {
        fontSize: 15,
        lineHeight: 22,
        marginLeft: 28,
    },
    contactText: {
        fontSize: 16,
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
        paddingVertical: 14,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    actionButtonSecondary: {
        borderWidth: 2,
    },
    actionText: {
        fontSize: 15,
        fontWeight: '600',
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
        borderRadius: 8,
        marginTop: 8,
    },
    infoFooterText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    adminSection: {
        marginTop: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
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
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
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
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    helperText: {
        flexDirection: 'row',
        gap: 8,
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    helperTextContent: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingTop: 16,
        borderTopWidth: 1,
    },
});

