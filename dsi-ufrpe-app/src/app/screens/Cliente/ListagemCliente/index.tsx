import { ActionButton } from '@/src/components/ActionButton';
import { Separator } from '@/src/components/Separator';
import TextInputRounded from '@/src/components/TextInputRounded';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { listarClientes, Cliente } from '@/src/services/clientesService';
import { useToast } from '@/src/components/ToastContext';
import { formatCPF } from '@/src/utils/formatters';

type Client = Cliente;

const ListagemCliente: React.FC = () => {
    const router = useRouter();
    const { showError } = useToast();
    const [items, setItems] = useState<Cliente[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    // Filtra clientes por nome ou CPF
    const filteredItems = items.filter(
        (i) =>
            i.nome_completo?.toLowerCase().includes(search.toLowerCase()) ||
            i.cpf?.includes(search) ||
            i.email?.toLowerCase().includes(search.toLowerCase())
    );

    // Carrega a lista de clientes
    const loadClientes = useCallback(async () => {
        try {
            setLoading(true);
            const data = await listarClientes();
            setItems(data);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            showError('Erro ao carregar clientes');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadClientes();
        }, [loadClientes])
    );

    // Navega para tela de informações do cliente
    const handleClientePress = (id: string) => {
        router.push({
            pathname: '/screens/Cliente/InfoCliente',
            params: { id },
        });
    };

    // Navega para tela de criação de cliente
    const handleAddCliente = () => {
        router.push('/screens/Cliente/CriacaoCliente');
    };

    // Renderiza cada card de cliente
    const renderClienteCard = ({ item }: { item: Client }) => (
        <TouchableOpacity
            style={styles.clienteCard}
            onPress={() => handleClientePress(item.id!)}
            activeOpacity={0.7}
        >
            {/* Imagem do cliente ou padrão */}
            <View style={styles.cardImageContainer}>
                {item.imagem_url ? (
                    <Image
                        source={{ uri: item.imagem_url }}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.cardIcon}>
                        <Ionicons name="person" size={32} color="#0162B3" />
                    </View>
                )}
            </View>
            
            {/* Conteúdo do card */}
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.nome_completo}
                </Text>
                <Text style={styles.cardSubtitle}>{formatCPF(item.cpf)}</Text>
                <View style={styles.cardFooter}>
                    <Ionicons name="location-outline" size={14} color="#64748B" />
                    <Text style={styles.cardLocation} numberOfLines={1}>
                        {item.cidade}/{item.estado}
                    </Text>
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
                <Text style={styles.headerTitle}>Clientes</Text>
            </View>

            <View style={styles.content}>
                {/* Header com título e botão */}
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Ionicons name="people" size={24} color="#0162B3" />
                        <Text style={styles.title}>Lista de Clientes</Text>
                    </View>
                    <Text style={styles.subtitle}>
                        {filteredItems.length}{' '}
                        {filteredItems.length === 1 ? 'cliente encontrado' : 'clientes encontrados'}
                    </Text>
                </View>

                <Separator marginTop={16} marginBottom={20} />

                {/* Botão de adicionar */}
                <View style={styles.actionContainer}>
                    <ActionButton
                        variant="primary"
                        icon="add-circle-outline"
                        onPress={handleAddCliente}
                    >
                        Adicionar Novo Cliente
                    </ActionButton>
                </View>

                {/* Campo de busca */}
                <View style={styles.searchContainer}>
                    <TextInputRounded
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Buscar por nome ou CPF..."
                    />
                </View>

                {/* Lista de clientes */}
                {filteredItems.length > 0 ? (
                    <FlatList
                        data={filteredItems}
                        keyExtractor={(item) => item.id}
                        renderItem={renderClienteCard}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={64} color="#CBD5E1" />
                        <Text style={styles.emptyTitle}>Nenhum cliente encontrado</Text>
                        <Text style={styles.emptySubtitle}>
                            {search
                                ? 'Tente buscar com outros termos'
                                : 'Adicione um novo cliente para começar'}
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default ListagemCliente;

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
    clienteCard: {
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
    cardImageContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        gap: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#132F3B',
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#64748B',
        textAlign: 'center',
        fontFamily: 'monospace',
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginTop: 4,
    },
    cardLocation: {
        fontSize: 12,
        color: '#64748B',
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