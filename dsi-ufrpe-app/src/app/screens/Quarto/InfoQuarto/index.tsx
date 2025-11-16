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
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from '@/src/components/ToastContext';


const InfoQuarto: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();

    // Estados
    const [quarto, setQuarto] = useState<Quarto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

            {/* Modal de Confirmação de Exclusão */}
            {showDeleteConfirm && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
                        <Text style={styles.modalMessage}>
                            Tem certeza que deseja excluir este quarto? Esta ação não pode ser desfeita.
                        </Text>
                        <View style={styles.modalButtons}>
                            <ActionButton
                                variant="secondary"
                                onPress={cancelDelete}
                                style={styles.modalButton}
                            >
                                Cancelar
                            </ActionButton>
                            <ActionButton
                                variant="danger"
                                onPress={confirmDelete}
                                style={styles.modalButton}
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
        backgroundColor: 'white',
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
        color: '#64748B',
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