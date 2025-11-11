import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { buscarAtividadePorId, excluirAtividade, cancelarAtividade, finalizarAtividade } from '@/src/services/atividadesService';
import type { AtividadeRecreativa } from '@/src/services/atividadesService';
import { useToast } from '@/src/components/ToastContext';

export default function InfoAtividade() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();
    const [atividade, setAtividade] = useState<AtividadeRecreativa | null>(null);
    const [loading, setLoading] = useState(true);
    const [processando, setProcessando] = useState(false);

    const carregarAtividade = useCallback(async () => {
        if (!id) {
            Alert.alert('Erro', 'ID da atividade não fornecido');
            router.back();
            return;
        }
        try {
            setLoading(true);
            const data = await buscarAtividadePorId(id);
            if (!data) {
                Alert.alert('Erro', 'Atividade não encontrada');
                router.back();
                return;
            }
            setAtividade(data);
        } catch (error) {
            console.error('Erro ao carregar atividade:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados da atividade');
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useFocusEffect(useCallback(() => { carregarAtividade(); }, [carregarAtividade]));

    const handleCancelar = async () => {
        Alert.alert("Confirmar Cancelamento", "Tem certeza que deseja cancelar esta atividade?", [
            { text: "Não", style: "cancel" },
            {
                text: "Sim, Cancelar",
                style: "destructive",
                onPress: async () => {
                    try {
                        setProcessando(true);
                        await cancelarAtividade(id);
                        Alert.alert('Sucesso', 'Atividade cancelada com sucesso!');
                        carregarAtividade();
                    } catch (error) {
                        console.error('Erro ao cancelar atividade:', error);
                        Alert.alert('Erro', 'Não foi possível cancelar a atividade');
                    } finally {
                        setProcessando(false);
                    }
                }
            }
        ]);
    };

    const handleFinalizar = async () => {
        try {
            setProcessando(true);
            await finalizarAtividade(id);
            Alert.alert('Sucesso', 'Atividade finalizada com sucesso!');
            carregarAtividade();
        } catch (error) {
            console.error('Erro ao finalizar atividade:', error);
            Alert.alert('Erro', 'Não foi possível finalizar a atividade');
        } finally {
            setProcessando(false);
        }
    };

    const handleExcluir = () => {
        Alert.alert("Confirmar Exclusão", "Tem certeza que deseja excluir esta atividade?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir", style: "destructive",
                onPress: async () => {
                    try {
                        await excluirAtividade(id);
                        showSuccess('Atividade excluída com sucesso!');
                        router.push("/screens/Atividade/ListagemAtividade");
                    } catch (error) {
                        console.error('Erro ao excluir atividade:', error);
                        showError('Não foi possível excluir a atividade');
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
                        <Text style={styles.breadcrumbText}>Atividades</Text>
                        <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                        <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                    </View>
                </View>
                <View style={styles.subContainer}>
                    <ActivityIndicator size="large" color="#0162B3" />
                    <Text style={styles.loadingText}>Carregando atividade...</Text>
                </View>
            </View>
        );
    }

    if (!atividade) return <View style={styles.container}><Text>Atividade não encontrada</Text></View>;

    const statusColor = atividade.status === 'agendada' ? '#3B82F6' : atividade.status === 'em_andamento' ? '#F59E0B' : atividade.status === 'concluida' ? '#10B981' : '#EF4444';

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

            <View style={styles.profileSection}>
                <View style={styles.profileImagePlaceholder}>
                    <Ionicons name="fitness" size={50} color="#FFFFFF" />
                </View>
                <Text style={styles.profileName}>{atividade.nome || 'Atividade'}</Text>
                <Text style={styles.profileSubtitle}>{atividade.local || 'Local não informado'}</Text>
            </View>

            <View style={styles.subContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Detalhes da Atividade</Text>
                </View>
                <View style={styles.separator} />
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.infoRow}>
                        <Ionicons name="document-text-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>DESCRIÇÃO</Text>
                            <Text style={styles.infoValue}>{atividade.descricao || 'Sem descrição'}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>DATA E HORA</Text>
                            <Text style={styles.infoValue}>{atividade.data_hora || 'Não informado'}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>LOCAL</Text>
                            <Text style={styles.infoValue}>{atividade.local || 'Não informado'}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="people-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>CAPACIDADE MÁXIMA</Text>
                            <Text style={styles.infoValue}>{atividade.capacidade_maxima || 'Ilimitada'}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="cash-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>PREÇO</Text>
                            <Text style={styles.infoValue}>R$ {atividade.preco?.toFixed(2) || '0.00'}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="information-circle-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>STATUS</Text>
                            <Text style={[styles.infoValue, { color: statusColor }]}>
                                {atividade.status || 'Não informado'}
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.separator} />
                <View style={styles.options}>
                    {atividade.status !== 'cancelada' && atividade.status !== 'concluida' && (
                        <>
                            <TouchableOpacity
                                style={[styles.buttonSuccess, processando && styles.buttonDisabled]}
                                onPress={handleFinalizar}
                                disabled={processando}
                            >
                                <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                                <Text style={styles.buttonSuccessText}>Finalizar Atividade</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.buttonWarning, processando && styles.buttonDisabled]}
                                onPress={handleCancelar}
                                disabled={processando}
                            >
                                <Ionicons name="close-circle-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                                <Text style={styles.buttonWarningText}>Cancelar Atividade</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={() => router.push({ pathname: "/screens/Atividade/EdicaoAtividade", params: { id: atividade.id } })}
                    >
                        <Ionicons name="create-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonPrimaryText}>Editar Atividade</Text>
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
    options: { width: '100%', gap: 12, paddingTop: 16, paddingBottom: 8 },
    buttonPrimary: { width: '100%', height: 48, backgroundColor: '#0162B3', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3 },
    buttonPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    buttonSuccess: { width: '100%', height: 48, backgroundColor: '#10B981', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3 },
    buttonSuccessText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    buttonWarning: { width: '100%', height: 48, backgroundColor: '#F59E0B', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3 },
    buttonWarningText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    buttonDanger: { width: '100%', height: 48, backgroundColor: 'transparent', borderRadius: 12, borderWidth: 1.5, borderColor: '#EF4444', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    buttonDangerText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
    buttonDisabled: { opacity: 0.5 },
    buttonIcon: { marginRight: 8 },
});
