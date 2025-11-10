import { ActionButton } from '@/src/components/ActionButton';
import { ErrorState } from '@/src/components/ErrorState';
import { InfoHeader } from '@/src/components/InfoHeader';
import { InfoRow } from '@/src/components/InfoRow';
import { Loading } from '@/src/components/Loading';
import { QuartoService } from '@/src/services/QuartoService';
import { Quarto } from '@/src/types/quarto';
import { formatCurrency, withPlaceholder } from '@/src/utils/formatters';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';


const InfoQuarto: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    // Estados
    const [quarto, setQuarto] = useState<Quarto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

        const data = await QuartoService.getById(id);

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
            loadQuarto();
        }, [loadQuarto])
    );

    /**
     * ✅ REQUISITO 5: Modal de confirmação antes de excluir
     */
    const handleDelete = () => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir este quarto? Esta ação não pode ser desfeita.",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        const success = await QuartoService.delete(id);

                        if (success) {
                            Alert.alert(
                                "Sucesso",
                                "Quarto excluído com sucesso!",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => router.push("/screens/Quarto/ListagemQuarto")
                                    }
                                ]
                            );
                        } else {
                            Alert.alert(
                                "Erro",
                                "Não foi possível excluir o quarto. Tente novamente."
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
                <InfoHeader entity="Quartos" onBackPress={() => router.back()} />
                <View style={styles.subContainer}>
                    <Loading message="Carregando quarto..." />
                </View>
            </View>
        );
    }

    /**
     * ✅ REQUISITO 3: Mensagem de erro amigável se não encontrado
     */
    if (error || !quarto) {
        return (
            <View style={styles.container}>
                <InfoHeader entity="Quartos" onBackPress={() => router.back()} />
                <View style={styles.subContainer}>
                    <ErrorState
                        message={error || 'Quarto não encontrado'}
                        onRetry={loadQuarto}
                        onGoBack={() => router.push("/screens/Quarto/ListagemQuarto")}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* ✅ REQUISITO 9: Breadcrumb/indicador de navegação */}
            <InfoHeader entity="Quartos" onBackPress={() => router.back()} />

            {/* Container branco com informações */}
            <View style={styles.subContainer}>
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Título do quarto com badge de disponibilidade */}
                    <View style={styles.roomTitleContainer}>
                        <View style={styles.titleRow}>
                            {/* ✅ REQUISITO 7 e 8: Formatação e tratamento de valores vazios */}
                            <Text style={styles.roomTitle}>
                                Quarto {withPlaceholder(quarto.numero, 'S/N')}
                            </Text>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: quarto.disponivel ? '#10B981' : '#EF4444' }
                            ]}>
                                <Text style={styles.statusText}>
                                    {quarto.disponivel ? 'Disponível' : 'Ocupado'}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.roomSubtitle}>Número do quarto</Text>

                        {/* Linha divisória entre título e informações */}
                        <View style={styles.titleSeparator} />
                    </View>

                    {/* ✅ REQUISITO 7 e 8: Formatação e tratamento de valores vazios */}
                    <InfoRow
                        icon="bed-outline"
                        label="TIPO DE QUARTO"
                        value={withPlaceholder(quarto.tipo, 'Tipo não informado')}
                    />

                    <InfoRow
                        icon="people-outline"
                        label="CAPACIDADE DO QUARTO"
                        value={`${quarto.capacidade} ${quarto.capacidade === 1 ? 'pessoa' : 'pessoas'}`}
                    />

                    <InfoRow
                        icon="cash-outline"
                        label="PREÇO DO QUARTO"
                        value={formatCurrency(quarto.preco)}
                    />

                    {quarto.descricao && (
                        <InfoRow
                            icon="document-text-outline"
                            label="DESCRIÇÃO"
                            value={withPlaceholder(quarto.descricao, 'Sem descrição')}
                        />
                    )}
                </ScrollView>

                {/* Linha divisória */}
                <View style={styles.separator} />

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
                    >
                        Editar Quarto
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
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#132F3B',
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
    roomTitleContainer: {
        marginBottom: 24,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    roomTitle: {
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
    roomSubtitle: {
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
    options: {
        width: '100%',
        gap: 12,
        paddingTop: 16,
        paddingBottom: 8,
    },
})


export default InfoQuarto;