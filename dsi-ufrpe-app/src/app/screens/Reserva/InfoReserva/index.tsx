import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { buscarReservaPorId, excluirReserva, realizarCheckin, realizarCheckout } from '@/src/services/reservasService';
import type { Reserva } from '@/src/services/reservasService';
import { useToast } from '@/src/components/ToastContext';

export default function InfoReserva() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();

    const [reserva, setReserva] = useState<Reserva | null>(null);
    const [loading, setLoading] = useState(true);
    const [processando, setProcessando] = useState(false);

    const carregarReserva = useCallback(async () => {
        if (!id) {
            Alert.alert('Erro', 'ID da reserva não fornecido');
            router.back();
            return;
        }

        try {
            setLoading(true);
            const data = await buscarReservaPorId(id);
            
            if (!data) {
                Alert.alert('Erro', 'Reserva não encontrada');
                router.back();
                return;
            }

            setReserva(data);
        } catch (error) {
            console.error('Erro ao carregar reserva:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados da reserva');
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useFocusEffect(
        useCallback(() => {
            carregarReserva();
        }, [carregarReserva])
    );

    const handleCheckin = async () => {
        try {
            setProcessando(true);
            await realizarCheckin(id);
            Alert.alert('Sucesso', 'Check-in realizado com sucesso!');
            carregarReserva();
        } catch (error) {
            console.error('Erro ao realizar check-in:', error);
            Alert.alert('Erro', 'Não foi possível realizar o check-in');
        } finally {
            setProcessando(false);
        }
    };

    const handleCheckout = async () => {
        try {
            setProcessando(true);
            await realizarCheckout(id);
            Alert.alert('Sucesso', 'Check-out realizado com sucesso!');
            carregarReserva();
        } catch (error) {
            console.error('Erro ao realizar check-out:', error);
            Alert.alert('Erro', 'Não foi possível realizar o check-out');
        } finally {
            setProcessando(false);
        }
    };

    const handleExcluir = () => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir esta reserva? Esta ação não pode ser desfeita.",
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
                            await excluirReserva(id);
                            showSuccess('Reserva excluída com sucesso!');
                            router.push("/screens/Reserva/ListagemReserva");
                        } catch (error) {
                            console.error('Erro ao excluir reserva:', error);
                            showError('Não foi possível excluir a reserva');
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
                        <Text style={styles.breadcrumbText}>Reservas</Text>
                        <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                        <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                    </View>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0162B3" />
                    <Text style={styles.loadingText}>Carregando...</Text>
                </View>
            </View>
        );
    }

    if (!reserva) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.breadcrumb}>
                        <Text style={styles.breadcrumbText}>Reservas</Text>
                        <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                        <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                    </View>
                </View>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#DC2626" />
                    <Text style={styles.errorText}>Reserva não encontrada</Text>
                </View>
            </View>
        );
    }

    const formatarData = (data: string) => {
        if (!data) return '-';
        try {
            const d = new Date(data);
            return d.toLocaleDateString('pt-BR');
        } catch {
            return data;
        }
    };

    const formatarValor = (valor: number) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.breadcrumb}>
                    <Text style={styles.breadcrumbText}>Reservas</Text>
                    <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                    <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                </View>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="information-circle" size={24} color="#0162B3" />
                        <Text style={styles.cardTitle}>Informações da Reserva</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Status:</Text>
                        <View style={[styles.statusBadge, styles[`status${reserva.status}`]]}>
                            <Text style={styles.statusText}>{reserva.status}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Check-in:</Text>
                        <Text style={styles.value}>{formatarData(reserva.data_checkin)}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Check-out:</Text>
                        <Text style={styles.value}>{formatarData(reserva.data_checkout)}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Valor Total:</Text>
                        <Text style={styles.valueHighlight}>{formatarValor(reserva.valor_total)}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Observações:</Text>
                        <Text style={styles.value}>{reserva.observacoes || '-'}</Text>
                    </View>
                </View>

                <View style={styles.actionsCard}>
                    <Text style={styles.actionsSectionTitle}>Ações</Text>

                    {reserva.status === 'confirmada' && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.checkinButton]}
                            onPress={handleCheckin}
                            disabled={processando}
                        >
                            {processando ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <>
                                    <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
                                    <Text style={styles.actionButtonText}>Realizar Check-in</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}

                    {reserva.status === 'checkin_realizado' && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.checkoutButton]}
                            onPress={handleCheckout}
                            disabled={processando}
                        >
                            {processando ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <>
                                    <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
                                    <Text style={styles.actionButtonText}>Realizar Check-out</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => router.push(`/screens/Reserva/EdicaoReserva?id=${id}`)}
                    >
                        <Ionicons name="create-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Editar Reserva</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={handleExcluir}
                    >
                        <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Excluir Reserva</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
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
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    backButton: {
        marginRight: 16,
    },
    breadcrumb: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    breadcrumbText: {
        fontSize: 14,
        color: '#E0F2FE',
    },
    breadcrumbTextActive: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748B',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    errorText: {
        marginTop: 16,
        fontSize: 18,
        color: '#DC2626',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    card: {
        margin: 16,
        padding: 16,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    label: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '600',
    },
    valueHighlight: {
        fontSize: 16,
        color: '#0162B3',
        fontWeight: '700',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusconfirmada: {
        backgroundColor: '#DBEAFE',
    },
    statuscheckin_realizado: {
        backgroundColor: '#D1FAE5',
    },
    statuscheckout_realizado: {
        backgroundColor: '#E0E7FF',
    },
    statuscancelada: {
        backgroundColor: '#FEE2E2',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1E293B',
        textTransform: 'capitalize',
    },
    actionsCard: {
        margin: 16,
        marginTop: 0,
        padding: 16,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    actionsSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        gap: 8,
    },
    checkinButton: {
        backgroundColor: '#10B981',
    },
    checkoutButton: {
        backgroundColor: '#6366F1',
    },
    editButton: {
        backgroundColor: '#0162B3',
    },
    deleteButton: {
        backgroundColor: '#DC2626',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});
