import { ActionButton } from '@/src/components/ActionButton';
import { ErrorState } from '@/src/components/ErrorState';
import { InfoHeader } from '@/src/components/InfoHeader';
import { InfoRow } from '@/src/components/InfoRow';
import { Loading } from '@/src/components/Loading';
import { StatusBadge } from '@/src/components/StatusBadge';
import { TitleSection } from '@/src/components/TitleSection';
import { useToast } from '@/src/components/ToastContext';
import { buscarReservaPorId, excluirReserva, realizarCheckin, realizarCheckout, Reserva } from '@/src/services/reservasService';
import { formatCurrency, formatDate, withPlaceholder } from '@/src/utils/formatters';
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const InfoReserva: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();

    // Estados
    const [reserva, setReserva] = useState<Reserva | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            setShowDeleteConfirm(false);
            setLoading(true);
            
            await excluirReserva(id as string);
            
            showSuccess('Reserva excluída com sucesso!');
            
            setTimeout(() => {
                router.push("/screens/Reserva/ListagemReserva");
            }, 1500);
        } catch (error: any) {
            showError(`Erro ao excluir: ${error?.message || 'Erro desconhecido'}`);
            setLoading(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    /**
     * Realizar check-in
     */
    const handleCheckin = async () => {
        if (!reserva?.id || !reserva?.id_quarto) return;

        try {
            setLoading(true);
            await realizarCheckin(reserva.id, reserva.id_quarto);
            showSuccess('Check-in realizado com sucesso!');
            await loadReserva();
        } catch (error: any) {
            showError(`Erro ao realizar check-in: ${error?.message || 'Erro desconhecido'}`);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Realizar check-out
     */
    const handleCheckout = async () => {
        if (!reserva?.id || !reserva?.id_quarto) return;

        try {
            setLoading(true);
            await realizarCheckout(reserva.id, reserva.id_quarto);
            showSuccess('Check-out realizado com sucesso!');
            await loadReserva();
        } catch (error: any) {
            showError(`Erro ao realizar check-out: ${error?.message || 'Erro desconhecido'}`);
        } finally {
            setLoading(false);
        }
    };

    /**
     * ✅ REQUISITO 2: Exibição de loading durante busca
     */
    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <InfoHeader entity="Reservas" onBackPress={() => router.back()} />
                <View style={styles.subContainer}>
                    <Loading message="Carregando reserva..." />
                </View>
            </SafeAreaView>
        );
    }

    /**
     * ✅ REQUISITO 3: Mensagem de erro amigável se não encontrada
     */
    if (error || !reserva) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <InfoHeader entity="Reservas" onBackPress={() => router.back()} />
                <View style={styles.subContainer}>
                    <ErrorState
                        message={error || 'Reserva não encontrada'}
                        onRetry={loadReserva}
                        onGoBack={() => router.push("/screens/Reserva/ListagemReserva")}
                    />
                </View>
            </SafeAreaView>
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
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* ✅ REQUISITO 9: Breadcrumb/indicador de navegação */}
            <InfoHeader entity="Reservas" onBackPress={() => router.back()} />

            {/* Container branco com informações */}
            <View style={styles.subContainer}>
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Título da reserva com badge de status */}
                    <TitleSection
                        title={`Quarto ${withPlaceholder(reserva.quartos?.numero_quarto, 'S/N')}`}
                        subtitle="Número do quarto"
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
                            value={withPlaceholder(reserva.quartos?.numero_quarto, 'Não informado')}
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
                            onPress={handleCheckin}
                            disabled={loading}
                        >
                            Confirmar Check-in
                        </ActionButton>
                    )}

                    {reserva.status === 'Ativa' && (
                        <ActionButton
                            variant="warning"
                            icon="log-out-outline"
                            onPress={handleCheckout}
                            disabled={loading}
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

            {/* Modal de Confirmação de Exclusão */}
            {showDeleteConfirm && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
                        <Text style={styles.modalMessage}>
                            Tem certeza que deseja excluir esta reserva? Esta ação não pode ser desfeita.
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
        </SafeAreaView>)
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
})


export default InfoReserva;