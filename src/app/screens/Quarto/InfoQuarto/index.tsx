import { supabase } from '@/lib/supabase';
import { ActionButton } from '@/src/components/ActionButton';
import { ErrorState } from '@/src/components/ErrorState';
import { InfoHeader } from '@/src/components/InfoHeader';
import { InfoRow } from '@/src/components/InfoRow';
import { Loading } from '@/src/components/Loading';
import { Separator } from '@/src/components/Separator';
import { StatusBadge } from '@/src/components/StatusBadge';
import { TitleSection } from '@/src/components/TitleSection';
import { useToast } from '@/src/components/ToastContext';
import { buscarQuartoPorId, excluirQuarto, Quarto } from '@/src/services/quartosService';
import { formatCurrency, withPlaceholder } from '@/src/utils/formatters';
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const palettes = {
    light: {
        background: '#132F3B',
        content: '#F8FAFC',
        card: '#FFFFFF',
        text: '#132F3B',
        textSecondary: '#64748B',
        muted: '#94A3B8',
        accent: '#0162B3',
        border: '#E2E8F0',
    },
    dark: {
        background: '#050C18',
        content: '#0B1624',
        card: '#152238',
        text: '#E2E8F0',
        textSecondary: '#CBD5E1',
        muted: '#94A3B8',
        accent: '#4F9CF9',
        border: '#1F2B3C',
    },
} as const;


