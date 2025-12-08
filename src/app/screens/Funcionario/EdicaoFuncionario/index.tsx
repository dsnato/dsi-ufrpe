import { supabase } from '@/lib/supabase';
import { ActionButton } from '@/src/components/ActionButton';
import { FormInput } from '@/src/components/FormInput';
import { FormSelect, SelectOption } from '@/src/components/FormSelect';
import { ImagePicker } from '@/src/components/ImagePicker';
import { InfoHeader } from '@/src/components/InfoHeader';
import { Separator } from '@/src/components/Separator';
import { useToast } from '@/src/components/ToastContext';
import { atualizarFuncionario, buscarFuncionarioPorId } from '@/src/services/funcionariosService';
import { getSuccessMessage, getValidationMessage } from '@/src/utils/errorMessages';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditarFuncionario: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();

    const [loading, setLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [celular, setCelular] = useState('');
    const [email, setEmail] = useState('');
    const [cargo, setCargo] = useState('');
    const [ativo, setAtivo] = useState(true);

    // Estado para gerenciar a foto
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [hasCustomPhoto, setHasCustomPhoto] = useState(false);

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

    // Cargos disponíveis
    const cargosDisponiveis: SelectOption[] = [
        { label: 'Recepcionista - Atendimento e check-in', value: 'Recepcionista' },
        { label: 'Camareira - Limpeza e organização', value: 'Camareira' },
        { label: 'Garçom - Serviço de alimentação', value: 'Garçom' },
        { label: 'Gerente - Administração geral', value: 'Gerente' },
        { label: 'Manobrista - Estacionamento', value: 'Manobrista' },
        { label: 'Cozinheiro - Preparo de refeições', value: 'Cozinheiro' },
        { label: 'Segurança - Vigilância', value: 'Segurança' },
        { label: 'Manutenção - Reparos e conservação', value: 'Manutenção' },
    ];

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

    // Valida CPF usando algoritmo de dígitos verificadores
    const validateCpf = (cpfString: string): boolean => {
        const cpfNumbers = cpfString.replace(/\D/g, '');

        // Verifica se tem 11 dígitos
        if (cpfNumbers.length !== 11) return false;

        // Verifica se todos os dígitos são iguais (CPF inválido)
        if (/^(\d)\1{10}$/.test(cpfNumbers)) return false;

        // Calcula o primeiro dígito verificador
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpfNumbers.charAt(i)) * (10 - i);
        }
        let firstDigit = 11 - (sum % 11);
        if (firstDigit >= 10) firstDigit = 0;

        // Verifica o primeiro dígito
        if (firstDigit !== parseInt(cpfNumbers.charAt(9))) return false;

        // Calcula o segundo dígito verificador
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpfNumbers.charAt(i)) * (11 - i);
        }
        let secondDigit = 11 - (sum % 11);
        if (secondDigit >= 10) secondDigit = 0;

        // Verifica o segundo dígito
        if (secondDigit !== parseInt(cpfNumbers.charAt(10))) return false;

        return true;
    };

    // Função para selecionar foto (placeholder para futura integração)
    const handleSelectPhoto = async () => {
        // TODO: Implementar seleção de foto com expo-image-picker
        // const result = await ImagePicker.launchImageLibraryAsync({...});
        // if (!result.canceled) {
        //     setPhotoUri(result.assets[0].uri);
        //     setHasCustomPhoto(true);
        // }

        Alert.alert(
            'Selecionar Foto',
            'A funcionalidade de upload de fotos será implementada com integração ao Supabase.',
            [{ text: 'OK' }]
        );
    };

    // Função para remover foto e voltar ao ícone padrão
    const handleRemovePhoto = () => {
        Alert.alert(
            'Remover Foto',
            'Deseja remover a foto de perfil e retornar ao ícone padrão?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: () => {
                        setPhotoUri(null);
                        setHasCustomPhoto(false);
                        // TODO: Deletar foto do Supabase Storage se existir
                    },
                },
            ]
        );
    };

    // Carrega os dados do funcionário
    const loadFuncionario = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await buscarFuncionarioPorId(id as string);

            if (!data) {
                showError('Funcionário não encontrado.');
                return;
            }

            setNome(data.nome_completo || '');
            setCpf(data.cpf || '');
            setCelular(data.telefone || '');
            setEmail(data.email || '');
            setCargo(data.cargo || '');
            setAtivo(data.status === 'ativo');

            // TODO: Carregar foto do Supabase Storage se existir
            // if (data.foto_url) {
            //     setPhotoUri(data.foto_url);
            //     setHasCustomPhoto(true);
            // }
        } catch (error) {
            console.error('Erro ao carregar funcionário:', error);
            showError('Não foi possível carregar os dados do funcionário.');
        } finally {
            setLoading(false);
        }
    }, [id, showError]);

    useFocusEffect(
        useCallback(() => {
            loadThemePreference();
            loadFuncionario();
        }, [loadFuncionario, loadThemePreference])
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

        // Valida formato do CPF
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!cpfRegex.test(cpf)) {
            showError(getValidationMessage('cpf_format', 'invalid'));
            return;
        }

        // Valida CPF com algoritmo de dígitos verificadores
        if (!validateCpf(cpf)) {
            showError(getValidationMessage('cpf_digits', 'invalid'));
            return;
        }

        if (!celular.trim()) {
            showError(getValidationMessage('celular', 'required'));
            return;
        }

        // Valida formato do celular
        const celularRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
        if (!celularRegex.test(celular)) {
            showError(getValidationMessage('celular', 'invalid'));
            return;
        }

        if (!email.trim()) {
            showError(getValidationMessage('email', 'required'));
            return;
        }

        // Valida formato do e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError(getValidationMessage('email', 'invalid'));
            return;
        }

        try {
            setLoading(true);

            const funcionarioData = {
                nome_completo: nome.trim(),
                cpf: cpf.replace(/\D/g, ''),
                telefone: celular.replace(/\D/g, ''),
                email: email.trim().toLowerCase(),
                cargo: cargo.trim(),
                status: ativo ? 'ativo' : 'inativo',
                // TODO: Adicionar foto_url se houver upload
                // foto_url: photoUri,
            };

            await atualizarFuncionario(id as string, funcionarioData);

            showSuccess(getSuccessMessage('update'));

            setTimeout(() => {
                router.back();
            }, 1500);
        } catch (error) {
            console.error('Erro ao salvar funcionário:', error);
            showError('Ocorreu um erro ao salvar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            <InfoHeader
                entity="Funcionários"
                action="Edição"
                onBackPress={() => router.push('/screens/Funcionario/ListagemFuncionario')}
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
                        <Ionicons name="create-outline" size={24} color={isDarkMode ? '#60A5FA' : '#0162B3'} />
                        <Text style={[styles.title, { color: theme.text }]}>Editar Funcionário</Text>
                    </View>

                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Atualize as informações do funcionário
                    </Text>

                    <Separator marginTop={16} marginBottom={24} />

                    {/* Seção de Foto de Perfil */}
                    {/* Foto do Funcionário */}
                    <View style={styles.fieldGroup}>
                        <Text style={[styles.label, { color: theme.text }]}>Foto de Perfil</Text>
                        <ImagePicker
                            imageUri={photoUri}
                            onImageSelected={handleSelectPhoto}
                            onImageRemoved={handleRemovePhoto}
                            disabled={loading}
                            tone={isDarkMode ? 'dark' : 'light'}
                        />
                    </View>

                    <Separator marginTop={24} marginBottom={24} />

                    {/* Formulário */}
                    <View style={styles.form}>
                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>
                                Nome Completo <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="person-outline"
                                placeholder="Ex: Ana Clara Silva"
                                value={nome}
                                onChangeText={setNome}
                                editable={!loading}
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>
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
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>
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
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>
                                E-mail <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="mail-outline"
                                placeholder="exemplo@hotel.com"
                                value={email}
                                onChangeText={setEmail}
                                editable={!loading}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>
                                Cargo <Text style={styles.required}>*</Text>
                            </Text>
                            <FormSelect
                                icon="briefcase-outline"
                                placeholder="Selecione o cargo"
                                value={cargo}
                                options={cargosDisponiveis}
                                onSelect={setCargo}
                                disabled={loading}
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        {/* Status do Funcionário */}
                        <View style={[
                            styles.switchContainer,
                            {
                                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                                borderColor: isDarkMode ? '#334155' : '#E2E8F0'
                            }
                        ]}>
                            <View style={styles.switchLabel}>
                                <Ionicons
                                    name={ativo ? "checkmark-circle" : "close-circle"}
                                    size={24}
                                    color={ativo ? "#10B981" : "#6B7280"}
                                />
                                <View style={styles.switchTextContainer}>
                                    <Text style={[styles.switchTitle, { color: theme.text }]}>Funcionário Ativo</Text>
                                    <Text style={[styles.switchDescription, { color: theme.textSecondary }]}>
                                        {ativo ? 'Este funcionário está ativo no sistema' : 'Este funcionário está inativo'}
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
                            tone={isDarkMode ? 'dark' : 'light'}
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </ActionButton>

                        <ActionButton
                            variant="secondary"
                            icon="close-circle-outline"
                            onPress={() => router.push('/screens/Funcionario/ListagemFuncionario')}
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
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
    },
    // Estilos do formulário
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
    },
    switchDescription: {
        fontSize: 12,
    },
    actions: {
        gap: 12,
    },
});

export default EditarFuncionario;
