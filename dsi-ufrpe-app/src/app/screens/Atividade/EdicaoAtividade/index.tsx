import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { buscarAtividadePorId, atualizarAtividade } from '@/src/services/atividadesService';
import type { AtividadeRecreativa } from '@/src/services/atividadesService';
import TextButton from '@/src/components/TextButton';
import { useToast } from '@/src/components/ToastContext';

export default function EdicaoAtividade() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataHora, setDataHora] = useState('');
    const [local, setLocal] = useState('');
    const [capacidadeMaxima, setCapacidadeMaxima] = useState('');
    const [preco, setPreco] = useState('');
    const [status, setStatus] = useState('agendada');

    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        carregarAtividade();
    }, [id]);

    const carregarAtividade = async () => {
        if (!id) {
            Alert.alert('Erro', 'ID da atividade não fornecido');
            router.back();
            return;
        }

        try {
            setLoading(true);
            const atividade = await buscarAtividadePorId(id);
            
            if (!atividade) {
                Alert.alert('Erro', 'Atividade não encontrada');
                router.back();
                return;
            }

            setNome(atividade.nome || '');
            setDescricao(atividade.descricao || '');
            setDataHora(atividade.data_hora || '');
            setLocal(atividade.local || '');
            setCapacidadeMaxima(atividade.capacidade_maxima?.toString() || '');
            setPreco(atividade.preco?.toString() || '');
            setStatus(atividade.status || 'agendada');
        } catch (error) {
            console.error('Erro ao carregar atividade:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados da atividade');
        } finally {
            setLoading(false);
        }
    };

    const validarCampos = (): boolean => {
        if (!nome.trim()) {
            Alert.alert('Erro', 'Nome é obrigatório');
            return false;
        }
        if (!dataHora.trim()) {
            Alert.alert('Erro', 'Data e hora são obrigatórios');
            return false;
        }
        if (!local.trim()) {
            Alert.alert('Erro', 'Local é obrigatório');
            return false;
        }
        return true;
    };

    const handleAtualizar = async () => {
        if (!validarCampos()) return;

        try {
            setSalvando(true);
            const dados: Partial<AtividadeRecreativa> = {
                nome,
                descricao: descricao || undefined,
                data_hora: dataHora,
                local,
                capacidade_maxima: capacidadeMaxima ? Number(capacidadeMaxima) : undefined,
                preco: preco ? Number(preco) : undefined,
                status: status as 'agendada' | 'em_andamento' | 'concluida' | 'cancelada'
            };

            await atualizarAtividade(id, dados);
            showSuccess('Atividade atualizada com sucesso!');
            router.back();
        } catch (error) {
            console.error('Erro ao atualizar atividade:', error);
            showError('Não foi possível atualizar a atividade');
        } finally {
            setSalvando(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Editar Atividade</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0162B3" />
                    <Text style={styles.loadingText}>Carregando...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>Editar Atividade</Text>
            </View>

            <View style={styles.formContainer}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <TextButton labelText="Nome" placeholder="Digite o nome da atividade" value={nome} onChangeText={setNome} required />
                    <TextButton labelText="Descrição" placeholder="Digite a descrição" value={descricao} onChangeText={setDescricao} />
                    <TextButton labelText="Data e Hora" placeholder="YYYY-MM-DD HH:MM:SS" value={dataHora} onChangeText={setDataHora} required />
                    <TextButton labelText="Local" placeholder="Digite o local" value={local} onChangeText={setLocal} required />
                    <TextButton labelText="Capacidade Máxima" placeholder="Número de participantes" value={capacidadeMaxima} onChangeText={setCapacidadeMaxima} keyboardType="number-pad" />
                    <TextButton labelText="Preço" placeholder="Valor da atividade" value={preco} onChangeText={setPreco} keyboardType="decimal-pad" />
                    
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusLabel}>Status</Text>
                        <View style={styles.statusButtons}>
                            <TouchableOpacity style={[styles.statusButton, status === 'agendada' && styles.statusButtonActive]} onPress={() => setStatus('agendada')}>
                                <Text style={[styles.statusButtonText, status === 'agendada' && styles.statusButtonTextActive]}>Agendada</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.statusButton, status === 'em_andamento' && styles.statusButtonActive]} onPress={() => setStatus('em_andamento')}>
                                <Text style={[styles.statusButtonText, status === 'em_andamento' && styles.statusButtonTextActive]}>Em Andamento</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.statusButton, status === 'concluida' && styles.statusButtonActive]} onPress={() => setStatus('concluida')}>
                                <Text style={[styles.statusButtonText, status === 'concluida' && styles.statusButtonTextActive]}>Concluída</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.statusButton, status === 'cancelada' && styles.statusButtonActive]} onPress={() => setStatus('cancelada')}>
                                <Text style={[styles.statusButtonText, status === 'cancelada' && styles.statusButtonTextActive]}>Cancelada</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <TouchableOpacity style={[styles.saveButton, salvando && styles.saveButtonDisabled]} onPress={handleAtualizar} disabled={salvando}>
                    {salvando ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#132F3B' },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16 },
    backButton: { marginRight: 16 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    loadingText: { marginTop: 12, fontSize: 16, color: '#64748B' },
    formContainer: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingVertical: 24, paddingHorizontal: 20 },
    scrollView: { flex: 1 },
    statusContainer: { marginTop: 16, marginBottom: 20 },
    statusLabel: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 12 },
    statusButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    statusButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', alignItems: 'center' },
    statusButtonActive: { backgroundColor: '#0162B3', borderColor: '#0162B3' },
    statusButtonText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
    statusButtonTextActive: { color: '#FFFFFF' },
    saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0162B3', paddingVertical: 16, borderRadius: 12, marginTop: 16, gap: 8 },
    saveButtonDisabled: { opacity: 0.6 },
    saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
