import { ActionButton } from '@/src/components/ActionButton';
import { ErrorState } from '@/src/components/ErrorState';
import { InfoHeader } from '@/src/components/InfoHeader';
import { InfoRow } from '@/src/components/InfoRow';
import { Loading } from '@/src/components/Loading';
import { ProfileSection } from '@/src/components/ProfileSection';
import { Separator } from '@/src/components/Separator';
import { buscarClientePorId, excluirCliente, Cliente } from '@/src/services/clientesService';
import { formatCPF, formatPhone, withPlaceholder } from '@/src/utils/formatters';
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

export default function InfoCliente() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    // Estados
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * ✅ REQUISITO 1: Carregamento dos dados usando ID da URL
     * ✅ REQUISITO 6: Atualização automática após retornar da edição (useFocusEffect)
     */
    const loadCliente = useCallback(async () => {
        if (!id) {
            setError('ID do cliente não fornecido');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const data = await buscarClientePorId(id as string);

        if (!data) {
            setError('Cliente não encontrado');
            setLoading(false);
            return;
        }

        setCliente(data);
        setLoading(false);
    }, [id]);

    // Recarrega os dados sempre que a tela receber foco
    useFocusEffect(
        useCallback(() => {
            loadCliente();
        }, [loadCliente])
    );

    /**
     * ✅ REQUISITO 5: Modal de confirmação antes de excluir
     */
    const handleDelete = () => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.",
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
                            await excluirCliente(id as string);
                            Alert.alert(
                                "Sucesso",
                                "Cliente excluído com sucesso!",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => router.push("/screens/Cliente/ListagemCliente")
                                    }
                                ]
                            );
                        } catch (error) {
                            Alert.alert(
                                "Erro",
                                "Não foi possível excluir o cliente. Tente novamente."
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
                <InfoHeader entity="Clientes" onBackPress={() => router.back()} />
                <View style={styles.subContainer}>
                    <Loading message="Carregando cliente..." />
                </View>
            </View>
        );
    }

    /**
     * ✅ REQUISITO 3: Mensagem de erro amigável se não encontrado
     */
    if (error || !cliente) {
        return (
            <View style={styles.container}>
                <InfoHeader entity="Clientes" onBackPress={() => router.push("/screens/Cliente/ListagemCliente")} />
                <View style={styles.subContainer}>
                    <ErrorState
                        message={error || 'Cliente não encontrado'}
                        onRetry={loadCliente}
                        onGoBack={() => router.push("/screens/Cliente/ListagemCliente")}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* ✅ REQUISITO 9: Breadcrumb/indicador de navegação */}
            <InfoHeader entity="Clientes" onBackPress={() => router.back()} />

            {/* Seção de foto e nome no fundo azul */}
            <ProfileSection
                name={withPlaceholder(cliente.nome_completo, 'Nome não informado')}
                subtitle="Cliente"
            />

            {/* Container branco com informações */}
            <View style={styles.subContainer}>
                <View style={styles.clientTitleContainer}>
                    <Text style={styles.clientTitle}>Informações Pessoais</Text>
                </View>
                <Separator />
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* ✅ REQUISITO 7 e 8: Dados formatados com placeholders */}
                    <InfoRow
                        icon="person-outline"
                        label="CPF"
                        value={formatCPF(cliente.cpf)}
                    />

                    <InfoRow
                        icon="location-outline"
                        label="ENDEREÇO"
                        value={cliente.endereco
                            ? `${cliente.endereco}, ${cliente.cidade} - ${cliente.estado}, ${cliente.pais || ''}`
                            : 'Endereço não informado'}
                    />

                    <InfoRow
                        icon="call-outline"
                        label="CELULAR"
                        value={formatPhone(cliente.telefone)}
                    />

                    <InfoRow
                        icon="mail-outline"
                        label="EMAIL"
                        value={withPlaceholder(cliente.email, 'Email não informado')}
                    />
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
                            pathname: "/screens/Cliente/EdicaoCliente",
                            params: { id: cliente.id }
                        })}
                    >
                        Editar Cliente
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
        backgroundColor: '#fafafa',
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
    clientTitleContainer: {
        marginBottom: 16,
    },
    clientTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    clientSubtitle: {
        fontSize: 16,
        color: '#64748B',
        textTransform: 'uppercase',
    },
    options: {
        width: '100%',
        gap: 12,
        paddingTop: 16,
        paddingBottom: 8,
    },
});
