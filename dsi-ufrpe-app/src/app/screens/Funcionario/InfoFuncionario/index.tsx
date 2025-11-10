import { ActionButton } from '@/src/components/ActionButton';
import { ErrorState } from '@/src/components/ErrorState';
import { InfoHeader } from '@/src/components/InfoHeader';
import { InfoRow } from '@/src/components/InfoRow';
import { Loading } from '@/src/components/Loading';
import { FuncionarioService } from '@/src/services/FuncionarioService';
import { Funcionario } from '@/src/types/funcionario';
import { formatCPF, formatPhone, withPlaceholder } from '@/src/utils/formatters';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';


const InfoFuncionario: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    // Estados
    const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * ✅ REQUISITO 1: Carregamento dos dados usando ID da URL
     * ✅ REQUISITO 6: Atualização automática após retornar da edição (useFocusEffect)
     */
    const loadFuncionario = useCallback(async () => {
        if (!id) {
            setError('ID do funcionário não fornecido');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const data = await FuncionarioService.getById(id);

        if (!data) {
            setError('Funcionário não encontrado');
            setLoading(false);
            return;
        }

        setFuncionario(data);
        setLoading(false);
    }, [id]);

    // Recarrega os dados sempre que a tela receber foco
    useFocusEffect(
        useCallback(() => {
            loadFuncionario();
        }, [loadFuncionario])
    );

    /**
     * ✅ REQUISITO 5: Modal de confirmação antes de excluir
     */
    const handleDelete = () => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        const success = await FuncionarioService.delete(id);

                        if (success) {
                            Alert.alert(
                                "Sucesso",
                                "Funcionário excluído com sucesso!",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => router.push("/screens/Funcionario/ListagemFuncionario")
                                    }
                                ]
                            );
                        } else {
                            Alert.alert(
                                "Erro",
                                "Não foi possível excluir o funcionário. Tente novamente."
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
                <InfoHeader entity="Funcionários" onBackPress={() => router.back()} />
                <View style={styles.subContainer}>
                    <Loading message="Carregando funcionário..." />
                </View>
            </View>
        );
    }

    /**
     * ✅ REQUISITO 3: Mensagem de erro amigável se não encontrado
     */
    if (error || !funcionario) {
        return (
            <View style={styles.container}>
                <InfoHeader entity="Funcionários" onBackPress={() => router.back()} />
                <View style={styles.subContainer}>
                    <ErrorState
                        message={error || 'Funcionário não encontrado'}
                        onRetry={loadFuncionario}
                        onGoBack={() => router.push("/screens/Funcionario/ListagemFuncionario")}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* ✅ REQUISITO 9: Breadcrumb/indicador de navegação */}
            <InfoHeader entity="Funcionários" onBackPress={() => router.back()} />

            {/* Seção de foto e nome no fundo azul */}
            <View style={styles.profileSection}>
                <Image
                    source={require("@/assets/images/photo-model.png")}
                    style={styles.profileImage}
                />
                {/* ✅ REQUISITO 7 e 8: Formatação e tratamento de valores vazios */}
                <Text style={styles.profileName}>
                    {withPlaceholder(funcionario.name, 'Nome não informado')}
                </Text>
                <Text style={styles.profileRole}>
                    {withPlaceholder(funcionario.role, 'Cargo não informado')}
                </Text>
            </View>

            {/* Container branco com informações */}
            <View style={styles.subContainer}>
                <View style={styles.funcionarioTitleContainer}>
                    <Text style={styles.funcionarioTitle}>Informações Pessoais</Text>
                </View>
                <View style={styles.separator} />
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* ✅ REQUISITO 7 e 8: Informações formatadas com placeholders */}
                    <InfoRow
                        icon="card-outline"
                        label="CPF"
                        value={formatCPF(funcionario.cpf)}
                    />

                    <InfoRow
                        icon="call-outline"
                        label="CELULAR"
                        value={formatPhone(funcionario.phone)}
                    />

                    <InfoRow
                        icon="mail-outline"
                        label="E-MAIL"
                        value={withPlaceholder(funcionario.email, 'Email não informado')}
                    />
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
                            pathname: "/screens/Funcionario/EdicaoFuncionario",
                            params: { id: funcionario.id }
                        })}
                    >
                        Editar Funcionário
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
    profileSection: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#132F3B',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        marginBottom: 12,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFE157',
        textAlign: 'center',
        marginBottom: 4,
    },
    profileRole: {
        fontSize: 18,
        color: '#E0F2FE',
        textAlign: 'center',
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
    funcionarioTitleContainer: {
        marginBottom: 16,
    },
    funcionarioTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
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


export default InfoFuncionario;