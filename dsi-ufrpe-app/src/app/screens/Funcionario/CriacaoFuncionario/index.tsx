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
import { SafeAreaView } from 'react-native-safe-area-context';

const CriarFuncionario: React.FC = () => {
    const router = useRouter();
    const { showSuccess, showError } = useToast();

    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [celular, setCelular] = useState('');
    const [email, setEmail] = useState('');
    const [cargo, setCargo] = useState('');
    const [dataAdmissao, setDataAdmissao] = useState('');
    const [salario, setSalario] = useState('');
    const [ativo, setAtivo] = useState(true);

    // Cargos disponíveis
    const cargosDisponiveis: SelectOption[] = [
        { label: 'Recepcionista', value: 'Recepcionista' },
        { label: 'Gerente', value: 'Gerente' },
        { label: 'Camareira', value: 'Camareira' },
        { label: 'Manutenção', value: 'Manutenção' },
        { label: 'Cozinheiro', value: 'Cozinheiro' },
        { label: 'Garçom', value: 'Garçom' },
        { label: 'Segurança', value: 'Segurança' },
        { label: 'Contador', value: 'Contador' },
        { label: 'Recursos Humanos', value: 'Recursos Humanos' },
        { label: 'Auxiliar Administrativo', value: 'Auxiliar Administrativo' },
    ];

    // Formata CPF (000.000.000-00)
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

        setCpf(formatted);
    };

    // Formata celular ((00) 00000-0000)
    const handleCelularChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const limited = numbersOnly.slice(0, 11);

        let formatted = limited;
        if (limited.length >= 3) {
            formatted = `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
        }
        if (limited.length >= 8) {
            formatted = `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
        }

        setCelular(formatted);
    };

    // Formata data (DD/MM/AAAA)
    const handleDataChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const limited = numbersOnly.slice(0, 8);

        let formatted = limited;
        if (limited.length >= 3) {
            formatted = `${limited.slice(0, 2)}/${limited.slice(2)}`;
        }
        if (limited.length >= 5) {
            formatted = `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
        }

        setDataAdmissao(formatted);
    };

    // Formata salário (R$ 0.000,00)
    const handleSalarioChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const numberValue = parseInt(numbersOnly) / 100;

        if (isNaN(numberValue)) {
            setSalario('');
            return;
        }

        const formatted = numberValue.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        setSalario(formatted);
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

    // Valida email
    const validateEmail = (emailString: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailString);
    };

    const handleSave = async () => {
        // Validações
        if (!nome.trim()) {
            showError(getValidationMessage('name', 'required'));
            return;
        }

        if (nome.trim().length < 3) {
            showError('O nome deve ter pelo menos 3 caracteres.');
            return;
        }

        if (!cpf.trim()) {
            showError(getValidationMessage('cpf', 'required'));
            return;
        }

        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!cpfRegex.test(cpf)) {
            showError(getValidationMessage('cpf_format', 'invalid'));
            return;
        }

        if (!validateCpf(cpf)) {
            showError(getValidationMessage('cpf_digits', 'invalid'));
            return;
        }

        if (!celular.trim()) {
            showError(getValidationMessage('celular', 'required'));
            return;
        }

        const celularRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
        if (!celularRegex.test(celular)) {
            showError(getValidationMessage('celular', 'invalid'));
            return;
        }

        if (!email.trim()) {
            showError(getValidationMessage('email', 'required'));
            return;
        }

        if (!validateEmail(email)) {
            showError(getValidationMessage('email', 'invalid'));
            return;
        }

        if (!cargo) {
            showError('Por favor, selecione o cargo do funcionário.');
            return;
        }

        if (!dataAdmissao.trim()) {
            showError('Por favor, informe a data de admissão.');
            return;
        }

        const dataAdmissaoDate = validateDate(dataAdmissao);
        if (!dataAdmissaoDate) {
            showError('Data de admissão inválida. Use o formato DD/MM/AAAA.');
            return;
        }

        if (!salario.trim()) {
            showError('Por favor, informe o salário.');
            return;
        }

        const salarioNumerico = parseFloat(salario.replace(/\./g, '').replace(',', '.'));
        if (salarioNumerico <= 0) {
            showError('O salário deve ser maior que zero.');
            return;
        }

        try {
            setLoading(true);

            const funcionarioData = {
                nome: nome.trim(),
                cpf: cpf.replace(/\D/g, ''),
                celular: celular.replace(/\D/g, ''),
                email: email.trim().toLowerCase(),
                cargo: cargo,
                data_admissao: dataAdmissao,
                salario: salarioNumerico,
                ativo: ativo,
            };

            // TODO: Implementar FuncionarioService.create(funcionarioData)
            console.log('Criando funcionário:', funcionarioData);

            showSuccess(getSuccessMessage('create'));

            setTimeout(() => {
                router.push('/screens/Funcionario/ListagemFuncionario');
            }, 2000);
        } catch (error) {
            console.error('Erro ao criar funcionário:', error);
            showError('Ocorreu um erro ao criar o funcionário. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <InfoHeader entity="Funcionários" onBackPress={() => router.push('/screens/Funcionario/ListagemFuncionario')} />

            <View style={styles.content}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Título da seção */}
                    <View style={styles.titleContainer}>
                        <Ionicons name="add-circle-outline" size={24} color="#0162B3" />
                        <Text style={styles.title}>Novo Funcionário</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Cadastre um novo funcionário no sistema
                    </Text>

                    <Separator marginTop={16} marginBottom={24} />

                    {/* Formulário */}
                    <View style={styles.form}>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Nome Completo <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="person-outline"
                                placeholder="Nome do funcionário"
                                value={nome}
                                onChangeText={setNome}
                                editable={!loading}
                                maxLength={100}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.fieldGroup, styles.halfWidth]}>
                                <Text style={styles.label}>
                                    CPF <Text style={styles.required}>*</Text>
                                </Text>
                                <FormInput
                                    icon="card-outline"
                                    placeholder="000.000.000-00"
                                    value={cpf}
                                    onChangeText={handleCpfChange}
                                    editable={!loading}
                                    keyboardType="numeric"
                                    maxLength={14}
                                />
                            </View>

                            <View style={[styles.fieldGroup, styles.halfWidth]}>
                                <Text style={styles.label}>
                                    Celular <Text style={styles.required}>*</Text>
                                </Text>
                                <FormInput
                                    icon="call-outline"
                                    placeholder="(00) 00000-0000"
                                    value={celular}
                                    onChangeText={handleCelularChange}
                                    editable={!loading}
                                    keyboardType="phone-pad"
                                    maxLength={15}
                                />
                            </View>
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                E-mail <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="mail-outline"
                                placeholder="funcionario@email.com"
                                value={email}
                                onChangeText={setEmail}
                                editable={!loading}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                maxLength={100}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Cargo <Text style={styles.required}>*</Text>
                            </Text>
                            <FormSelect
                                icon="briefcase-outline"
                                placeholder="Selecione o cargo"
                                value={cargo}
                                options={cargosDisponiveis}
                                onSelect={setCargo}
                                disabled={loading}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.fieldGroup, styles.halfWidth]}>
                                <Text style={styles.label}>
                                    Data Admissão <Text style={styles.required}>*</Text>
                                </Text>
                                <FormInput
                                    icon="calendar-outline"
                                    placeholder="DD/MM/AAAA"
                                    value={dataAdmissao}
                                    onChangeText={handleDataChange}
                                    editable={!loading}
                                    keyboardType="numeric"
                                    maxLength={10}
                                    helperText="Data de contratação"
                                />
                            </View>

                            <View style={[styles.fieldGroup, styles.halfWidth]}>
                                <Text style={styles.label}>
                                    Salário <Text style={styles.required}>*</Text>
                                </Text>
                                <FormInput
                                    icon="cash-outline"
                                    placeholder="0.000,00"
                                    value={salario}
                                    onChangeText={handleSalarioChange}
                                    editable={!loading}
                                    keyboardType="numeric"
                                    helperText="Salário mensal (R$)"
                                />
                            </View>
                        </View>

                        {/* Status do Funcionário */}
                        <View style={styles.switchContainer}>
                            <View style={styles.switchLabel}>
                                <Ionicons
                                    name={ativo ? "checkmark-circle" : "close-circle"}
                                    size={24}
                                    color={ativo ? "#10B981" : "#EF4444"}
                                />
                                <View style={styles.switchTextContainer}>
                                    <Text style={styles.switchTitle}>
                                        {ativo ? 'Funcionário Ativo' : 'Funcionário Inativo'}
                                    </Text>
                                    <Text style={styles.switchDescription}>
                                        {ativo
                                            ? 'Trabalhando normalmente'
                                            : 'Afastado ou desligado'}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={ativo}
                                onValueChange={setAtivo}
                                trackColor={{ false: '#EF4444', true: '#10B981' }}
                                thumbColor="#FFFFFF"
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
                            {loading ? 'Criando...' : 'Criar Funcionário'}
                        </ActionButton>

                        <ActionButton
                            variant="secondary"
                            icon="close-circle-outline"
                            onPress={() => router.push('/screens/Funcionario/ListagemFuncionario')}
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
});

export default CriarFuncionario;