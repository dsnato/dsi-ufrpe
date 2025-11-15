import { ActionButton } from '@/src/components/ActionButton';
import { ErrorState } from '@/src/components/ErrorState';
import { InfoHeader } from '@/src/components/InfoHeader';
import { InfoRow } from '@/src/components/InfoRow';
import { Loading } from '@/src/components/Loading';
import { Separator } from '@/src/components/Separator';
import { StatusBadge } from '@/src/components/StatusBadge';
import { TitleSection } from '@/src/components/TitleSection';
import { buscarAtividadePorId, excluirAtividade, AtividadeRecreativa } from '@/src/services/atividadesService';
import { formatDate, formatTime, withPlaceholder } from '@/src/utils/formatters';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const InfoAtividade: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    // Estados
    const [atividade, setAtividade] = useState<AtividadeRecreativa | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * ✅ REQUISITO 1: Carregamento dos dados usando ID da URL
     * ✅ REQUISITO 6: Atualização automática após retornar da edição (useFocusEffect)
     */
    const loadAtividade = useCallback(async () => {
        if (!id) {
            setError('ID da atividade não fornecido');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const data = await buscarAtividadePorId(id as string);

        if (!data) {
            setError('Atividade não encontrada');
            setLoading(false);
            return;
        }

        setAtividade(data);
        setLoading(false);
    }, [id]);

    // Recarrega os dados sempre que a tela receber foco
    useFocusEffect(
        useCallback(() => {
            loadAtividade();
        }, [loadAtividade])
    );

    /**
     * ✅ REQUISITO 5: Modal de confirmação antes de excluir
     */
    const handleDelete = () => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita.",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await excluirAtividade(id as string);
                            Alert.alert(
                                "Sucesso",
                                "Atividade excluída com sucesso!",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => router.push("/screens/Atividade/ListagemAtividade")
                                    }
                                ]
                            );
                        } catch (error) {
                            Alert.alert(
                                "Erro",
                                "Não foi possível excluir a atividade. Tente novamente."
                            );
                        }
                    }
                }
            ]
        );
    };

    /**
     * ✅ REQUISITO 2: Exibição de loading durante busca
     */
    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <InfoHeader entity="Atividades" onBackPress={() => router.back()} />
                <View style={styles.subContainer}>
                    <Loading message="Carregando atividade..." />
                </View>
            </SafeAreaView>
        );
    }

    /**
     * ✅ REQUISITO 3: Mensagem de erro amigável se não encontrada
     */
    if (error || !atividade) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <InfoHeader entity="Atividades" onBackPress={() => router.back()} />
                <View style={styles.subContainer}>
                    <ErrorState
                        message={error || 'Atividade não encontrada'}
                        onRetry={loadAtividade}
                        onGoBack={() => router.push("/screens/Atividade/ListagemAtividade")}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* ✅ REQUISITO 9: Breadcrumb/indicador de navegação */}
            <InfoHeader entity="Atividades" onBackPress={() => router.back()} />

            {/* Container branco com informações */}
            <View style={styles.subContainer}>
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Título da atividade com badge de status */}
                    <TitleSection
                        title={withPlaceholder(atividade.nome, 'Sem nome')}
                        subtitle="Atividade recreativa"
                        badge={
                            <StatusBadge
                                text={atividade.status || 'Ativo'}
                                color={atividade.status?.toLowerCase() === 'ativo' ? '#10B981' : '#6B7280'}
                            />
                        }
                    />

                    {/* ✅ REQUISITO 7 e 8: Informações formatadas com placeholders */}
                    <InfoRow
                        icon="document-text-outline"
                        label="DESCRIÇÃO"
                        value={withPlaceholder(atividade.descricao, 'Sem descrição')}
                    />

                    <InfoRow
                        icon="calendar-outline"
                        label="DATA E HORA"
                        value={atividade.data_hora ? formatDate(atividade.data_hora) : 'Não informado'}
                    />

                    <InfoRow
                        icon="location-outline"
                        label="LOCAL"
                        value={withPlaceholder(atividade.local, 'Local não informado')}
                    />
                    
                    <InfoRow
                        icon="people-outline"
                        label="CAPACIDADE MÁXIMA"
                        value={`${atividade.capacidade_maxima || 0} ${atividade.capacidade_maxima === 1 ? 'pessoa' : 'pessoas'}`}
                    />
                    
                    {atividade.preco !== undefined && (
                        <InfoRow
                            icon="cash-outline"
                            label="PREÇO"
                            value={`R$ ${atividade.preco.toFixed(2).replace('.', ',')}`}
                        />
                    )}
                </ScrollView>

                {/* Botões de ação */}
                <View style={styles.options}>

                    {/* Linha divisória */}
                    <Separator />

                    {/* ✅ REQUISITO 4: Botão editar com ID correto */}
                    <ActionButton
                        variant="primary"
                        icon="create-outline"
                        onPress={() => router.push({
                            pathname: "/screens/Atividade/EdicaoAtividade",
                            params: { id: atividade.id }
                        })}
                    >
                        Editar Atividade
                    </ActionButton>

                    {/* ✅ REQUISITO 5: Modal de confirmação implementado */}
                    <ActionButton
                        variant="danger"
                        icon="trash-outline"
                        onPress={handleDelete}
                    >
                        Excluir
                    </ActionButton>
                </View>
            </View>
        </SafeAreaView>)
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#132F3B',
    },
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
    headerTitle: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '600',
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
    subContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#FFFFFF',
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
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        paddingVertical: 8,
    },
    infoTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 18,
        color: '#1E293B',
        fontWeight: '500',
        lineHeight: 24,
    },
    options: {
        width: '100%',
        gap: 12,
        paddingTop: 16,
        paddingBottom: 8,
    },
    buttonPrimary: {
        width: '100%',
        height: 48,
        backgroundColor: '#0162B3',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    buttonPrimaryText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonDanger: {
        width: '100%',
        height: 48,
        backgroundColor: 'transparent',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#EF4444',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDangerText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonIcon: {
        marginRight: 8,
    },
})


export default InfoAtividade;