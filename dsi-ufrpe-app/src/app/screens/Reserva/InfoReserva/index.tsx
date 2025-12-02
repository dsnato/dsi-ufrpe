import { supabase } from '@/lib/supabase';
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
import React, { useCallback, useMemo, useState } from 'react';
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
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Paleta de cores
    const palettes = useMemo(() => ({
        light: {
            background: '#132F3B',
            content: '#F8FAFC',
            text: '#132F3B',
            textSecondary: '#64748B',
            icon: '#0162B3',
            breadcrumb: '#E0F2FE',
            accent: '#FFE157',
            backIcon: '#FFFFFF',
            modalOverlay: 'rgba(0, 0, 0, 0.5)',
            modalBg: '#FFFFFF',
            modalText: '#132F3B',
        },
        dark: {
            background: '#050C18',
            content: '#0B1624',
            text: '#F1F5F9',
            textSecondary: '#94A3B8',
            icon: '#60A5FA',
            breadcrumb: '#94A3B8',
            accent: '#FDE047',
            backIcon: '#E2E8F0',
            modalOverlay: 'rgba(0, 0, 0, 0.7)',
            modalBg: '#1E293B',
            modalText: '#F1F5F9',
        }
    }), []);

    const theme = useMemo(() => palettes[isDarkMode ? 'dark' : 'light'], [isDarkMode, palettes]);

    const loadThemePreference = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const preferredTheme = user.user_metadata?.preferred_theme;
            setIsDarkMode(preferredTheme === 'dark');
        } catch (error) {
            console.error('Erro ao carregar tema:', error);
        }
    }, []);

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
            loadThemePreference();
            loadReserva();
        }, [loadReserva, loadThemePreference])
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
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
                <InfoHeader
                    entity="Reservas"
                    onBackPress={() => router.back()}
                    colors={{
                        background: theme.background,
                        breadcrumb: theme.breadcrumb,
                        accent: theme.accent,
                        backIcon: theme.backIcon,
                    }}
                />
                <View style={[styles.subContainer, { backgroundColor: theme.content }]}>
                    <Loading message="Carregando reserva..." isDarkMode={isDarkMode} />
                </View>
            </SafeAreaView>
        );
    }

    /**
     * ✅ REQUISITO 3: Mensagem de erro amigável se não encontrada
     */
    if (error || !reserva) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
                <InfoHeader
                    entity="Reservas"
                    onBackPress={() => router.back()}
                    colors={{
                        background: theme.background,
                        breadcrumb: theme.breadcrumb,
                        accent: theme.accent,
                        backIcon: theme.backIcon,
                    }}
                />
                <View style={[styles.subContainer, { backgroundColor: theme.content }]}>
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
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            {/* ✅ REQUISITO 9: Breadcrumb/indicador de navegação */}
            <InfoHeader
                entity="Reservas"
                onBackPress={() => router.back()}
                colors={{
                    background: theme.background,
                    breadcrumb: theme.breadcrumb,
                    accent: theme.accent,
                    backIcon: theme.backIcon,
                }}
            />

            {/* Container branco com informações */}
            <View style={[styles.subContainer, { backgroundColor: theme.content }]}>
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
                        titleColor={theme.text}
                        subtitleColor={theme.textSecondary}
                    />

                    {/* ✅ REQUISITO 7 e 8: Informações formatadas com placeholders */}
                    <InfoRow
                        icon="calendar-outline"
                        label="DATA DE CHECK-IN"
                        value={formatDate(reserva.data_checkin)}
                        iconColor={theme.icon}
                        labelColor={theme.textSecondary}
                        valueColor={theme.text}
                    />

                    <InfoRow
                        icon="calendar-outline"
                        label="DATA DE CHECK-OUT"
                        value={formatDate(reserva.data_checkout)}
                        iconColor={theme.icon}
                        labelColor={theme.textSecondary}
                        valueColor={theme.text}
                    />

                    <InfoRow
                        icon="cash-outline"
                        label="VALOR TOTAL"
                        value={formatCurrency(reserva.valor_total || 0)}
                        iconColor={theme.icon}
                        labelColor={theme.textSecondary}
                        valueColor={theme.text}
                    />

                    <InfoRow
                        icon="people-outline"
                        label="NÚMERO DE HÓSPEDES"
                        value={`${reserva.numero_hospedes || 0} ${reserva.numero_hospedes === 1 ? 'pessoa' : 'pessoas'}`}
                        iconColor={theme.icon}
                        labelColor={theme.textSecondary}
                        valueColor={theme.text}
                    />

                    {reserva.observacoes && (
                        <InfoRow
                            icon="document-text-outline"
                            label="OBSERVAÇÕES"
                            value={withPlaceholder(reserva.observacoes, 'Sem observações')}
                            iconColor={theme.icon}
                            labelColor={theme.textSecondary}
                            valueColor={theme.text}
                        />
                    )}

                    {reserva.checkin_realizado_em && (
                        <InfoRow
                            icon="checkmark-circle-outline"
                            label="CHECK-IN REALIZADO"
                            value={formatDate(reserva.checkin_realizado_em)}
                            iconColor="#10B981"
                            labelColor={theme.textSecondary}
                            valueColor={theme.text}
                        />
                    )}

                    {reserva.checkout_realizado_em && (
                        <InfoRow
                            icon="checkmark-circle-outline"
                            label="CHECK-OUT REALIZADO"
                            value={formatDate(reserva.checkout_realizado_em)}
                            iconColor="#6B7280"
                            labelColor={theme.textSecondary}
                            valueColor={theme.text}
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
                            tone={isDarkMode ? 'dark' : 'light'}
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
                            tone={isDarkMode ? 'dark' : 'light'}
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
                        tone={isDarkMode ? 'dark' : 'light'}
                    >
                        Editar Reserva
                    </ActionButton>

                    {/* ✅ REQUISITO 5: Modal de confirmação implementado */}
                    <ActionButton
                        variant="danger"
                        icon="trash-outline"
                        onPress={handleDelete}
                        tone={isDarkMode ? 'dark' : 'light'}
                    >
                        Excluir
                    </ActionButton>
                </View>
            </View>

            {/* Modal de Confirmação de Exclusão */}
            {showDeleteConfirm && (
                <View style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}>
                    <View style={[styles.modalContent, { backgroundColor: theme.modalBg }]}>
                        <Text style={[styles.modalTitle, { color: theme.modalText }]}>Confirmar Exclusão</Text>
                        <Text style={[styles.modalMessage, { color: theme.modalText }]}>
                            Tem certeza que deseja excluir esta reserva? Esta ação não pode ser desfeita.
                        </Text>
                        <View style={styles.modalButtons}>
                            <ActionButton
                                variant="secondary"
                                onPress={cancelDelete}
                                style={styles.modalButton}
                                tone={isDarkMode ? 'dark' : 'light'}
                            >
                                Cancelar
                            </ActionButton>
                            <ActionButton
                                variant="danger"
                                onPress={confirmDelete}
                                style={styles.modalButton}
                                tone={isDarkMode ? 'dark' : 'light'}
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
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
        opacity: 0.7,
    },
    breadcrumbTextActive: {
        fontSize: 14,
        fontWeight: '600',
    },
    subContainer: {
        flex: 1,
        width: '100%',
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
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
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
        marginBottom: 12,
    },
    modalMessage: {
        fontSize: 16,
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
