import { ActionButton } from '@/src/components/ActionButton';
import { FormInput } from '@/src/components/FormInput';
import { InfoHeader } from '@/src/components/InfoHeader';
import { Separator } from '@/src/components/Separator';
import { useToast } from '@/src/components/ToastContext';
import { atualizarReserva, buscarReservaPorId } from '@/src/services/reservasService';
import { getSuccessMessage } from '@/src/utils/errorMessages';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditarReserva: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();

    const [loading, setLoading] = useState(false);
    const [dataCheckin, setDataCheckin] = useState('');
    const [dataCheckout, setDataCheckout] = useState('');
    const [clienteId, setClienteId] = useState('');
    const [quartoId, setQuartoId] = useState('');
    const [clienteNome, setClienteNome] = useState('');
    const [quartoNumero, setQuartoNumero] = useState('');
    const [precoDiario, setPrecoDiario] = useState(0);
    const [valorTotal, setValorTotal] = useState('');
    const [status, setStatus] = useState('confirmada');
    const [ativa, setAtiva] = useState(true);

    // Formata a data automaticamente para DD/MM/AAAA
    const handleDateChange = (text: string, setter: (value: string) => void) => {
        const numbersOnly = text.replace(/\D/g, '');
        const limited = numbersOnly.slice(0, 8);

        // Valida e corrige o mês (1-12)
        let processedValue = limited;
        if (limited.length >= 4) {
            const month = parseInt(limited.slice(2, 4));
            let correctedMonth = limited.slice(2, 4);

            if (month > 12) {
                correctedMonth = '12';
            } else if (month === 0 && limited.length >= 4) {
                correctedMonth = '01';
            }

            processedValue = limited.slice(0, 2) + correctedMonth + limited.slice(4);
        }

        let formatted = processedValue;
        if (processedValue.length >= 3) {
            formatted = `${processedValue.slice(0, 2)}/${processedValue.slice(2)}`;
        }
        if (processedValue.length >= 5) {
            formatted = `${processedValue.slice(0, 2)}/${processedValue.slice(2, 4)}/${processedValue.slice(4)}`;
        }

        setter(formatted);
    };

    // Calcula o valor total baseado nas datas e preço diário
    const calcularValorTotal = useCallback(() => {
        if (!dataCheckin || !dataCheckout || !precoDiario) {
            return;
        }

        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(dataCheckin) || !dateRegex.test(dataCheckout)) {
            return;
        }

        const [dayIn, monthIn, yearIn] = dataCheckin.split('/').map(Number);
        const [dayOut, monthOut, yearOut] = dataCheckout.split('/').map(Number);

        const checkin = new Date(yearIn, monthIn - 1, dayIn);
        const checkout = new Date(yearOut, monthOut - 1, dayOut);

        if (checkout > checkin) {
            const diferencaDias = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24));
            const total = diferencaDias * precoDiario;
            
            // Validação de overflow
            if (total > 999999.99) {
                showError('O valor total excede o limite máximo permitido.');
                return;
            }
            
            setValorTotal(total.toFixed(2).replace('.', ','));
        }
    }, [dataCheckin, dataCheckout, precoDiario, showError]);

    // Recalcula o valor quando as datas mudarem
    React.useEffect(() => {
        calcularValorTotal();
    }, [calcularValorTotal]);

    // Carrega os dados da reserva
    const loadReserva = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await buscarReservaPorId(id as string);
            
            if (!data) {
                showError('Reserva não encontrada.');
                return;
            }
            
            // Converte as datas de YYYY-MM-DD para DD/MM/YYYY
            // Usa Date com parsing local para evitar problema de timezone
            if (data.data_checkin) {
                const dateCheckin = new Date(data.data_checkin + 'T00:00:00');
                const dia = String(dateCheckin.getDate()).padStart(2, '0');
                const mes = String(dateCheckin.getMonth() + 1).padStart(2, '0');
                const ano = dateCheckin.getFullYear();
                setDataCheckin(`${dia}/${mes}/${ano}`);
            }
            if (data.data_checkout) {
                const dateCheckout = new Date(data.data_checkout + 'T00:00:00');
                const dia = String(dateCheckout.getDate()).padStart(2, '0');
                const mes = String(dateCheckout.getMonth() + 1).padStart(2, '0');
                const ano = dateCheckout.getFullYear();
                setDataCheckout(`${dia}/${mes}/${ano}`);
            }
            
            setClienteId(data.id_cliente || '');
            setQuartoId(data.id_quarto || '');
            
            // Define nomes legíveis para exibição
            if (data.clientes) {
                setClienteNome(data.clientes.nome_completo || 'Cliente não identificado');
            } else {
                setClienteNome('Cliente não encontrado');
            }
            
            if (data.quartos) {
                const quartoInfo = `Quarto ${data.quartos.numero_quarto} - ${data.quartos.tipo}`;
                setQuartoNumero(quartoInfo);
                setPrecoDiario(data.quartos.preco_diario || 0);
            } else {
                setQuartoNumero('Quarto não encontrado');
                setPrecoDiario(0);
            }
            
            setValorTotal(data.valor_total?.toFixed(2).replace('.', ',') || '');
            setStatus(data.status || 'confirmada');
            
            // Define ativa baseado no status
            setAtiva(data.status !== 'Cancelada' && data.status !== 'cancelada');
        } catch (error) {
            console.error('Erro ao carregar reserva:', error);
            showError('Não foi possível carregar os dados da reserva.');
        } finally {
            setLoading(false);
        }
    }, [id, showError]);

    useFocusEffect(
        useCallback(() => {
            loadReserva();
        }, [loadReserva])
    );

    const handleSave = async () => {
        // Validações
        if (!dataCheckin.trim()) {
            showError('A data de check-in é obrigatória.');
            return;
        }

        if (!dataCheckout.trim()) {
            showError('A data de check-out é obrigatória.');
            return;
        }

        // Valida formato das datas
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(dataCheckin)) {
            showError('Data de check-in inválida. Use o formato DD/MM/AAAA.');
            return;
        }

        if (!dateRegex.test(dataCheckout)) {
            showError('Data de check-out inválida. Use o formato DD/MM/AAAA.');
            return;
        }

        // Valida se são datas válidas
        const [dayIn, monthIn, yearIn] = dataCheckin.split('/').map(Number);
        const dateIn = new Date(yearIn, monthIn - 1, dayIn);
        if (
            dateIn.getDate() !== dayIn ||
            dateIn.getMonth() !== monthIn - 1 ||
            dateIn.getFullYear() !== yearIn
        ) {
            showError('Data de check-in inválida. Verifique o dia e mês informados.');
            return;
        }

        const [dayOut, monthOut, yearOut] = dataCheckout.split('/').map(Number);
        const dateOut = new Date(yearOut, monthOut - 1, dayOut);
        if (
            dateOut.getDate() !== dayOut ||
            dateOut.getMonth() !== monthOut - 1 ||
            dateOut.getFullYear() !== yearOut
        ) {
            showError('Data de check-out inválida. Verifique o dia e mês informados.');
            return;
        }

        // Valida se check-out é posterior ao check-in
        if (dateOut <= dateIn) {
            showError('A data de check-out deve ser posterior à data de check-in.');
            return;
        }

        if (!valorTotal.trim()) {
            showError('O valor total é obrigatório.');
            return;
        }

        const valorNum = parseFloat(valorTotal.replace(/\./g, '').replace(',', '.'));
        if (valorNum <= 0) {
            showError('O valor total deve ser maior que zero.');
            return;
        }

        try {
            setLoading(true);

            // Converte as datas de DD/MM/YYYY para YYYY-MM-DD
            const [diaIn, mesIn, anoIn] = dataCheckin.split('/');
            const dataCheckinFormatada = `${anoIn}-${mesIn}-${diaIn}`;
            const [diaOut, mesOut, anoOut] = dataCheckout.split('/');
            const dataCheckoutFormatada = `${anoOut}-${mesOut}-${diaOut}`;

            const reservaData = {
                data_checkin: dataCheckinFormatada,
                data_checkout: dataCheckoutFormatada,
                valor_total: parseFloat(valorTotal.replace(/\./g, '').replace(',', '.')),
                status: ativa ? (status === 'Cancelada' || status === 'cancelada' ? 'Confirmada' : status) : 'Cancelada',
            };

            await atualizarReserva(id as string, reservaData);

            showSuccess(getSuccessMessage('update'));

            setTimeout(() => {
                router.back();
            }, 1500);
        } catch (error) {
            console.error('Erro ao salvar reserva:', error);
            showError('Ocorreu um erro ao salvar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <InfoHeader entity="Reservas" action="Edição" onBackPress={() => router.push('/screens/Reserva/ListagemReserva')} />

            <View style={styles.content}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Título da seção */}
                    <View style={styles.titleContainer}>
                        <Ionicons name="create-outline" size={24} color="#0162B3" />
                        <Text style={styles.title}>Editar Reserva</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Atualize as informações da reserva
                    </Text>

                    <Separator marginTop={16} marginBottom={24} />

                    {/* Formulário */}
                    <View style={styles.form}>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Cliente <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="person-outline"
                                placeholder="Nome do cliente"
                                value={clienteNome}
                                onChangeText={() => {}}
                                editable={false}
                                helperText="Cliente vinculado à reserva (não editável)"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Quarto <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="bed-outline"
                                placeholder="Número e tipo do quarto"
                                value={quartoNumero}
                                onChangeText={() => {}}
                                editable={false}
                                helperText="Quarto vinculado à reserva (não editável)"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Data de Check-in <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="calendar-outline"
                                placeholder="DD/MM/AAAA"
                                value={dataCheckin}
                                onChangeText={(text) => handleDateChange(text, setDataCheckin)}
                                editable={!loading}
                                keyboardType="numeric"
                                maxLength={10}
                                helperText="Data de entrada no hotel"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Data de Check-out <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="calendar-outline"
                                placeholder="DD/MM/AAAA"
                                value={dataCheckout}
                                onChangeText={(text) => handleDateChange(text, setDataCheckout)}
                                editable={!loading}
                                keyboardType="numeric"
                                maxLength={10}
                                helperText="Data de saída do hotel"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Valor Total <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="cash-outline"
                                placeholder="0,00"
                                value={valorTotal}
                                onChangeText={() => {}}
                                editable={false}
                                keyboardType="numeric"
                                helperText="Calculado automaticamente (dias × preço diário)"
                            />
                        </View>

                        {/* Status da Reserva */}
                        <View style={styles.switchContainer}>
                            <View style={styles.switchLabel}>
                                <Ionicons
                                    name={ativa ? "checkmark-circle" : "close-circle"}
                                    size={24}
                                    color={ativa ? "#10B981" : "#6B7280"}
                                />
                                <View style={styles.switchTextContainer}>
                                    <Text style={styles.switchTitle}>Reserva Ativa</Text>
                                    <Text style={styles.switchDescription}>
                                        {ativa ? 'Esta reserva está ativa' : 'Esta reserva está cancelada'}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={ativa}
                                onValueChange={setAtiva}
                                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                                thumbColor={ativa ? '#FFFFFF' : '#F3F4F6'}
                                disabled={loading}
                            />
                        </View>
                    </View>

                    <Separator marginTop={24} marginBottom={16} />

                    {/* Botões de ação */}
                    <View style={styles.actions}>
                        <ActionButton
                            variant="primary"
                            icon="checkmark-circle-outline"
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </ActionButton>

                        <ActionButton
                            variant="secondary"
                            icon="close-circle-outline"
                            onPress={() => router.push('/screens/Reserva/ListagemReserva')}
                            disabled={loading}
                        >
                            Cancelar
                        </ActionButton>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#132F3B',
    },
    content: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 0,
        padding: 20,
        paddingBottom: 40,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#132F3B',
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
    },
    form: {
        gap: 20,
    },
    fieldGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 4,
    },
    required: {
        color: '#EF4444',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    switchLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    switchTextContainer: {
        flex: 1,
        gap: 4,
    },
    switchTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#132F3B',
    },
    switchDescription: {
        fontSize: 12,
        color: '#64748B',
    },
    actions: {
        gap: 12,
    },
});

export default EditarReserva;