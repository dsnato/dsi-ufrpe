import { ActionButton } from '@/src/components/ActionButton';
import { FormInput } from '@/src/components/FormInput';
import { FormSelect, SelectOption } from '@/src/components/FormSelect';
import { InfoHeader } from '@/src/components/InfoHeader';
import { Separator } from '@/src/components/Separator';
import { useToast } from '@/src/components/ToastContext';
import { buscarClientePorCPF } from '@/src/services/clientesService';
import { listarQuartos } from '@/src/services/quartosService';
import { criarReserva } from '@/src/services/reservasService';
import { getSuccessMessage, getValidationMessage } from '@/src/utils/errorMessages';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CriarReserva: React.FC = () => {
    const router = useRouter();
    const { showSuccess, showError } = useToast();

    const [loading, setLoading] = useState(false);
    const [numeroQuarto, setNumeroQuarto] = useState('');
    const [clienteNome, setClienteNome] = useState('');
    const [clienteCpf, setClienteCpf] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [confirmada, setConfirmada] = useState(true);
    const [quartosDisponiveis, setQuartosDisponiveis] = useState<SelectOption[]>([]);
    const [quartosData, setQuartosData] = useState<any[]>([]);
    const [loadingQuartos, setLoadingQuartos] = useState(false);

    // Calcula o valor total baseado nas datas e no quarto selecionado
    const calcularValorTotal = useCallback(() => {
        if (!checkIn || !checkOut || !numeroQuarto) {
            return 0;
        }

        // Valida as datas
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(checkIn) || !dateRegex.test(checkOut)) {
            return 0;
        }

        const [dayIn, monthIn, yearIn] = checkIn.split('/').map(Number);
        const dateIn = new Date(yearIn, monthIn - 1, dayIn);
        
        const [dayOut, monthOut, yearOut] = checkOut.split('/').map(Number);
        const dateOut = new Date(yearOut, monthOut - 1, dayOut);

        // Valida se são datas válidas
        if (
            dateIn.getDate() !== dayIn ||
            dateIn.getMonth() !== monthIn - 1 ||
            dateOut.getDate() !== dayOut ||
            dateOut.getMonth() !== monthOut - 1 ||
            dateOut <= dateIn
        ) {
            return 0;
        }

        // Calcula quantidade de dias
        const diffTime = Math.abs(dateOut.getTime() - dateIn.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Busca o preço do quarto selecionado
        const quartoSelecionado = quartosData.find(q => q.numero_quarto === numeroQuarto);
        if (!quartoSelecionado || !quartoSelecionado.preco_diario) {
            return 0;
        }

        return diffDays * quartoSelecionado.preco_diario;
    }, [checkIn, checkOut, numeroQuarto, quartosData]);

    // Formata valor para exibição
    const valorTotalFormatado = calcularValorTotal().toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    // Carrega quartos disponíveis do banco de dados
    const carregarQuartosDisponiveis = useCallback(async () => {
        try {
            setLoadingQuartos(true);
            const quartos = await listarQuartos();
            
            // Filtra apenas quartos com status "disponível"
            const quartosDisponiveisLista = quartos.filter(
                q => q.status?.toLowerCase() === 'disponível'
            );
            
            // Salva os dados completos dos quartos
            setQuartosData(quartosDisponiveisLista);
            
            // Mapeia para o formato do SelectOption
            const options: SelectOption[] = quartosDisponiveisLista.map(q => ({
                label: `Quarto ${q.numero_quarto} - ${q.tipo} (R$ ${q.preco_diario?.toFixed(2).replace('.', ',')}/dia)`,
                value: q.numero_quarto
            }));
            
            setQuartosDisponiveis(options);
            
            if (options.length === 0) {
                showError('Não há quartos disponíveis no momento.');
            }
        } catch (error) {
            console.error('Erro ao carregar quartos:', error);
            showError('Não foi possível carregar os quartos disponíveis.');
        } finally {
            setLoadingQuartos(false);
        }
    }, [showError]);

    // Carrega quartos ao abrir a tela
    useFocusEffect(
        useCallback(() => {
            carregarQuartosDisponiveis();
        }, [carregarQuartosDisponiveis])
    );

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

        // Valida se a data de check-in não está muito distante (máximo 2 anos no futuro)
        const maxFutureDate = new Date();
        maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 2);
        if (checkInDate > maxFutureDate) {
            showError('A data de check-in não pode ser superior a 2 anos no futuro.');
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

        // Valida duração máxima da reserva (por exemplo, 365 dias)
        const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 365) {
            showError('A reserva não pode ter duração superior a 365 dias.');
            return;
        }

        // Calcula o valor total
        const valorNumerico = calcularValorTotal();
        if (valorNumerico <= 0) {
            showError('Não foi possível calcular o valor total. Verifique as datas e o quarto selecionado.');
            return;
        }

        // Valida se o valor total não excede o limite do banco (10^8 com 2 casas decimais = 99.999.999,99)
        if (valorNumerico > 99999999.99) {
            showError('O valor total da reserva excede o limite permitido. Reduza o período da reserva.');
            return;
        }

        try {
            setLoading(true);

            // 1. Buscar cliente pelo CPF para obter o UUID
            const cpfLimpo = clienteCpf.replace(/\D/g, '');
            const cliente = await buscarClientePorCPF(cpfLimpo);
            
            if (!cliente) {
                showError('Cliente não encontrado. Verifique o CPF informado.');
                setLoading(false);
                return;
            }

            // 2. Buscar quarto pelo número para obter o UUID
            const quartos = await listarQuartos();
            const quarto = quartos.find(q => q.numero_quarto === numeroQuarto.trim());
            
            if (!quarto) {
                showError('Quarto não encontrado. Verifique o número informado.');
                setLoading(false);
                return;
            }

            // 3. Converter datas de DD/MM/AAAA para AAAA-MM-DD
            const [diaIn, mesIn, anoIn] = checkIn.split('/');
            const dataCheckinFormatada = `${anoIn}-${mesIn}-${diaIn}`;
            
            const [diaOut, mesOut, anoOut] = checkOut.split('/');
            const dataCheckoutFormatada = `${anoOut}-${mesOut}-${diaOut}`;

            // 4. Criar reserva com os UUIDs corretos e datas formatadas
            const reservaData = {
                id_quarto: quarto.id!,
                id_cliente: cliente.id!,
                data_checkin: dataCheckinFormatada,
                data_checkout: dataCheckoutFormatada,
                numero_hospedes: 1,
                valor_total: valorNumerico,
                observacoes: observacoes.trim() || undefined,
                status: confirmada ? 'confirmada' : 'pendente',
            };

            await criarReserva(reservaData);

            showSuccess(getSuccessMessage('create'));

            setTimeout(() => {
                router.back();
            }, 1500);
        } catch (error) {
            console.error('Erro ao criar reserva:', error);
            showError('Ocorreu um erro ao criar a reserva. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <InfoHeader entity="Reservas" action="Adição" onBackPress={() => router.push('/screens/Reserva/ListagemReserva')} />

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
                                placeholder={loadingQuartos ? "Carregando quartos..." : "Selecione um quarto disponível"}
                                value={numeroQuarto}
                                options={quartosDisponiveis}
                                onSelect={setNumeroQuarto}
                                disabled={loading || loadingQuartos}
                                helperText={`${quartosDisponiveis.length} quarto(s) disponível(is)`}
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

                        {/* Valor Total Calculado */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Valor Total</Text>
                            <View style={styles.valorTotalContainer}>
                                <Ionicons name="cash-outline" size={24} color="#10B981" />
                                <View style={styles.valorTotalContent}>
                                    <Text style={styles.valorTotalLabel}>Total da Reserva</Text>
                                    <Text style={styles.valorTotalValue}>
                                        R$ {valorTotalFormatado}
                                    </Text>
                                    {calcularValorTotal() > 0 && (
                                        <Text style={styles.valorTotalHelper}>
                                            Calculado automaticamente baseado nas diárias
                                        </Text>
                                    )}
                                </View>
                            </View>
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
    valorTotalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#10B981',
        gap: 12,
    },
    valorTotalContent: {
        flex: 1,
        gap: 4,
    },
    valorTotalLabel: {
        fontSize: 12,
        color: '#059669',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    valorTotalValue: {
        fontSize: 24,
        color: '#047857',
        fontWeight: '700',
    },
    valorTotalHelper: {
        fontSize: 11,
        color: '#10B981',
        fontStyle: 'italic',
    },
});

export default CriarReserva;