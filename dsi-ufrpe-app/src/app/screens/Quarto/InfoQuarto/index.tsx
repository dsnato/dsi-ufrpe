import { ActionButton } from '@/src/components/ActionButton';
import { ErrorState } from '@/src/components/ErrorState';
import { InfoHeader } from '@/src/components/InfoHeader';
import { InfoRow } from '@/src/components/InfoRow';
import { Loading } from '@/src/components/Loading';
import { Separator } from '@/src/components/Separator';
import { StatusBadge } from '@/src/components/StatusBadge';
import { TitleSection } from '@/src/components/TitleSection';
import { buscarQuartoPorId, excluirQuarto, Quarto } from '@/src/services/quartosService';
import { formatCurrency, withPlaceholder } from '@/src/utils/formatters';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


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
                        try {
                            await excluirQuarto(id as string);
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
                        } catch (error) {
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
            <SafeAreaView style={styles.container} edges={['top']}>
                <InfoHeader entity="Quartos" onBackPress={() => router.back()} />
                <View style={styles.subContainer}>
                    <Loading message="Carregando quarto..." />
                </View>
            </SafeAreaView>
        );
    }

    /**
     * ✅ REQUISITO 3: Mensagem de erro amigável se não encontrado
     */
    if (error || !quarto) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <InfoHeader entity="Quartos" onBackPress={() => router.back()} />
                <View style={styles.subContainer}>
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
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* ✅ REQUISITO 9: Breadcrumb/indicador de navegação */}
            <InfoHeader entity="Quartos" onBackPress={() => router.back()} />

            {/* Container branco com informações */}
            <View style={styles.subContainer}>
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Título do quarto com badge de disponibilidade */}
                    <TitleSection
                        title={`Quarto ${withPlaceholder(quarto.numero_quarto, 'S/N')}`}
                        subtitle="Número do quarto"
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
                    />

                    <InfoRow
                        icon="people-outline"
                        label="CAPACIDADE DO QUARTO"
                        value={`${quarto.capacidade_pessoas || 0} ${quarto.capacidade_pessoas === 1 ? 'pessoa' : 'pessoas'}`}
                    />

                    <InfoRow
                        icon="cash-outline"
                        label="PREÇO DO QUARTO"
                        value={formatCurrency(quarto.preco_diario || 0)}
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
        </SafeAreaView>)
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
        flexGrow: 0,
    },
    options: {
        width: '100%',
        gap: 12,
        paddingTop: 16,
        paddingBottom: 8,
    },
})


export default InfoQuarto;