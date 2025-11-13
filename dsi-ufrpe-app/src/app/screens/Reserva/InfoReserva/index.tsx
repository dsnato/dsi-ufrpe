import { ActionButton } from '@/src/components/ActionButton';
import { ErrorState } from '@/src/components/ErrorState';
import { InfoHeader } from '@/src/components/InfoHeader';
import { InfoRow } from '@/src/components/InfoRow';
import { Loading } from '@/src/components/Loading';
import { StatusBadge } from '@/src/components/StatusBadge';
import { TitleSection } from '@/src/components/TitleSection';
import { buscarReservaPorId, excluirReserva, Reserva } from '@/src/services/reservasService';
import { formatCurrency, formatDate, withPlaceholder } from '@/src/utils/formatters';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

const InfoReserva: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    // Estados
    const [reserva, setReserva] = useState<Reserva | null>(null);
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

        const data = await buscarReservaPorId(id as string);

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
                        try {
                            await excluirReserva(id as string);
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
                        } catch (error) {
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
                <InfoHeader entity="Reservas" onBackPress={() => router.back()} />
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
                <InfoHeader entity="Reservas" onBackPress={() => router.back()} />
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
            <InfoHeader entity="Reservas" onBackPress={() => router.back()} />

            {/* Container branco com informações */}
            <View style={styles.subContainer}>
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Título da reserva com badge de status */}
                    <TitleSection
                        title={`Reserva ${withPlaceholder(reserva.id, 'S/N')}`}
                        subtitle="Número da reserva"
                        badge={
                            <StatusBadge
                                text={reserva.status || 'Pendente'}
                                color={getStatusColor(reserva.status || 'Pendente')}
                            />
                        }
                    />

                    {/* ✅ REQUISITO 7 e 8: Informações formatadas com placeholders */}
                    <InfoRow
                        icon="calendar-outline"
                        label="DATA DE CHECK-IN"
                        value={formatDate(reserva.data_checkin)}
                    />

                    <InfoRow
                        icon="calendar-outline"
                        label="DATA DE CHECK-OUT"
                        value={formatDate(reserva.data_checkout)}
                    />

                    <InfoRow
                        icon="bed-outline"
                        label="QUARTO"
                        value={withPlaceholder(reserva.id_quarto, 'Não informado')}
                    />

                    <InfoRow
                        icon="cash-outline"
                        label="VALOR TOTAL"
                        value={formatCurrency(reserva.valor_total || 0)}
                    />

                    <InfoRow
                        icon="people-outline"
                        label="NÚMERO DE HÓSPEDES"
                        value={`${reserva.numero_hospedes || 0} ${reserva.numero_hospedes === 1 ? 'pessoa' : 'pessoas'}`}
                    />

                    {reserva.observacoes && (
                        <InfoRow
                            icon="document-text-outline"
                            label="OBSERVAÇÕES"
                            value={withPlaceholder(reserva.observacoes, 'Sem observações')}
                        />
                    )}

                    {reserva.checkin_realizado_em && (
                        <InfoRow
                            icon="checkmark-circle-outline"
                            label="CHECK-IN REALIZADO"
                            value={formatDate(reserva.checkin_realizado_em)}
                            iconColor="#10B981"
                        />
                    )}

                    {reserva.checkout_realizado_em && (
                        <InfoRow
                            icon="checkmark-circle-outline"
                            label="CHECK-OUT REALIZADO"
                            value={formatDate(reserva.checkout_realizado_em)}
                            iconColor="#6B7280"
                        />
                    )}
                </ScrollView>

                {/* Botões de ação */}
                <View style={styles.options}>
                    {/* Botões de Check-in/Check-out */}
                    {reserva.status === 'Confirmada' && (
                        <ActionButton
                            variant="success"
                            icon="log-in-outline"
                        >
                            Confirmar Check-in
                        </ActionButton>
                    )}

                    {reserva.status === 'Ativa' && (
                        <ActionButton
                            variant="warning"
                            icon="log-out-outline"
                        >
                            Confirmar Check-out
                        </ActionButton>
                    )}

                    {/* ✅ REQUISITO 4: Botão editar com ID correto */}
                    <ActionButton
                        variant="primary"
                        icon="create-outline"
                        onPress={() => router.push({
                            pathname: "/screens/Reserva/EdicaoReserva",
                            params: { id: reserva.id }
                        })}
                    >
                        Editar Reserva
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
        flexGrow: 0,
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