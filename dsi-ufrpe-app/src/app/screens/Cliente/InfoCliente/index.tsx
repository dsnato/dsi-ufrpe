import { ActionButton } from '@/src/components/ActionButton';
import { ErrorState } from '@/src/components/ErrorState';
import { InfoHeader } from '@/src/components/InfoHeader';
import { InfoRow } from '@/src/components/InfoRow';
import { Loading } from '@/src/components/Loading';
import { ProfileSection } from '@/src/components/ProfileSection';
import { Separator } from '@/src/components/Separator';
import { useToast } from '@/src/components/ToastContext';
import { buscarClientePorId, Cliente, excluirCliente } from '@/src/services/clientesService';
import { formatCPF, formatPhone, withPlaceholder } from '@/src/utils/formatters';
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InfoCliente() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();

    // Estados
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

        console.log('📋 [InfoCliente] Dados do cliente recebidos:', JSON.stringify(data, null, 2));
        console.log('🖼️ [InfoCliente] URL da imagem do cliente:', data.imagem_url);
        
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
        console.log('🟡 [InfoCliente] handleDelete chamado!');
        console.log('🟡 [InfoCliente] Cliente ID:', id);
        console.log('🟡 [InfoCliente] Cliente objeto:', cliente);
        
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            console.log('🔴 [InfoCliente] Iniciando exclusão, ID:', id);
            setShowDeleteConfirm(false);
            setLoading(true);
            
            await excluirCliente(id as string);
            
            console.log('✅ [InfoCliente] Exclusão concluída com sucesso');
            showSuccess('Cliente excluído com sucesso!');
            
            setTimeout(() => {
                router.push("/screens/Cliente/ListagemCliente");
            }, 1500);
        } catch (error: any) {
            console.error('🔴 [InfoCliente] Erro ao excluir:', error);
            console.error('🔴 [InfoCliente] Mensagem:', error?.message);
            console.error('🔴 [InfoCliente] Stack:', error?.stack);
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

    // Log para debug da imagem
    console.log('🎨 [InfoCliente] Renderizando com imagem_url:', cliente.imagem_url);
    console.log('🎨 [InfoCliente] ImageSource será:', cliente.imagem_url ? { uri: cliente.imagem_url } : 'undefined (imagem padrão)');

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* ✅ REQUISITO 9: Breadcrumb/indicador de navegação */}
            <InfoHeader entity="Clientes" onBackPress={() => router.back()} />

            {/* Seção de foto e nome no fundo azul */}
            <ProfileSection
                name={withPlaceholder(cliente.nome_completo, 'Nome não informado')}
                subtitle="Cliente"
                imageSource={cliente.imagem_url ? { uri: cliente.imagem_url } : undefined}
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

            {/* Modal de Confirmação de Exclusão */}
            {showDeleteConfirm && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
                        <Text style={styles.modalMessage}>
                            Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
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
        </SafeAreaView>
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
});