const InfoQuarto: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();

    // Estados
    const [quarto, setQuarto] = useState<Quarto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const theme = useMemo(() => palettes[isDarkMode ? 'dark' : 'light'], [isDarkMode]);

    // Carrega a preferência de tema do Supabase
    const loadThemePreference = useCallback(async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.user_metadata?.preferred_theme) {
                setIsDarkMode(session.user.user_metadata.preferred_theme === 'dark');
            }
        } catch (error) {
            console.error('Erro ao carregar tema:', error);
        }
    }, []);

    // Carrega tema ao montar componente
    useEffect(() => {
        loadThemePreference();

        // Listener para mudanças no tema
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user?.user_metadata?.preferred_theme) {
                setIsDarkMode(session.user.user_metadata.preferred_theme === 'dark');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [loadThemePreference]);

    /**
     * ✅ REQUISITO 1: Carregamento dos dados usando ID da URL
     * ✅ REQUISITO 6: Atualização automática após retornar da edição (useFocusEffect)
     */
    const loadQuarto = useCallback(async () => {
        if (!id) {
            setError('ID do quarto não fornecido');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const data = await buscarQuartoPorId(id as string);

        if (!data) {
            setError('Quarto não encontrado');
            setLoading(false);
            return;
        }

        setQuarto(data);
        setLoading(false);
    }, [id]);

    // Recarrega os dados sempre que a tela receber foco
    useFocusEffect(
        useCallback(() => {
            loadThemePreference();
            loadQuarto();
        }, [loadThemePreference, loadQuarto])
    );

    /**
     * ✅ REQUISITO 5: Modal de confirmação antes de excluir
     */
    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            setShowDeleteConfirm(false);
            setLoading(true);

            await excluirQuarto(id as string);

            showSuccess('Quarto excluído com sucesso!');

            setTimeout(() => {
                router.push("/screens/Quarto/ListagemQuarto");
            }, 1500);
        } catch (error: any) {
            showError(`Erro ao excluir: ${error?.message || 'Erro desconhecido'}`);
            setLoading(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    /**
     * ✅ REQUISITO 2: Exibição de loading durante busca
     */
    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
                <InfoHeader
                    entity="Quartos"
                    onBackPress={() => router.back()}
                    colors={{
                        background: theme.background,
                        breadcrumb: theme.textSecondary,
                        accent: isDarkMode ? '#FACC15' : '#FFE157',
                        backIcon: '#FFFFFF'
                    }}
                />
                <View style={[styles.subContainer, { backgroundColor: theme.content }]}>
                    <Loading message="Carregando quarto..." isDarkMode={isDarkMode} />
                </View>
            </SafeAreaView>
        );
    }

    /**
     * ✅ REQUISITO 3: Mensagem de erro amigável se não encontrado
     */
    if (error || !quarto) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
                <InfoHeader
                    entity="Quartos"
                    onBackPress={() => router.back()}
                    colors={{
                        background: theme.background,
                        breadcrumb: theme.textSecondary,
                        accent: isDarkMode ? '#FACC15' : '#FFE157',
                        backIcon: '#FFFFFF'
                    }}
                />
                <View style={[styles.subContainer, { backgroundColor: theme.content }]}>
                    <ErrorState
                        message={error || 'Quarto não encontrado'}
                        onRetry={loadQuarto}
                        onGoBack={() => router.push("/screens/Quarto/ListagemQuarto")}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            {/* ✅ REQUISITO 9: Breadcrumb/indicador de navegação */}
            <InfoHeader
                entity="Quartos"
                onBackPress={() => router.back()}
                colors={{
                    background: theme.background,
                    breadcrumb: theme.textSecondary,
                    accent: isDarkMode ? '#FACC15' : '#FFE157',
                    backIcon: '#FFFFFF'
                }}
            />

            {/* Container branco com informações */}
            <View style={[styles.subContainer, { backgroundColor: theme.content }]}>
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Título do quarto com badge de disponibilidade */}
                    <TitleSection
                        title={`Quarto ${withPlaceholder(quarto.numero_quarto, 'S/N')}`}
                        subtitle="Número do quarto"
                        titleColor={theme.text}
                        subtitleColor={theme.textSecondary}
                        separatorColor={theme.border}
                        badge={
                            <StatusBadge
                                text={quarto.status === 'Disponivel' ? 'Disponível' : quarto.status === 'Ocupado' ? 'Ocupado' : 'Manutenção'}
                                color={quarto.status === 'Disponivel' ? '#10B981' : '#EF4444'}
                            />
                        }
                    />

                    {/* ✅ REQUISITO 7 e 8: Formatação e tratamento de valores vazios */}
                    <InfoRow
                        icon="bed-outline"
                        label="TIPO DE QUARTO"
                        value={withPlaceholder(quarto.tipo, 'Tipo não informado')}
                        iconColor={theme.accent}
                        labelColor={theme.textSecondary}
                        valueColor={theme.text}
                    />

                    <InfoRow
                        icon="people-outline"
                        label="CAPACIDADE DO QUARTO"
                        value={`${quarto.capacidade_pessoas || 0} ${quarto.capacidade_pessoas === 1 ? 'pessoa' : 'pessoas'}`}
                        iconColor={theme.accent}
                        labelColor={theme.textSecondary}
                        valueColor={theme.text}
                    />

                    <InfoRow
                        icon="cash-outline"
                        label="PREÇO DO QUARTO"
                        value={formatCurrency(quarto.preco_diario || 0)}
                        iconColor={theme.accent}
                        labelColor={theme.textSecondary}
                        valueColor={theme.text}
                    />

                    {quarto.descricao && (
                        <InfoRow
                            icon="document-text-outline"
                            label="DESCRIÇÃO"
                            value={withPlaceholder(quarto.descricao, 'Sem descrição')}
                            iconColor={theme.accent}
                            labelColor={theme.textSecondary}
                            valueColor={theme.text}
                        />
                    )}
                </ScrollView>

                {/* Linha divisória */}
                <Separator />

                {/* Botões de ação */}
                <View style={styles.options}>
                    {/* ✅ REQUISITO 4: Botão editar com ID correto */}
                    <ActionButton
                        variant="primary"
                        icon="create-outline"
                        onPress={() => router.push({
                            pathname: "/screens/Quarto/EdicaoQuarto",
                            params: { id: quarto.id }
                        })}
                        tone={isDarkMode ? 'dark' : 'light'}
                    >
                        Editar Quarto
                    </ActionButton>

                    {/* ✅ REQUISITO 5: Modal de confirmação implementado */}
                    <ActionButton
                        variant="danger"
                        icon="trash-outline"
                        onPress={handleDelete}
                        tone={isDarkMode ? 'dark' : 'light'}
                    >
                        Excluir
                    </ActionButton>
                </View>
            </View>

            {/* Modal de Confirmação de Exclusão */}
            {showDeleteConfirm && (
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Confirmar Exclusão</Text>
                        <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>
                            Tem certeza que deseja excluir este quarto? Esta ação não pode ser desfeita.
                        </Text>
                        <View style={styles.modalButtons}>
                            <ActionButton
                                variant="secondary"
                                onPress={cancelDelete}
                                style={styles.modalButton}
                                tone={isDarkMode ? 'dark' : 'light'}
                            >
                                Cancelar
                            </ActionButton>
                            <ActionButton
                                variant="danger"
                                onPress={confirmDelete}
                                style={styles.modalButton}
                                tone={isDarkMode ? 'dark' : 'light'}
                            >
                                Excluir
                            </ActionButton>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>)
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subContainer: {
        flex: 1,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginTop: 20,
    },
    scrollContent: {
        flexGrow: 0,
    },
    options: {
        width: '100%',
        gap: 12,
        paddingTop: 16,
        paddingBottom: 8,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        borderRadius: 12,
        padding: 24,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#DC2626',
        marginBottom: 12,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 24,
        lineHeight: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
    },
})


export default InfoQuarto;
