import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { buscarClientePorId, excluirCliente } from '@/src/services/clientesService';
import type { Cliente } from '@/src/services/clientesService';
import { useToast } from '@/src/components/ToastContext';

export default function InfoCliente() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();

    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [loading, setLoading] = useState(true);

    const carregarCliente = useCallback(async () => {
        if (!id) {
            Alert.alert('Erro', 'ID do cliente não fornecido');
            router.back();
            return;
        }

        try {
            setLoading(true);
            const data = await buscarClientePorId(id);
            
            if (!data) {
                Alert.alert('Erro', 'Cliente não encontrado');
                router.back();
                return;
            }

            setCliente(data);
        } catch (error) {
            console.error('Erro ao carregar cliente:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do cliente');
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useFocusEffect(
        useCallback(() => {
            carregarCliente();
        }, [carregarCliente])
    );

    const handleExcluir = () => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await excluirCliente(id);
                            showSuccess('Cliente excluído com sucesso!');
                            router.push("/screens/Cliente/ListagemCliente");
                        } catch (error) {
                            console.error('Erro ao excluir cliente:', error);
                            showError('Não foi possível excluir o cliente');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.breadcrumb}>
                        <Text style={styles.breadcrumbText}>Clientes</Text>
                        <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                        <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                    </View>
                </View>
                <View style={styles.subContainer}>
                    <ActivityIndicator size="large" color="#0162B3" />
                    <Text style={styles.loadingText}>Carregando cliente...</Text>
                </View>
            </View>
        );
    }

    if (!cliente) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.breadcrumb}>
                        <Text style={styles.breadcrumbText}>Clientes</Text>
                        <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                        <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                    </View>
                </View>
                <View style={styles.subContainer}>
                    <Text style={styles.emptyText}>Cliente não encontrado</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/screens/Cliente/ListagemCliente")} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.breadcrumb}>
                    <Text style={styles.breadcrumbText}>Clientes</Text>
                    <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                    <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                </View>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.profileImagePlaceholder}>
                    <Ionicons name="person" size={50} color="#FFFFFF" />
                </View>
                <Text style={styles.profileName}>{cliente.nome_completo || 'Nome não informado'}</Text>
                <Text style={styles.profileSubtitle}>Cliente</Text>
            </View>

            <View style={styles.subContainer}>
                <View style={styles.clientTitleContainer}>
                    <Text style={styles.clientTitle}>Informações Pessoais</Text>
                </View>
                <View style={styles.separator} />
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.infoRow}>
                        <Ionicons name="card-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>CPF</Text>
                            <Text style={styles.infoValue}>{cliente.cpf || 'Não informado'}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="call-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>TELEFONE</Text>
                            <Text style={styles.infoValue}>{cliente.telefone || 'Não informado'}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>EMAIL</Text>
                            <Text style={styles.infoValue}>{cliente.email || 'Não informado'}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>DATA DE NASCIMENTO</Text>
                            <Text style={styles.infoValue}>{cliente.data_nascimento || 'Não informada'}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>ENDEREÇO</Text>
                            <Text style={styles.infoValue}>{cliente.endereco || 'Não informado'}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="business-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>CIDADE</Text>
                            <Text style={styles.infoValue}>{cliente.cidade || 'Não informada'}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="map-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>ESTADO</Text>
                            <Text style={styles.infoValue}>{cliente.estado || 'Não informado'}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="globe-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>PAÍS</Text>
                            <Text style={styles.infoValue}>{cliente.pais || 'Não informado'}</Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.separator} />

                <View style={styles.options}>
                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={() => router.push({
                            pathname: "/screens/Cliente/EdicaoCliente",
                            params: { id: cliente.id }
                        })}
                    >
                        <Ionicons name="create-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonPrimaryText}>Editar Cliente</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonDanger} onPress={handleExcluir}>
                        <Ionicons name="trash-outline" size={20} color="#EF4444" style={styles.buttonIcon} />
                        <Text style={styles.buttonDangerText}>Excluir</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#132F3B' },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: '#132F3B' },
    backButton: { marginRight: 16 },
    breadcrumb: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
    breadcrumbText: { fontSize: 14, color: '#E0F2FE', opacity: 0.7 },
    breadcrumbTextActive: { fontSize: 14, color: '#FFE157', fontWeight: '600' },
    profileSection: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20, backgroundColor: '#132F3B' },
    profileImagePlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#0162B3', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    profileName: { fontSize: 22, fontWeight: 'bold', color: '#FFE157', textAlign: 'center', marginBottom: 4 },
    profileSubtitle: { fontSize: 18, color: '#E0F2FE', textAlign: 'center' },
    subContainer: { flex: 1, width: '100%', backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingVertical: 24, paddingHorizontal: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4, marginTop: 20 },
    loadingText: { fontSize: 16, color: '#64748B', textAlign: 'center', marginTop: 12 },
    emptyText: { fontSize: 16, color: '#64748B', textAlign: 'center' },
    scrollContent: { flex: 1 },
    clientTitleContainer: { marginBottom: 16 },
    clientTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
    separator: { width: '100%', height: 1, backgroundColor: '#E2E8F0', marginBottom: 20 },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, paddingVertical: 8 },
    infoTextContainer: { marginLeft: 12, flex: 1 },
    infoLabel: { fontSize: 16, color: '#64748B', fontWeight: '600', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
    infoValue: { fontSize: 18, color: '#1E293B', fontWeight: '500', lineHeight: 24 },
    options: { width: '100%', gap: 12, paddingTop: 16, paddingBottom: 8 },
    buttonPrimary: { width: '100%', height: 48, backgroundColor: '#0162B3', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3 },
    buttonPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    buttonDanger: { width: '100%', height: 48, backgroundColor: 'transparent', borderRadius: 12, borderWidth: 1.5, borderColor: '#EF4444', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    buttonDangerText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
    buttonIcon: { marginRight: 8 },
});
