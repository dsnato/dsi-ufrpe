import { ActionButton } from '@/src/components/ActionButton';
import { Separator } from '@/src/components/Separator';
import TextInputRounded from '@/src/components/TextInputRounded';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { listarAtividades, AtividadeRecreativa } from '@/src/services/atividadesService';
import { useToast } from '@/src/components/ToastContext';

type Atividade = AtividadeRecreativa;

const ListagemAtividade: React.FC = () => {
    const router = useRouter();
    const { showError } = useToast();
    const [items, setItems] = useState<Atividade[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    // Filtra atividades por nome, local ou status
    const filteredItems = items.filter(
        (i) =>
            i.nome?.toLowerCase().includes(search.toLowerCase()) ||
            i.local?.toLowerCase().includes(search.toLowerCase()) ||
            i.descricao?.toLowerCase().includes(search.toLowerCase())
    );

    // Carrega a lista de atividades
    const loadAtividades = useCallback(async () => {
        try {
            setLoading(true);
            const data = await listarAtividades();
            setItems(data);
        } catch (error) {
            console.error('Erro ao carregar atividades:', error);
            showError('Erro ao carregar atividades');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadAtividades();
        }, [loadAtividades])
    );

    // Navega para tela de informações da atividade
    const handleAtividadePress = (id: string) => {
        router.push({
            pathname: '/screens/Atividade/InfoAtividade',
            params: { id },
        });
    };

    // Navega para tela de criação de atividade
    const handleAddAtividade = () => {
        router.push('/screens/Atividade/CriacaoAtividade');
    };

    // Renderiza cada card de atividade
    const renderAtividadeCard = ({ item }: { item: Atividade }) => (
        <TouchableOpacity
            style={styles.atividadeCard}
            onPress={() => handleAtividadePress(item.id!)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                    <Ionicons name="calendar" size={24} color="#0162B3" />
                </View>
                <View style={[styles.statusBadge, item.status === 'ativa' ? styles.statusActive : styles.statusInactive]}>
                    <Text style={styles.statusText}>{item.status || 'Inativa'}</Text>
                </View>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.nome}
                </Text>
                <View style={styles.cardInfo}>
                    <Ionicons name="location-outline" size={14} color="#64748B" />
                    <Text style={styles.cardLocation} numberOfLines={1}>
                        {item.local}
                    </Text>
                </View>
                <View style={styles.cardFooter}>
                    <View style={styles.cardInfoItem}>
                        <Ionicons name="calendar-outline" size={14} color="#64748B" />
                        <Text style={styles.cardInfoText}>
                            {item.data_hora ? new Date(item.data_hora).toLocaleString('pt-BR', { 
                                dateStyle: 'short', 
                                timeStyle: 'short' 
                            }) : 'Data não disponível'}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header customizado para listagem */}
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => router.push('/screens/home')} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Atividades</Text>
            </View>

            <View style={styles.content}>
                {/* Header com título e botão */}
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Ionicons name="calendar" size={24} color="#0162B3" />
                        <Text style={styles.title}>Lista de Atividades</Text>
                    </View>
                    <Text style={styles.subtitle}>
                        {filteredItems.length}{' '}
                        {filteredItems.length === 1 ? 'atividade encontrada' : 'atividades encontradas'}
                    </Text>
                </View>

                <Separator marginTop={16} marginBottom={20} />

                {/* Botão de adicionar */}
                <View style={styles.actionContainer}>
                    <ActionButton
                        variant="primary"
                        icon="add-circle-outline"
                        onPress={handleAddAtividade}
                    >
                        Adicionar Nova Atividade
                    </ActionButton>
                </View>

                {/* Campo de busca */}
                <View style={styles.searchContainer}>
                    <TextInputRounded
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Buscar por nome, local ou data..."
                    />
                </View>

                {/* Lista de atividades */}
                {filteredItems.length > 0 ? (
                    <FlatList
                        data={filteredItems}
                        keyExtractor={(item) => item.id}
                        renderItem={renderAtividadeCard}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={64} color="#CBD5E1" />
                        <Text style={styles.emptyTitle}>Nenhuma atividade encontrada</Text>
                        <Text style={styles.emptySubtitle}>
                            {search
                                ? 'Tente buscar com outros termos'
                                : 'Adicione uma nova atividade para começar'}
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default ListagemAtividade;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#132F3B',
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: '#132F3B',
        gap: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        flex: 1,
    },
    content: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        gap: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#132F3B',
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
    },
    actionContainer: {
        marginBottom: 16,
    },
    searchContainer: {
        marginBottom: 20,
    },
    listContent: {
        paddingBottom: 20,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    atividadeCard: {
        flex: 1,
        maxWidth: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        gap: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusActive: {
        backgroundColor: '#D1FAE5',
    },
    statusInactive: {
        backgroundColor: '#FEE2E2',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#132F3B',
    },
    cardContent: {
        gap: 8,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#132F3B',
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    cardLocation: {
        fontSize: 13,
        color: '#64748B',
        flex: 1,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    cardInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    cardInfoText: {
        fontSize: 12,
        color: '#64748B',
        fontFamily: 'monospace',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        gap: 12,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#475569',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});
