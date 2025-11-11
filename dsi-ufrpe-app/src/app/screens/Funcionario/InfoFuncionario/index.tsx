import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { buscarFuncionarioPorId, excluirFuncionario } from '@/src/services/funcionariosService';
import type { Funcionario } from '@/src/services/funcionariosService';
import { useToast } from '@/src/components/ToastContext';

export default function InfoFuncionario() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();
    const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
    const [loading, setLoading] = useState(true);

    const carregarFuncionario = useCallback(async () => {
        if (!id) {
            Alert.alert('Erro', 'ID do funcionário não fornecido');
            router.back();
            return;
        }
        try {
            setLoading(true);
            const data = await buscarFuncionarioPorId(id);
            if (!data) {
                Alert.alert('Erro', 'Funcionário não encontrado');
                router.back();
                return;
            }
            setFuncionario(data);
        } catch (error) {
            console.error('Erro ao carregar funcionário:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do funcionário');
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useFocusEffect(useCallback(() => { carregarFuncionario(); }, [carregarFuncionario]));

    const handleExcluir = () => {
        Alert.alert("Confirmar Exclusão", "Tem certeza que deseja excluir este funcionário?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir", style: "destructive",
                onPress: async () => {
                    try {
                        await excluirFuncionario(id);
                        showSuccess('Funcionário excluído com sucesso!');
                        router.push("/screens/Funcionario/ListagemFuncionario");
                    } catch (error) {
                        console.error('Erro ao excluir funcionário:', error);
                        showError('Não foi possível excluir o funcionário');
                    }
                }
            }
        ]);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.breadcrumb}>
                        <Text style={styles.breadcrumbText}>Funcionários</Text>
                        <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                        <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                    </View>
                </View>
                <View style={styles.subContainer}>
                    <ActivityIndicator size="large" color="#0162B3" />
                    <Text style={styles.loadingText}>Carregando funcionário...</Text>
                </View>
            </View>
        );
    }

    if (!funcionario) return <View style={styles.container}><Text>Funcionário não encontrado</Text></View>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/screens/Funcionario/ListagemFuncionario")} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.breadcrumb}>
                    <Text style={styles.breadcrumbText}>Funcionários</Text>
                    <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                    <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                </View>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.profileImagePlaceholder}>
                    <Ionicons name="person" size={50} color="#FFFFFF" />
                </View>
                <Text style={styles.profileName}>{funcionario.nome_completo || 'Nome não informado'}</Text>
                <Text style={styles.profileSubtitle}>{funcionario.cargo || 'Cargo não informado'}</Text>
            </View>

            <View style={styles.subContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Informações do Funcionário</Text>
                </View>
                <View style={styles.separator} />
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.infoRow}>
                        <Ionicons name="card-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>CPF</Text>
                            <Text style={styles.infoValue}>{funcionario.cpf || 'Não informado'}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>EMAIL</Text>
                            <Text style={styles.infoValue}>{funcionario.email || 'Não informado'}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="call-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>TELEFONE</Text>
                            <Text style={styles.infoValue}>{funcionario.telefone || 'Não informado'}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="cash-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>SALÁRIO</Text>
                            <Text style={styles.infoValue}>R$ {funcionario.salario?.toFixed(2) || '0.00'}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>DATA DE ADMISSÃO</Text>
                            <Text style={styles.infoValue}>{funcionario.data_admissao || 'Não informada'}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="information-circle-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>STATUS</Text>
                            <Text style={[styles.infoValue, funcionario.status === 'ativo' ? styles.statusAtivo : styles.statusInativo]}>
                                {funcionario.status || 'Não informado'}
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.separator} />
                <View style={styles.options}>
                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={() => router.push({ pathname: "/screens/Funcionario/EdicaoFuncionario", params: { id: funcionario.id } })}
                    >
                        <Ionicons name="create-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonPrimaryText}>Editar Funcionário</Text>
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
    scrollContent: { flex: 1 },
    titleContainer: { marginBottom: 16 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
    separator: { width: '100%', height: 1, backgroundColor: '#E2E8F0', marginBottom: 20 },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, paddingVertical: 8 },
    infoTextContainer: { marginLeft: 12, flex: 1 },
    infoLabel: { fontSize: 16, color: '#64748B', fontWeight: '600', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
    infoValue: { fontSize: 18, color: '#1E293B', fontWeight: '500', lineHeight: 24 },
    statusAtivo: { color: '#10B981' },
    statusInativo: { color: '#EF4444' },
    options: { width: '100%', gap: 12, paddingTop: 16, paddingBottom: 8 },
    buttonPrimary: { width: '100%', height: 48, backgroundColor: '#0162B3', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3 },
    buttonPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    buttonDanger: { width: '100%', height: 48, backgroundColor: 'transparent', borderRadius: 12, borderWidth: 1.5, borderColor: '#EF4444', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    buttonDangerText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
    buttonIcon: { marginRight: 8 },
});
