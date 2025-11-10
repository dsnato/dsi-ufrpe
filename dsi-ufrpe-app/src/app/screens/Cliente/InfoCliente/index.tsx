import { ActionButton } from '@/src/components/ActionButton';
import { ErrorState } from '@/src/components/ErrorState';
import { InfoHeader } from '@/src/components/InfoHeader';
import { InfoRow } from '@/src/components/InfoRow';
import { Loading } from '@/src/components/Loading';
import { ClienteService } from '@/src/services/ClienteService';
import { Cliente } from '@/src/types/cliente';
import { formatCPF, formatPhone, withPlaceholder } from '@/src/utils/formatters';
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";

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

        const data = await ClienteService.getById(id);

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
                        const success = await ClienteService.delete(id);

                        if (success) {
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
                        } else {
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
                <InfoHeader entity="Clientes" onBackPress={() => router.back()} />
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
            <View style={styles.profileSection}>
                <Image
                    source={require("@/assets/images/photo-model.png")}
                    style={styles.profileImage}
                />
                {/* ✅ REQUISITO 7 e 8: Formatação e tratamento de valores vazios */}
                <Text style={styles.profileName}>
                    {withPlaceholder(cliente.name, 'Nome não informado')}
                </Text>
                <Text style={styles.profileSubtitle}>Cliente</Text>
            </View>

            {/* Container branco com informações */}
            <View style={styles.subContainer}>
                <View style={styles.clientTitleContainer}>
                    <Text style={styles.clientTitle}>Informações Pessoais</Text>
                </View>
                <View style={styles.separator} />
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
                        value={cliente.street && cliente.number
                            ? `${cliente.street}, ${cliente.number}, ${cliente.neighborhood}, ${cliente.city} - ${cliente.state}, CEP: ${cliente.zipCode}`
                            : 'Endereço não informado'}
                    />

                    <InfoRow
                        icon="call-outline"
                        label="CELULAR"
                        value={formatPhone(cliente.phone)}
                    />

                    <InfoRow
                        icon="mail-outline"
                        label="EMAIL"
                        value={withPlaceholder(cliente.email, 'Email não informado')}
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
    profileSubtitle: {
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
});
