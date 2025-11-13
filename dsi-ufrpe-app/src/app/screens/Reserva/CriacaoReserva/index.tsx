import { ActionButton } from '@/src/components/ActionButton';
import { FormInput } from '@/src/components/FormInput';
import { FormSelect, SelectOption } from '@/src/components/FormSelect';
import { InfoHeader } from '@/src/components/InfoHeader';
import { Separator } from '@/src/components/Separator';
import { useToast } from '@/src/components/ToastContext';
import { getSuccessMessage, getValidationMessage } from '@/src/utils/errorMessages';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

const CriarReserva: React.FC = () => {
    const router = useRouter();
    const { showSuccess, showError } = useToast();

    const [loading, setLoading] = useState(false);
    const [numeroQuarto, setNumeroQuarto] = useState('');
    const [clienteNome, setClienteNome] = useState('');
    const [clienteCpf, setClienteCpf] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [valorTotal, setValorTotal] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [confirmada, setConfirmada] = useState(true);

    // TODO: Buscar quartos disponíveis do banco de dados via Supabase
    // Implementação futura:
    // const [quartosDisponiveis, setQuartosDisponiveis] = useState<SelectOption[]>([]);
    // useEffect(() => {
    //     const fetchQuartos = async () => {
    //         const { data, error } = await supabase
    //             .from('quartos')
    //             .select('numero, tipo')
    //             .eq('disponivel', true)
    //             .order('numero', { ascending: true });
    //         
    //         if (data) {
    //             const options = data.map(q => ({
    //                 label: `Quarto ${q.numero} - ${q.tipo}`,
    //                 value: q.numero.toString()
    //             }));
    //             setQuartosDisponiveis(options);
    //         }
    //     };
    //     fetchQuartos();
    // }, []);

    // Lista mockada de quartos disponíveis (substituir pela query do Supabase)
    const quartosDisponiveis: SelectOption[] = [
        { label: 'Quarto 101 - Standard', value: '101' },
        { label: 'Quarto 102 - Standard', value: '102' },
        { label: 'Quarto 103 - Luxo', value: '103' },
        { label: 'Quarto 201 - Standard', value: '201' },
        { label: 'Quarto 202 - Luxo', value: '202' },
        { label: 'Quarto 203 - Suíte', value: '203' },
        { label: 'Quarto 301 - Standard', value: '301' },
        { label: 'Quarto 302 - Luxo', value: '302' },
        { label: 'Quarto 303 - Suíte', value: '303' },
        { label: 'Quarto 304 - Suíte Presidencial', value: '304' },
    ];

    // Formata data automaticamente (DD/MM/AAAA)
    const handleDateChange = (text: string, setter: (value: string) => void) => {
        const numbersOnly = text.replace(/\D/g, '');
        const limited = numbersOnly.slice(0, 8);

        let formatted = limited;
        if (limited.length >= 3) {
            formatted = `${limited.slice(0, 2)}/${limited.slice(2)}`;
        }
        if (limited.length >= 5) {
            formatted = `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
        }

        setter(formatted);
    };

    // Formata CPF automaticamente (000.000.000-00)
    const handleCpfChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const limited = numbersOnly.slice(0, 11);

        let formatted = limited;
        if (limited.length >= 4) {
            formatted = `${limited.slice(0, 3)}.${limited.slice(3)}`;
        }
        if (limited.length >= 7) {
            formatted = `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
        }
        if (limited.length >= 10) {
            formatted = `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
        }

        setClienteCpf(formatted);
    };

    // Formata valor monetário (R$ 0.000,00)
    const handleValorChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const numberValue = parseInt(numbersOnly) / 100;

        if (isNaN(numberValue)) {
            setValorTotal('');
            return;
        }

        const formatted = numberValue.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        setValorTotal(formatted);
    };

    // Valida CPF
    const validateCpf = (cpfString: string): boolean => {
        const cpfNumbers = cpfString.replace(/\D/g, '');

        if (cpfNumbers.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpfNumbers)) return false;

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpfNumbers.charAt(i)) * (10 - i);
        }
        let firstDigit = 11 - (sum % 11);
        if (firstDigit >= 10) firstDigit = 0;
        if (firstDigit !== parseInt(cpfNumbers.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpfNumbers.charAt(i)) * (11 - i);
        }
        let secondDigit = 11 - (sum % 11);
        if (secondDigit >= 10) secondDigit = 0;
        if (secondDigit !== parseInt(cpfNumbers.charAt(10))) return false;

        return true;
    };

    // Valida data
    const validateDate = (dateString: string): Date | null => {
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(dateString)) return null;

        const [day, month, year] = dateString.split('/').map(Number);
        const date = new Date(year, month - 1, day);

        if (
            date.getDate() !== day ||
            date.getMonth() !== month - 1 ||
            date.getFullYear() !== year
        ) {
            return null;
        }

        return date;
    };

    const handleSave = async () => {
        // Validações
        if (!numeroQuarto.trim()) {
            showError(getValidationMessage('numero_quarto', 'required'));
            return;
        }

        if (!clienteNome.trim()) {
            showError(getValidationMessage('name', 'required'));
            return;
        }

        if (clienteNome.trim().length < 3) {
            showError('O nome do cliente deve ter pelo menos 3 caracteres.');
            return;
        }

        if (!clienteCpf.trim()) {
            showError(getValidationMessage('cpf', 'required'));
            return;
        }

        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!cpfRegex.test(clienteCpf)) {
            showError(getValidationMessage('cpf_format', 'invalid'));
            return;
        }

        if (!validateCpf(clienteCpf)) {
            showError(getValidationMessage('cpf_digits', 'invalid'));
            return;
        }

        if (!checkIn.trim()) {
            showError(getValidationMessage('check_in', 'required'));
            return;
        }

        const checkInDate = validateDate(checkIn);
        if (!checkInDate) {
            showError('Data de check-in inválida. Use o formato DD/MM/AAAA.');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (checkInDate < today) {
            showError('A data de check-in não pode ser no passado.');
            return;
        }

        if (!checkOut.trim()) {
            showError(getValidationMessage('check_out', 'required'));
            return;
        }

        const checkOutDate = validateDate(checkOut);
        if (!checkOutDate) {
            showError('Data de check-out inválida. Use o formato DD/MM/AAAA.');
            return;
        }

        if (checkOutDate <= checkInDate) {
            showError('A data de check-out deve ser posterior à data de check-in.');
            return;
        }

        if (!valorTotal.trim()) {
            showError(getValidationMessage('valor_total', 'required'));
            return;
        }

        const valorNumerico = parseFloat(valorTotal.replace(/\./g, '').replace(',', '.'));
        if (valorNumerico <= 0) {
            showError('O valor total deve ser maior que zero.');
            return;
        }

        try {
            setLoading(true);

            const reservaData = {
                numero_quarto: numeroQuarto.trim(),
                cliente_nome: clienteNome.trim(),
                cliente_cpf: clienteCpf.replace(/\D/g, ''),
                check_in: checkIn,
                check_out: checkOut,
                valor_total: valorNumerico,
                observacoes: observacoes.trim() || null,
                status: confirmada ? 'Confirmada' : 'Pendente',
            };

            // TODO: Implementar ReservaService.create(reservaData)
            console.log('Criando reserva:', reservaData);

            showSuccess(getSuccessMessage('create'));

            setTimeout(() => {
                router.push('/screens/Reserva/ListagemReserva');
            }, 2000);
        } catch (error) {
            console.error('Erro ao criar reserva:', error);
            showError('Ocorreu um erro ao criar a reserva. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <InfoHeader entity="Reservas" onBackPress={() => router.push('/screens/Reserva/ListagemReserva')} />

            <View style={styles.content}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Título da seção */}
                    <View style={styles.titleContainer}>
                        <Ionicons name="add-circle-outline" size={24} color="#0162B3" />
                        <Text style={styles.title}>Nova Reserva</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Preencha os dados para criar uma nova reserva
                    </Text>

                    <Separator marginTop={16} marginBottom={24} />

                    {/* Formulário */}
                    <View style={styles.form}>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Número do Quarto <Text style={styles.required}>*</Text>
                            </Text>
                            <FormSelect
                                icon="home-outline"
                                placeholder="Selecione um quarto disponível"
                                value={numeroQuarto}
                                options={quartosDisponiveis}
                                onSelect={setNumeroQuarto}
                                disabled={loading}
                                helperText="Apenas quartos disponíveis são listados"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Nome Completo <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="person-outline"
                                placeholder="Nome do hóspede"
                                value={clienteNome}
                                onChangeText={setClienteNome}
                                editable={!loading}
                                maxLength={100}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                CPF <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="card-outline"
                                placeholder="000.000.000-00"
                                value={clienteCpf}
                                onChangeText={handleCpfChange}
                                editable={!loading}
                                keyboardType="numeric"
                                maxLength={14}
                                helperText="Formato: 000.000.000-00"
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.fieldGroup, styles.halfWidth]}>
                                <Text style={styles.label}>
                                    Check-in <Text style={styles.required}>*</Text>
                                </Text>
                                <FormInput
                                    icon="log-in-outline"
                                    placeholder="DD/MM/AAAA"
                                    value={checkIn}
                                    onChangeText={(text) => handleDateChange(text, setCheckIn)}
                                    editable={!loading}
                                    keyboardType="numeric"
                                    maxLength={10}
                                    helperText="Data de entrada"
                                />
                            </View>

                            <View style={[styles.fieldGroup, styles.halfWidth]}>
                                <Text style={styles.label}>
                                    Check-out <Text style={styles.required}>*</Text>
                                </Text>
                                <FormInput
                                    icon="log-out-outline"
                                    placeholder="DD/MM/AAAA"
                                    value={checkOut}
                                    onChangeText={(text) => handleDateChange(text, setCheckOut)}
                                    editable={!loading}
                                    keyboardType="numeric"
                                    maxLength={10}
                                    helperText="Data de saída"
                                />
                            </View>
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Valor Total <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="cash-outline"
                                placeholder="0.000,00"
                                value={valorTotal}
                                onChangeText={handleValorChange}
                                editable={!loading}
                                keyboardType="numeric"
                                helperText="Valor total da hospedagem"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Observações</Text>
                            <FormInput
                                icon="document-text-outline"
                                placeholder="Informações adicionais (opcional)"
                                value={observacoes}
                                onChangeText={setObservacoes}
                                editable={!loading}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        {/* Status da Reserva */}
                        <View style={styles.switchContainer}>
                            <View style={styles.switchLabel}>
                                <Ionicons
                                    name={confirmada ? "checkmark-circle" : "time-outline"}
                                    size={24}
                                    color={confirmada ? "#10B981" : "#F59E0B"}
                                />
                                <View style={styles.switchTextContainer}>
                                    <Text style={styles.switchTitle}>
                                        {confirmada ? 'Reserva Confirmada' : 'Reserva Pendente'}
                                    </Text>
                                    <Text style={styles.switchDescription}>
                                        {confirmada ? 'Cliente confirmou a reserva' : 'Aguardando confirmação do cliente'}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={confirmada}
                                onValueChange={setConfirmada}
                                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                                thumbColor={confirmada ? '#FFFFFF' : '#F3F4F6'}
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
                            {loading ? 'Criando...' : 'Criar Reserva'}
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
        </View>
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
        flexGrow: 1,
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
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfWidth: {
        flex: 1,
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

export default CriarReserva;