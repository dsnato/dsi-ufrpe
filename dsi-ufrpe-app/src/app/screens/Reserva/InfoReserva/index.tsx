import { ErrorState } from '@/src/components/ErrorState';
import { Loading } from '@/src/components/Loading';
import { ReservationService } from '@/src/services/ReservationService';
import { Reservation } from '@/src/types/reservation';
import { formatCurrency, formatDate, withPlaceholder } from '@/src/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const InfoReserva: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    // Estados
    const [reserva, setReserva] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * ✅ REQUISITO 1: Carregamento dos dados usando ID da URL
     * ✅ REQUISITO 6: Atualização automática após retornar da edição (useFocusEffect)
     */
    const loadReserva = useCallback(async () => {
        if (!id) {
            setError('ID da reserva não fornecido');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const data = await ReservationService.getById(id);

        if (!data) {
            setError('Reserva não encontrada');
            setLoading(false);
            return;
        }

        setReserva(data);
        setLoading(false);
    }, [id]);

    // Recarrega os dados sempre que a tela receber foco
    useFocusEffect(
        useCallback(() => {
            loadReserva();
        }, [loadReserva])
    );

    /**
     * ✅ REQUISITO 5: Modal de confirmação antes de excluir
     */
    const handleDelete = () => {
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
                        const success = await ReservationService.delete(id);

                        if (success) {
                            Alert.alert(
                                "Sucesso",
                                "Reserva excluída com sucesso!",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => router.push("/screens/Reserva/ListagemReserva")
                                    }
                                ]
                            );
                        } else {
                            Alert.alert(
                                "Erro",
                                "Não foi possível excluir a reserva. Tente novamente."
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
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push("/screens/Reserva/ListagemReserva")} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.breadcrumb}>
                        <Text style={styles.breadcrumbText}>Reservas</Text>
                        <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                        <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                    </View>
                </View>
                <View style={styles.subContainer}>
                    <Loading message="Carregando reserva..." />
                </View>
            </View>
        );
    }

    /**
     * ✅ REQUISITO 3: Mensagem de erro amigável se não encontrada
     */
    if (error || !reserva) {
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
                <View style={styles.subContainer}>
                    <ErrorState
                        message={error || 'Reserva não encontrada'}
                        onRetry={loadReserva}
                        onGoBack={() => router.push("/screens/Reserva/ListagemReserva")}
                    />
                </View>
            </View>
        );
    }

    // Mapear cores do status
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmada': return '#FFE157';
            case 'Ativa': return '#10B981';
            case 'Finalizada': return '#6B7280';
            case 'Cancelada': return '#EF4444';
            default: return '#6B7280';
        }
    };

    return (
        <View style={styles.container}>
            {/* ✅ REQUISITO 9: Breadcrumb/indicador de navegação */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/screens/Reserva/ListagemReserva")} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.breadcrumb}>
                    <Text style={styles.breadcrumbText}>Reservas</Text>
                    <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                    <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                </View>
            </View>

            {/* Container branco com informações */}
            <View style={styles.subContainer}>
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Título da reserva com badge de status */}
                    <View style={styles.reservaTitleContainer}>
                        <View style={styles.titleRow}>
                            {/* ✅ REQUISITO 7 e 8: Formatação e tratamento de valores vazios */}
                            <Text style={styles.reservaTitle}>
                                Reserva {withPlaceholder(reserva.id, 'S/N')}
                            </Text>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(reserva.status) }
                            ]}>
                                <Text style={styles.statusText}>{reserva.status}</Text>
                            </View>
                        </View>
                        <Text style={styles.reservaSubtitle}>Número da reserva</Text>

                        {/* Linha divisória entre título e informações */}
                        <View style={styles.titleSeparator} />
                    </View>

                    {/* ✅ REQUISITO 7 e 8: Informações formatadas com placeholders */}
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>DATA DE CHECK-IN</Text>
                            <Text style={styles.infoValue}>{formatDate(reserva.check_in_date)}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>DATA DE CHECK-OUT</Text>
                            <Text style={styles.infoValue}>{formatDate(reserva.check_out_date)}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="bed-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>QUARTO</Text>
                            <Text style={styles.infoValue}>
                                {withPlaceholder(reserva.room_id, 'Não informado')}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="cash-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>VALOR TOTAL</Text>
                            <Text style={styles.infoValue}>{formatCurrency(reserva.total_amount)}</Text>
                        </View>
                    </View>

                    {reserva.pending_amount > 0 && (
                        <View style={styles.infoRow}>
                            <Ionicons name="alert-circle-outline" size={20} color="#F59E0B" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>VALOR PENDENTE</Text>
                                <Text style={[styles.infoValue, { color: '#F59E0B' }]}>
                                    {formatCurrency(reserva.pending_amount)}
                                </Text>
                            </View>
                        </View>
                    )}

                    {reserva.actual_check_in && (
                        <View style={styles.infoRow}>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>CHECK-IN REALIZADO</Text>
                                <Text style={styles.infoValue}>{formatDate(reserva.actual_check_in)}</Text>
                            </View>
                        </View>
                    )}

                    {reserva.actual_check_out && (
                        <View style={styles.infoRow}>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#6B7280" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>CHECK-OUT REALIZADO</Text>
                                <Text style={styles.infoValue}>{formatDate(reserva.actual_check_out)}</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>
                <View style={styles.titleSeparator} />

                {/* Botões de ação */}
                <View style={styles.options}>
                    {/* Botões de Check-in/Check-out */}
                    {reserva.status === 'Confirmada' && (
                        <TouchableOpacity style={styles.buttonSuccess}>
                            <Ionicons name="log-in-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            <Text style={styles.buttonSuccessText}>Confirmar Check-in</Text>
                        </TouchableOpacity>
                    )}

                    {reserva.status === 'Ativa' && (
                        <TouchableOpacity style={styles.buttonWarning}>
                            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            <Text style={styles.buttonWarningText}>Confirmar Check-out</Text>
                        </TouchableOpacity>
                    )}

                    {/* ✅ REQUISITO 4: Botão editar com ID correto */}
                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={() => router.push({
                            pathname: "/screens/Reserva/EdicaoReserva",
                            params: { id: reserva.id }
                        })}
                    >
                        <Ionicons name="create-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonPrimaryText}>Editar Reserva</Text>
                    </TouchableOpacity>

                    {/* ✅ REQUISITO 5: Modal de confirmação implementado */}
                    <TouchableOpacity style={styles.buttonDanger} onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={20} color="#EF4444" style={styles.buttonIcon} />
                        <Text style={styles.buttonDangerText}>Excluir</Text>
                    </TouchableOpacity>
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
    reservaTitleContainer: {
        marginBottom: 24,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    reservaTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1E293B',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginLeft: 12,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    reservaSubtitle: {
        fontSize: 16,
        color: '#64748B',
        textTransform: 'uppercase',
    },
    titleSeparator: {
        width: '100%',
        height: 1,
        backgroundColor: '#E2E8F0',
        marginTop: 20,
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
    buttonSuccess: {
        width: '100%',
        height: 48,
        backgroundColor: '#10B981',
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
    buttonSuccessText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonWarning: {
        width: '100%',
        height: 48,
        backgroundColor: '#F59E0B',
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
    buttonWarningText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
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


export default InfoReserva;