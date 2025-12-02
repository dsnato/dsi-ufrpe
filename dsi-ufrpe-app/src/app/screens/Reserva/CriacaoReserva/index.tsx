import { supabase } from '@/lib/supabase';
import { ActionButton } from '@/src/components/ActionButton';
import { FormInput } from '@/src/components/FormInput';
import { FormSelect, SelectOption } from '@/src/components/FormSelect';
import { InfoHeader } from '@/src/components/InfoHeader';
import { Separator } from '@/src/components/Separator';
import { useToast } from '@/src/components/ToastContext';
import { listarClientes } from '@/src/services/clientesService';
import { listarQuartos } from '@/src/services/quartosService';
import { criarReserva } from '@/src/services/reservasService';
import { getSuccessMessage, getValidationMessage } from '@/src/utils/errorMessages';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CriarReserva: React.FC = () => {
    const router = useRouter();
    const { showSuccess, showError } = useToast();

    const [loading, setLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [numeroQuarto, setNumeroQuarto] = useState('');
    const [clienteId, setClienteId] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [confirmada, setConfirmada] = useState(true);
    const [quartosDisponiveis, setQuartosDisponiveis] = useState<SelectOption[]>([]);
    const [clientesDisponiveis, setClientesDisponiveis] = useState<SelectOption[]>([]);
    const [quartosData, setQuartosData] = useState<any[]>([]);
    const [clientesData, setClientesData] = useState<any[]>([]);
    const [loadingQuartos, setLoadingQuartos] = useState(false);
    const [loadingClientes, setLoadingClientes] = useState(false);

    // Paleta de cores
    const palettes = useMemo(() => ({
        light: {
            background: '#132F3B',
            content: '#F8FAFC',
            text: '#132F3B',
            textSecondary: '#64748B',
            breadcrumb: '#E0F2FE',
            accent: '#FFE157',
            backIcon: '#FFFFFF',
        },
        dark: {
            background: '#050C18',
            content: '#0B1624',
            text: '#F1F5F9',
            textSecondary: '#94A3B8',
            breadcrumb: '#94A3B8',
            accent: '#FDE047',
            backIcon: '#E2E8F0',
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

    useEffect(() => {
        loadThemePreference();
    }, [loadThemePreference]);

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

    // Carrega clientes registrados do banco de dados
    const carregarClientesDisponiveis = useCallback(async () => {
        try {
            setLoadingClientes(true);
            const clientes = await listarClientes();

            // Salva os dados completos dos clientes
            setClientesData(clientes);

            // Mapeia para o formato do SelectOption
            const options: SelectOption[] = clientes.map(c => ({
                label: `${(c as any).nome_completo} - CPF: ${c.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}`,
                value: c.id || ''
            }));

            setClientesDisponiveis(options);

            if (options.length === 0) {
                showError('Não há clientes cadastrados. Cadastre um cliente primeiro.');
            }
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            showError('Não foi possível carregar os clientes.');
        } finally {
            setLoadingClientes(false);
        }
    }, [showError]);

    // Carrega quartos e clientes ao abrir a tela
    useFocusEffect(
        useCallback(() => {
            carregarQuartosDisponiveis();
            carregarClientesDisponiveis();
        }, [carregarQuartosDisponiveis, carregarClientesDisponiveis])
    );

    // Formata data automaticamente (DD/MM/AAAA)
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

        // Valida e corrige o ano (1900-2100)
        if (processedValue.length === 8) {
            const year = parseInt(processedValue.slice(4, 8));
            let correctedYear = processedValue.slice(4, 8);

            if (year < 1900) {
                correctedYear = '1900';
            } else if (year > 2100) {
                correctedYear = '2100';
            }

            processedValue = processedValue.slice(0, 4) + correctedYear;
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

        if (!clienteId.trim()) {
            showError('Selecione um cliente para a reserva.');
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

            // 1. Buscar quarto pelo número para obter o UUID
            const quartos = await listarQuartos();
            const quarto = quartos.find(q => q.numero_quarto === numeroQuarto.trim());

            if (!quarto) {
                showError('Quarto não encontrado. Verifique o número informado.');
                setLoading(false);
                return;
            }

            // 2. Converter datas de DD/MM/AAAA para AAAA-MM-DD
            const [diaIn, mesIn, anoIn] = checkIn.split('/');
            const dataCheckinFormatada = `${anoIn}-${mesIn}-${diaIn}`;

            const [diaOut, mesOut, anoOut] = checkOut.split('/');
            const dataCheckoutFormatada = `${anoOut}-${mesOut}-${diaOut}`;

            // 3. Criar reserva com os UUIDs corretos e datas formatadas
            const reservaData = {
                id_quarto: quarto.id!,
                id_cliente: clienteId, // Já temos o UUID do cliente do dropdown
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
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            <InfoHeader
                entity="Reservas"
                action="Adição"
                onBackPress={() => router.push('/screens/Reserva/ListagemReserva')}
                colors={{
                    background: theme.background,
                    breadcrumb: theme.breadcrumb,
                    accent: theme.accent,
                    backIcon: theme.backIcon,
                }}
            />

            <View style={[styles.content, { backgroundColor: theme.content }]}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Título da seção */}
                    <View style={styles.titleContainer}>
                        <Ionicons name="add-circle-outline" size={24} color={isDarkMode ? '#60A5FA' : '#0162B3'} />
                        <Text style={[styles.title, { color: theme.text }]}>Nova Reserva</Text>
                    </View>

                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Preencha os dados para criar uma nova reserva
                    </Text>

                    <Separator marginTop={16} marginBottom={24} />

                    {/* Formulário */}
                    <View style={styles.form}>
                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>
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
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>
                                Cliente <Text style={styles.required}>*</Text>
                            </Text>
                            <FormSelect
                                icon="person-outline"
                                placeholder={loadingClientes ? "Carregando clientes..." : "Selecione um cliente"}
                                value={clienteId}
                                options={clientesDisponiveis}
                                onSelect={setClienteId}
                                disabled={loading || loadingClientes}
                                helperText={`${clientesDisponiveis.length} cliente(s) cadastrado(s)`}
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.fieldGroup, styles.halfWidth]}>
                                <Text style={[styles.label, { color: theme.text }]}>
                                    Check-in <Text style={styles.required}>*</Text>
                                </Text>
                                <FormInput
                                    icon="log-in-outline"
                                    placeholder="DD/MM/AAAA"
                                    value={checkIn}
                                    onChangeText={(text) => handleDateChange(text, setCheckIn)}
                                    editable={!loading}
                                    keyboardType="numeric"
                                    isDarkMode={isDarkMode}
                                    maxLength={10}
                                    helperText="Data de entrada"
                                />
                            </View>

                            <View style={[styles.fieldGroup, styles.halfWidth]}>
                                <Text style={[styles.label, { color: theme.text }]}>
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
                                    isDarkMode={isDarkMode}
                                />
                            </View>
                        </View>

                        {/* Valor Total Calculado */}
                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Valor Total</Text>
                            <View style={[styles.valorTotalContainer, {
                                backgroundColor: isDarkMode ? '#064E3B' : '#F0FDF4',
                                borderColor: isDarkMode ? '#059669' : '#10B981'
                            }]}>
                                <Ionicons name="cash-outline" size={24} color="#10B981" />
                                <View style={styles.valorTotalContent}>
                                    <Text style={[styles.valorTotalLabel, {
                                        color: isDarkMode ? '#6EE7B7' : '#059669'
                                    }]}>Total da Reserva</Text>
                                    <Text style={[styles.valorTotalValue, {
                                        color: isDarkMode ? '#A7F3D0' : '#047857'
                                    }]}>
                                        R$ {valorTotalFormatado}
                                    </Text>
                                    {calcularValorTotal() > 0 && (
                                        <Text style={[styles.valorTotalHelper, {
                                            color: isDarkMode ? '#6EE7B7' : theme.textSecondary
                                        }]}>
                                            Calculado automaticamente baseado nas diárias
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Observações</Text>
                            <FormInput
                                icon="document-text-outline"
                                placeholder="Informações adicionais (opcional)"
                                value={observacoes}
                                onChangeText={setObservacoes}
                                editable={!loading}
                                multiline
                                numberOfLines={3}
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        {/* Status da Reserva */}
                        <View style={[styles.switchContainer, {
                            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                            borderColor: isDarkMode ? '#334155' : '#E2E8F0'
                        }]}>
                            <View style={styles.switchLabel}>
                                <Ionicons
                                    name={confirmada ? "checkmark-circle" : "time-outline"}
                                    size={24}
                                    color={confirmada ? "#10B981" : "#F59E0B"}
                                />
                                <View style={styles.switchTextContainer}>
                                    <Text style={[styles.switchTitle, { color: theme.text }]}>
                                        {confirmada ? 'Reserva Confirmada' : 'Reserva Pendente'}
                                    </Text>
                                    <Text style={[styles.switchDescription, { color: theme.textSecondary }]}>
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
                            tone={isDarkMode ? 'dark' : 'light'}
                        >
                            {loading ? 'Criando...' : 'Criar Reserva'}
                        </ActionButton>

                        <ActionButton
                            variant="secondary"
                            icon="close-circle-outline"
                            onPress={() => router.push('/screens/Reserva/ListagemReserva')}
                            disabled={loading}
                            tone={isDarkMode ? 'dark' : 'light'}
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
    },
    content: {
        flex: 1,
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
    },
    subtitle: {
        fontSize: 14,
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
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
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
    },
    switchDescription: {
        fontSize: 12,
    },
    actions: {
        gap: 12,
    },
    valorTotalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        gap: 12,
    },
    valorTotalContent: {
        flex: 1,
        gap: 4,
    },
    valorTotalLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    valorTotalValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    valorTotalHelper: {
        fontSize: 11,
        fontStyle: 'italic',
    },
});

export default CriarReserva;
