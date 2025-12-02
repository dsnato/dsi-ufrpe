import { supabase } from '@/lib/supabase';
import { ActionButton } from '@/src/components/ActionButton';
import { Separator } from '@/src/components/Separator';
import TextInputRounded from '@/src/components/TextInputRounded';
import { useToast } from '@/src/components/ToastContext';
import { Funcionario, listarFuncionarios } from '@/src/services/funcionariosService';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListagemFuncionario: React.FC = () => {
    const router = useRouter();
    const { showError } = useToast();
    const [items, setItems] = useState<Funcionario[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Paleta de cores
    const palettes = useMemo(() => ({
        light: {
            background: '#132F3B',
            content: '#F8FAFC',
            text: '#132F3B',
            textSecondary: '#64748B',
            icon: '#0162B3',
            cardBg: '#FFFFFF',
            cardBorder: '#E2E8F0',
            backIcon: '#FFFFFF',
            titleText: '#132F3B',
            emptyText: '#64748B',
        },
        dark: {
            background: '#050C18',
            content: '#0B1624',
            text: '#F1F5F9',
            textSecondary: '#94A3B8',
            icon: '#60A5FA',
            cardBg: 'rgba(26, 35, 50, 0.4)',
            cardBorder: 'rgba(45, 59, 79, 0.6)',
            backIcon: '#E2E8F0',
            titleText: '#F1F5F9',
            emptyText: '#94A3B8',
        }
    }), []);

    const theme = useMemo(() => palettes[isDarkMode ? 'dark' : 'light'], [isDarkMode, palettes]);

    // Carrega preferência de tema
    const loadThemePreference = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const preferredTheme = user.user_metadata?.preferred_theme;
            setIsDarkMode(preferredTheme === 'dark');
        } catch (error) {
            console.error('Erro ao carregar tema:', error);
        }
    }, []);

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
            loadThemePreference();
            loadFuncionarios();
        }, [loadThemePreference, loadFuncionarios])
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
            style={[styles.funcionarioCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
            onPress={() => handleFuncionarioPress(item.id || '')}
            activeOpacity={0.7}
        >
            <View style={styles.cardIcon}>
                <Ionicons name="person" size={32} color={theme.icon} />
            </View>
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
                    {item.nome_completo}
                </Text>
                <View style={styles.cardFooter}>
                    <Ionicons name="card-outline" size={14} color={theme.textSecondary} />
                    <Text style={[styles.cardCpf, { color: theme.textSecondary }]}>{item.cpf}</Text>
                </View>
                {item.cargo && (
                    <Text style={[styles.cardCargo, { color: theme.textSecondary }]}>{item.cargo}</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            {/* Header customizado para listagem */}
            <View style={[styles.topHeader, { backgroundColor: theme.background }]}>
                <TouchableOpacity onPress={() => router.push('/screens/home')} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={theme.backIcon} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.backIcon }]}>Funcionários</Text>
            </View>

            <View style={[styles.content, { backgroundColor: theme.content }]}>
                {/* Header com título e botão */}
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Ionicons name="people" size={24} color={theme.icon} />
                        <Text style={[styles.title, { color: theme.titleText }]}>Lista de Funcionários</Text>
                    </View>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
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
                        tone={isDarkMode ? 'dark' : 'light'}
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
                        isDarkMode={isDarkMode}
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
                        <Ionicons name="search-outline" size={64} color={theme.textSecondary} />
                        <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhum funcionário encontrado</Text>
                        <Text style={[styles.emptySubtitle, { color: theme.emptyText }]}>
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
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
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
        flex: 1,
    },
    content: {
        flex: 1,
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
    },
    subtitle: {
        fontSize: 14,
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
        borderRadius: 16,
        padding: 16,
        borderWidth: 1.5,
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
        fontFamily: 'monospace',
    },
    cardCargo: {
        fontSize: 12,
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
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});
