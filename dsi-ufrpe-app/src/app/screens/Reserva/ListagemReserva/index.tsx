import { ActionButton } from '@/src/components/ActionButton';
import { Separator } from '@/src/components/Separator';
import TextInputRounded from '@/src/components/TextInputRounded';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { listarReservas, Reserva } from '@/src/services/reservasService';
import { useToast } from '@/src/components/ToastContext';

const ListagemReserva: React.FC = () => {
    const router = useRouter();
    const { showError } = useToast();
    const [items, setItems] = useState<Reserva[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    // Filtra reservas por status ou datas
    const filteredItems = items.filter(
        (i) =>
            i.status?.toLowerCase().includes(search.toLowerCase()) ||
            i.data_checkin?.includes(search) ||
            i.data_checkout?.includes(search)
    );

    // Carrega a lista de reservas
    const loadReservas = useCallback(async () => {
        try {
            setLoading(true);
            const data = await listarReservas();
            setItems(data);
        } catch (error) {
            console.error('Erro ao carregar reservas:', error);
            showError('Erro ao carregar reservas');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadReservas();
        }, [loadReservas])
    );

    // Navega para tela de informações da reserva
    const handleReservaPress = (id: string) => {
        router.push({
            pathname: '/screens/Reserva/InfoReserva',
            params: { id },
        });
    };

    // Navega para tela de criação de reserva
    const handleAddReserva = () => {
        router.push('/screens/Reserva/CriacaoReserva');
    };

    // Renderiza cada card de reserva
    const renderReservaCard = ({ item }: { item: Reserva }) => (
        <TouchableOpacity
            style={styles.reservaCard}
            onPress={() => handleReservaPress(item.id!)}
            activeOpacity={0.7}
            onPress={() => handleReservaPress(item.id)}
            activeOpacity={0.7}
        >
            <View style={styles.cardIcon}>
                <Ionicons name="bed" size={32} color="#0162B3" />
            </View>
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardLabel}>Reserva #{item.id?.substring(0, 8)}</Text>
                    {item.status && <Text style={styles.cardStatus}>{item.status}</Text>}
                </View>
                <View style={styles.cardFooter}>
                    <Ionicons name="calendar-outline" size={14} color="#64748B" />
                    <Text style={styles.cardDate} numberOfLines={1}>
                        {item.data_checkin} - {item.data_checkout}
                    </Text>
                </View>
                {item.valor_total && (
                    <Text style={styles.cardValor}>R$ {item.valor_total.toFixed(2)}</Text>
                )}
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
                <Text style={styles.headerTitle}>Reservas</Text>
            </View>

            <View style={styles.content}>
                {/* Header com título e botão */}
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Ionicons name="calendar" size={24} color="#0162B3" />
                        <Text style={styles.title}>Lista de Reservas</Text>
                    </View>
                    <Text style={styles.subtitle}>
                        {filteredItems.length}{' '}
                        {filteredItems.length === 1 ? 'reserva encontrada' : 'reservas encontradas'}
                    </Text>
                </View>

                <Separator marginTop={16} marginBottom={20} />

                {/* Botão de adicionar */}
                <View style={styles.actionContainer}>
                    <ActionButton
                        variant="primary"
                        icon="add-circle-outline"
                        onPress={handleAddReserva}
                    >
                        Adicionar Nova Reserva
                    </ActionButton>
                </View>

                {/* Campo de busca */}
                <View style={styles.searchContainer}>
                    <TextInputRounded
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Buscar por quarto ou data..."
                    />
                </View>

                {/* Lista de reservas */}
                {filteredItems.length > 0 ? (
                    <FlatList
                        data={filteredItems}
                        keyExtractor={(item) => item.id}
                        renderItem={renderReservaCard}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={64} color="#CBD5E1" />
                        <Text style={styles.emptyTitle}>Nenhuma reserva encontrada</Text>
                        <Text style={styles.emptySubtitle}>
                            {search
                                ? 'Tente buscar com outros termos'
                                : 'Adicione uma nova reserva para começar'}
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default ListagemReserva;

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
    reservaCard: {
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
    cardIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    cardContent: {
        gap: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    cardLabel: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    cardNumber: {
        fontSize: 20,
        fontWeight: '700',
        color: '#132F3B',
        fontFamily: 'monospace',
    },
    cardStatus: {
        fontSize: 12,
        fontWeight: '600',
        color: '#0162B3',
        textTransform: 'capitalize',
    },
    cardValor: {
        fontSize: 16,
        fontWeight: '700',
        color: '#10B981',
        marginTop: 4,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    cardDate: {
        fontSize: 12,
        color: '#64748B',
        textAlign: 'center',
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
