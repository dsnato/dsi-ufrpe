import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { buscarReservaPorId, atualizarReserva } from '@/src/services/reservasService';
import type { Reserva } from '@/src/services/reservasService';
import TextButton from '@/src/components/TextButton';
import { useToast } from '@/src/components/ToastContext';

export default function EdicaoReserva() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();

    const [clienteId, setClienteId] = useState('');
    const [quartoId, setQuartoId] = useState('');
    const [dataCheckin, setDataCheckin] = useState('');
    const [dataCheckout, setDataCheckout] = useState('');
    const [valorTotal, setValorTotal] = useState('');
    const [status, setStatus] = useState('confirmada');

    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        carregarReserva();
    }, [id]);

    const carregarReserva = async () => {
        if (!id) {
            Alert.alert('Erro', 'ID da reserva não fornecido');
            router.back();
            return;
        }

        try {
            setLoading(true);
            const reserva = await buscarReservaPorId(id);
            
            if (!reserva) {
                Alert.alert('Erro', 'Reserva não encontrada');
                router.back();
                return;
            }

            setClienteId(reserva.id_cliente || '');
            setQuartoId(reserva.id_quarto || '');
            setDataCheckin(reserva.data_checkin || '');
            setDataCheckout(reserva.data_checkout || '');
            setValorTotal(reserva.valor_total?.toString() || '');
            setStatus(reserva.status || 'confirmada');
        } catch (error) {
            console.error('Erro ao carregar reserva:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados da reserva');
        } finally {
            setLoading(false);
        }
    };

    const validarCampos = (): boolean => {
        if (!clienteId.trim()) {
            Alert.alert('Erro', 'ID do cliente é obrigatório');
            return false;
        }
        if (!quartoId.trim()) {
            Alert.alert('Erro', 'ID do quarto é obrigatório');
            return false;
        }
        if (!dataCheckin.trim()) {
            Alert.alert('Erro', 'Data de check-in é obrigatória');
            return false;
        }
        if (!dataCheckout.trim()) {
            Alert.alert('Erro', 'Data de check-out é obrigatória');
            return false;
        }
        if (!valorTotal.trim()) {
            Alert.alert('Erro', 'Valor total é obrigatório');
            return false;
        }
        if (isNaN(Number(valorTotal))) {
            Alert.alert('Erro', 'Valor total deve ser um número válido');
            return false;
        }
        return true;
    };

    const handleAtualizar = async () => {
        if (!validarCampos()) return;

        try {
            setSalvando(true);
            const dados: Partial<Reserva> = {
                id_cliente: clienteId,
                id_quarto: quartoId,
                data_checkin: dataCheckin,
                data_checkout: dataCheckout,
                valor_total: Number(valorTotal),
                status: status as 'confirmada' | 'cancelada' | 'concluida'
            };

            await atualizarReserva(id, dados);
            showSuccess('Reserva atualizada com sucesso!');
            router.back();
        } catch (error) {
            console.error('Erro ao atualizar reserva:', error);
            showError('Não foi possível atualizar a reserva');
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
                    <Text style={styles.title}>Editar Reserva</Text>
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
                <Text style={styles.title}>Editar Reserva</Text>
            </View>

            <View style={styles.formContainer}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <TextButton
                        labelText="ID do Cliente"
                        placeholder="Digite o ID do cliente"
                        value={clienteId}
                        onChangeText={setClienteId}
                        required
                    />
                    <TextButton
                        labelText="ID do Quarto"
                        placeholder="Digite o ID do quarto"
                        value={quartoId}
                        onChangeText={setQuartoId}
                        required
                    />
                    <TextButton
                        labelText="Data de Check-in"
                        placeholder="YYYY-MM-DD"
                        value={dataCheckin}
                        onChangeText={setDataCheckin}
                        required
                    />
                    <TextButton
                        labelText="Data de Check-out"
                        placeholder="YYYY-MM-DD"
                        value={dataCheckout}
                        onChangeText={setDataCheckout}
                        required
                    />
                    <TextButton
                        labelText="Valor Total"
                        placeholder="Digite o valor total"
                        value={valorTotal}
                        onChangeText={setValorTotal}
                        keyboardType="decimal-pad"
                        required
                    />
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusLabel}>Status</Text>
                        <View style={styles.statusButtons}>
                            <TouchableOpacity
                                style={[styles.statusButton, status === 'confirmada' && styles.statusButtonActive]}
                                onPress={() => setStatus('confirmada')}
                            >
                                <Text style={[styles.statusButtonText, status === 'confirmada' && styles.statusButtonTextActive]}>
                                    Confirmada
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.statusButton, status === 'cancelada' && styles.statusButtonActive]}
                                onPress={() => setStatus('cancelada')}
                            >
                                <Text style={[styles.statusButtonText, status === 'cancelada' && styles.statusButtonTextActive]}>
                                    Cancelada
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.statusButton, status === 'concluida' && styles.statusButtonActive]}
                                onPress={() => setStatus('concluida')}
                            >
                                <Text style={[styles.statusButtonText, status === 'concluida' && styles.statusButtonTextActive]}>
                                    Concluída
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={[styles.saveButton, salvando && styles.saveButtonDisabled]}
                    onPress={handleAtualizar}
                    disabled={salvando}
                >
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
    statusButtons: { flexDirection: 'row', gap: 8 },
    statusButton: { flex: 1, paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', alignItems: 'center' },
    statusButtonActive: { backgroundColor: '#0162B3', borderColor: '#0162B3' },
    statusButtonText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
    statusButtonTextActive: { color: '#FFFFFF' },
    saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0162B3', paddingVertical: 16, borderRadius: 12, marginTop: 16, gap: 8 },
    saveButtonDisabled: { opacity: 0.6 },
    saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
