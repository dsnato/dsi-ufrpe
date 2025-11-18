import { ActionButton } from '@/src/components/ActionButton';
import { Separator } from '@/src/components/Separator';
import TextInputRounded from '@/src/components/TextInputRounded';
import { useToast } from '@/src/components/ToastContext';
import { Funcionario, listarFuncionarios } from '@/src/services/funcionariosService';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListagemFuncionario: React.FC = () => {
    const router = useRouter();
    const { showError } = useToast();
    const [items, setItems] = useState<Funcionario[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    // Filtra funcionários por nome ou CPF
    const filteredItems = items.filter(
        (i) =>
            i.nome_completo?.toLowerCase().includes(search.toLowerCase()) ||
            i.cpf?.includes(search) ||
            i.cargo?.toLowerCase().includes(search.toLowerCase())
    );

    // Carrega a lista de funcionários
    const loadFuncionarios = useCallback(async () => {
        try {
            setLoading(true);
            const data = await listarFuncionarios();
            setItems(data);
        } catch (error) {
            console.error('Erro ao carregar funcionários:', error);
            showError('Erro ao carregar funcionários');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadFuncionarios();
        }, [loadFuncionarios])
    );

    // Navega para tela de informações do funcionário
    const handleFuncionarioPress = (id: string) => {
        router.push({
            pathname: '/screens/Funcionario/InfoFuncionario',
            params: { id },
        });
    };

    // Navega para tela de criação de funcionário
    const handleAddFuncionario = () => {
        router.push('/screens/Funcionario/CriacaoFuncionario');
    };

    // Renderiza cada card de funcionário
    const renderFuncionarioCard = ({ item }: { item: Funcionario }) => (
        <TouchableOpacity
            style={styles.funcionarioCard}
            onPress={() => handleFuncionarioPress(item.id || '')}
            activeOpacity={0.7}
        >
            <View style={styles.cardIcon}>
                <Ionicons name="person" size={32} color="#0162B3" />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.nome_completo}
                </Text>
                <View style={styles.cardFooter}>
                    <Ionicons name="card-outline" size={14} color="#64748B" />
                    <Text style={styles.cardCpf}>{item.cpf}</Text>
                </View>
                {item.cargo && (
                    <Text style={styles.cardCargo}>{item.cargo}</Text>
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
                <Text style={styles.headerTitle}>Funcionários</Text>
            </View>

            <View style={styles.content}>
                {/* Header com título e botão */}
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Ionicons name="people" size={24} color="#0162B3" />
                        <Text style={styles.title}>Lista de Funcionários</Text>
                    </View>
                    <Text style={styles.subtitle}>
                        {filteredItems.length}{' '}
                        {filteredItems.length === 1 ? 'funcionário encontrado' : 'funcionários encontrados'}
                    </Text>
                </View>

                <Separator marginTop={16} marginBottom={20} />

                {/* Botão de adicionar */}
                <View style={styles.actionContainer}>
                    <ActionButton
                        variant="primary"
                        icon="add-circle-outline"
                        onPress={handleAddFuncionario}
                    >
                        Adicionar Novo Funcionário
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

                {/* Lista de funcionários */}
                {filteredItems.length > 0 ? (
                    <FlatList
                        data={filteredItems}
                        keyExtractor={(item) => item.id || ''}
                        renderItem={renderFuncionarioCard}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={64} color="#CBD5E1" />
                        <Text style={styles.emptyTitle}>Nenhum funcionário encontrado</Text>
                        <Text style={styles.emptySubtitle}>
                            {search
                                ? 'Tente buscar com outros termos'
                                : 'Adicione um novo funcionário para começar'}
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default ListagemFuncionario;

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
    funcionarioCard: {
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
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#132F3B',
        textAlign: 'center',
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    cardCpf: {
        fontSize: 13,
        color: '#64748B',
        fontFamily: 'monospace',
    },
    cardCargo: {
        fontSize: 12,
        color: '#0162B3',
        fontWeight: '500',
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