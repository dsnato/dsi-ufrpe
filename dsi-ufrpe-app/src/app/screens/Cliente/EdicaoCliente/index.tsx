import { ActionButton } from '@/src/components/ActionButton';
import { FormInput } from '@/src/components/FormInput';
import { InfoHeader } from '@/src/components/InfoHeader';
import { Separator } from '@/src/components/Separator';
import { useToast } from '@/src/components/ToastContext';
import { atualizarCliente, buscarClientePorId } from '@/src/services/clientesService';
import { getSuccessMessage, getValidationMessage } from '@/src/utils/errorMessages';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditarCliente: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();

    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [celular, setCelular] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [endereco, setEndereco] = useState('');
    const [ativo, setAtivo] = useState(true);

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

        setCpf(formatted);
    };

    // Formata celular automaticamente (00) 00000-0000
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

    // Formata a data automaticamente para DD/MM/AAAA
    const handleDateChange = (text: string) => {
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

        setDataNascimento(formatted);
    };

    // Valida CPF usando algoritmo de dígitos verificadores
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

    // Carrega os dados do cliente
    const loadCliente = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await buscarClientePorId(id as string);
            
            if (!data) {
                showError('Cliente não encontrado.');
                return;
            }
            
            setNome(data.nome_completo || '');
            setCpf(data.cpf || '');
            setCelular(data.telefone || '');
            setEmail(data.email || '');
            setDataNascimento(data.data_nascimento || '');
            setEndereco(data.endereco || '');
            setAtivo(data.ativo ?? true);
        } catch (error) {
            console.error('Erro ao carregar cliente:', error);
            showError('Não foi possível carregar os dados do cliente.');
        } finally {
            setLoading(false);
        }
    }, [id, showError]);

    useFocusEffect(
        useCallback(() => {
            loadCliente();
        }, [loadCliente])
    );

    const handleSave = async () => {
        // Validações
        if (!nome.trim()) {
            showError(getValidationMessage('name', 'required'));
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError(getValidationMessage('email', 'invalid'));
            return;
        }

        // Valida data de nascimento (opcional, mas se preenchida deve ser válida)
        if (dataNascimento.trim()) {
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!dateRegex.test(dataNascimento)) {
                showError('Data de nascimento inválida. Use o formato DD/MM/AAAA.');
                return;
            }

            const [day, month, year] = dataNascimento.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            if (
                date.getDate() !== day ||
                date.getMonth() !== month - 1 ||
                date.getFullYear() !== year
            ) {
                showError('Data de nascimento inválida. Verifique o dia e mês informados.');
                return;
            }

            // Valida se a data não é futura
            if (date > new Date()) {
                showError('A data de nascimento não pode ser uma data futura.');
                return;
            }
        }

        try {
            setLoading(true);

            const clienteData = {
                nome_completo: nome.trim(),
                cpf: cpf.replace(/\D/g, ''),
                telefone: celular.replace(/\D/g, ''),
                email: email.trim().toLowerCase(),
                data_nascimento: dataNascimento.trim() || null,
                endereco: endereco.trim() || null,
            };

            await atualizarCliente(id as string, clienteData);

            showSuccess(getSuccessMessage('update'));

            setTimeout(() => {
                router.back();
            }, 1500);
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            showError('Ocorreu um erro ao salvar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <InfoHeader entity="Clientes" action="Edição" onBackPress={() => router.push('/screens/Cliente/ListagemCliente')} />

            <View style={styles.content}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Título da seção */}
                    <View style={styles.titleContainer}>
                        <Ionicons name="create-outline" size={24} color="#0162B3" />
                        <Text style={styles.title}>Editar Cliente</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Atualize as informações do cliente
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
                                placeholder="Ex: Maria Santos"
                                value={nome}
                                onChangeText={setNome}
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
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
                                helperText="Formato: 000.000.000-00"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Celular <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="call-outline"
                                placeholder="(00) 00000-0000"
                                value={celular}
                                onChangeText={handleCelularChange}
                                editable={!loading}
                                keyboardType="numeric"
                                maxLength={15}
                                helperText="Formato: (00) 00000-0000"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                E-mail <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="mail-outline"
                                placeholder="exemplo@email.com"
                                value={email}
                                onChangeText={setEmail}
                                editable={!loading}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Data de Nascimento</Text>
                            <FormInput
                                icon="calendar-outline"
                                placeholder="DD/MM/AAAA"
                                value={dataNascimento}
                                onChangeText={handleDateChange}
                                editable={!loading}
                                keyboardType="numeric"
                                maxLength={10}
                                helperText="Formato: dia/mês/ano"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Endereço</Text>
                            <FormInput
                                icon="location-outline"
                                placeholder="Rua, número, bairro, cidade"
                                value={endereco}
                                onChangeText={setEndereco}
                                editable={!loading}
                                multiline
                                numberOfLines={2}
                            />
                        </View>

                        {/* Status do Cliente */}
                        <View style={styles.switchContainer}>
                            <View style={styles.switchLabel}>
                                <Ionicons
                                    name={ativo ? "checkmark-circle" : "close-circle"}
                                    size={24}
                                    color={ativo ? "#10B981" : "#6B7280"}
                                />
                                <View style={styles.switchTextContainer}>
                                    <Text style={styles.switchTitle}>Cliente Ativo</Text>
                                    <Text style={styles.switchDescription}>
                                        {ativo ? 'Este cliente está ativo no sistema' : 'Este cliente está inativo'}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={ativo}
                                onValueChange={setAtivo}
                                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                                thumbColor={ativo ? '#FFFFFF' : '#F3F4F6'}
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
                            onPress={() => router.push('/screens/Cliente/ListagemCliente')}
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

export default EditarCliente;
