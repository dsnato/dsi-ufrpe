import { ErrorState } from '@/src/components/ErrorState';
import { Loading } from '@/src/components/Loading';
import { AtividadeService } from '@/src/services/AtividadeService';
import { Atividade } from '@/src/types/atividade';
import { formatDate, formatTime, withPlaceholder } from '@/src/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const InfoAtividade: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    // Estados
    const [atividade, setAtividade] = useState<Atividade | null>(null);
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

        const data = await AtividadeService.getById(id);

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
                        const success = await AtividadeService.delete(id);

                        if (success) {
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
                        } else {
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
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push("/screens/Atividade/ListagemAtividade")} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.breadcrumb}>
                        <Text style={styles.breadcrumbText}>Atividades</Text>
                        <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                        <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                    </View>
                </View>
                <View style={styles.subContainer}>
                    <Loading message="Carregando atividade..." />
                </View>
            </View>
        );
    }

    /**
     * ✅ REQUISITO 3: Mensagem de erro amigável se não encontrada
     */
    if (error || !atividade) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.breadcrumb}>
                        <Text style={styles.breadcrumbText}>Atividades</Text>
                        <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                        <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                    </View>
                </View>
                <View style={styles.subContainer}>
                    <ErrorState
                        message={error || 'Atividade não encontrada'}
                        onRetry={loadAtividade}
                        onGoBack={() => router.push("/screens/Atividade/ListagemAtividade")}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* ✅ REQUISITO 9: Breadcrumb/indicador de navegação */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/screens/Atividade/ListagemAtividade")} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.breadcrumb}>
                    <Text style={styles.breadcrumbText}>Atividades</Text>
                    <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                    <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                </View>
            </View>

            {/* Container branco com informações */}
            <View style={styles.subContainer}>
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Título da atividade com badge de status */}
                    <View style={styles.atividadeTitleContainer}>
                        <View style={styles.titleRow}>
                            {/* ✅ REQUISITO 7 e 8: Formatação e tratamento de valores vazios */}
                            <Text style={styles.atividadeTitle}>
                                {withPlaceholder(atividade.nome, 'Sem nome')}
                            </Text>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: atividade.ativa ? '#10B981' : '#6B7280' }
                            ]}>
                                <Text style={styles.statusText}>
                                    {atividade.ativa ? 'Ativa' : 'Inativa'}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.atividadeSubtitle}>Atividade recreativa</Text>

                        {/* Linha divisória entre título e informações */}
                        <View style={styles.titleSeparator} />
                    </View>


                    {/* ✅ REQUISITO 7 e 8: Informações formatadas com placeholders */}
                    <View style={styles.infoRow}>
                        <Ionicons name="document-text-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>DESCRIÇÃO</Text>
                            <Text style={styles.infoValue}>
                                {withPlaceholder(atividade.descricao, 'Sem descrição')}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>DATA DA ATIVIDADE</Text>
                            <Text style={styles.infoValue}>
                                {formatDate(atividade.data_atividade)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>HORÁRIO</Text>
                            <Text style={styles.infoValue}>
                                {formatTime(atividade.horario)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>LOCAL</Text>
                            <Text style={styles.infoValue}>
                                {withPlaceholder(atividade.local, 'Local não informado')}
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Botões de ação */}
                <View style={styles.options}>

                    {/* Linha divisória */}
                    <View style={styles.separator} />

                    {/* ✅ REQUISITO 4: Botão editar com ID correto */}
                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={() => router.push({
                            pathname: "/screens/Atividade/EdicaoAtividade",
                            params: { id: atividade.id }
                        })}
                    >
                        <Ionicons name="create-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonPrimaryText}>Editar Atividade</Text>
                    </TouchableOpacity>

                    {/* ✅ REQUISITO 5: Modal de confirmação implementado */}
                    <TouchableOpacity style={styles.buttonDanger} onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={20} color="#EF4444" style={styles.buttonIcon} />
                        <Text style={styles.buttonDangerText}>Excluir</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
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
        flex: 1,
    },
    atividadeTitleContainer: {
        marginBottom: 24,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    atividadeTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1E293B',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginLeft: 12,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    atividadeSubtitle: {
        fontSize: 16,
        color: '#64748B',
        textTransform: 'uppercase',
    },
    titleSeparator: {
        width: '100%',
        height: 1,
        backgroundColor: '#E2E8F0',
        marginTop: 20,
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#E2E8F0',
        marginBottom: 20,
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