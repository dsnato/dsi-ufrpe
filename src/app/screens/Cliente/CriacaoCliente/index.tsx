import { supabase } from '@/lib/supabase';
import { ActionButton } from '@/src/components/ActionButton';
import { FormInput } from '@/src/components/FormInput';
import { FormSelect } from '@/src/components/FormSelect';
import { ImagePicker } from '@/src/components/ImagePicker';
import { InfoHeader } from '@/src/components/InfoHeader';
import { Separator } from '@/src/components/Separator';
import { useToast } from '@/src/components/ToastContext';
import { Cliente, criarCliente, uploadImagemCliente } from '@/src/services/clientesService';
import type { ClienteFormData } from '@/src/types/cliente';
import { getSuccessMessage, getValidationMessage } from '@/src/utils/errorMessages';
import { estadosBrasileiros } from '@/src/utils/estadosBrasileiros';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const palettes = {
    light: {
        background: '#132F3B',
        content: '#F8FAFC',
        text: '#132F3B',
        textSecondary: '#64748B',
        accent: '#0162B3',
        breadcrumb: '#94A3B8',
        backIcon: '#FFFFFF',
    },
    dark: {
        background: '#050C18',
        content: '#0B1624',
        text: '#E2E8F0',
        textSecondary: '#CBD5E1',
        accent: '#4F9CF9',
        breadcrumb: '#94A3B8',
        backIcon: '#FACC15',
    },
} as const;

const CriarCliente: React.FC = () => {
    const router = useRouter();
    const { showSuccess, showError } = useToast();

    const [loading, setLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [imagemUri, setImagemUri] = useState<string | null>(null);

    const theme = useMemo(() => (isDarkMode ? palettes.dark : palettes.light), [isDarkMode]);

    const loadThemePreference = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const preferredTheme = user.user_metadata?.preferred_theme;
            setIsDarkMode(preferredTheme === 'dark');
        } catch (error) {
            console.error('Erro ao carregar preferência de tema:', error);
        }
    }, []);

    useEffect(() => {
        loadThemePreference();

        const { data: authListener } = supabase.auth.onAuthStateChange(() => {
            loadThemePreference();
        });

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, [loadThemePreference]);

    useFocusEffect(
        useCallback(() => {
            loadThemePreference();
        }, [loadThemePreference])
    );

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

    // Formata telefone ((00) 00000-0000)
    const handlePhoneChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const limited = numbersOnly.slice(0, 11);

        let formatted = limited;
        if (limited.length >= 3) {
            formatted = `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
        }
        if (limited.length >= 8) {
            formatted = `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
        }

        setPhone(formatted);
    };

    // Formata CEP (00000-000)
    const handleZipCodeChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const limited = numbersOnly.slice(0, 8);

        let formatted = limited;
        if (limited.length >= 6) {
            formatted = `${limited.slice(0, 5)}-${limited.slice(5)}`;
        }

        setZipCode(formatted);
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

    // Valida email
    const validateEmail = (emailString: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailString);
    };

    const handleSave = async () => {
        console.log('🔵 [CriacaoCliente] handleSave iniciado');

        // Validações
        if (!name.trim()) {
            showError(getValidationMessage('name', 'required'));
            return;
        }

        if (name.trim().length < 3) {
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

        if (!email.trim()) {
            showError(getValidationMessage('email', 'required'));
            return;
        }

        if (!validateEmail(email)) {
            showError(getValidationMessage('email', 'invalid'));
            return;
        }

        if (!phone.trim()) {
            showError(getValidationMessage('phone', 'required'));
            return;
        }

        const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
        if (!phoneRegex.test(phone)) {
            showError('Telefone inválido. Use o formato (00) 00000-0000.');
            return;
        }

        if (!state) {
            showError(getValidationMessage('state', 'required'));
            return;
        }

        try {
            setLoading(true);

            const novoCliente: ClienteFormData = {
                name: name.trim(),
                cpf: cpf.replace(/\D/g, ''),
                email: email.trim().toLowerCase(),
                phone: phone.replace(/\D/g, ''),
                street: street.trim(),
                number: number.trim(),
                neighborhood: neighborhood.trim(),
                city: city.trim(),
                state: state, // Já vem da seleção em uppercase (ex: 'PE')
                zipCode: zipCode.replace(/\D/g, ''),
            };

            console.log('📤 [CriacaoCliente] Enviando dados:', JSON.stringify(novoCliente, null, 2));

            // Mapear campos do form (camelCase) para o banco (snake_case)
            const enderecoCompleto = `${novoCliente.street}, ${novoCliente.number} - ${novoCliente.neighborhood}, CEP: ${novoCliente.zipCode}`;

            const clienteParaBanco: Omit<Cliente, 'id' | 'created_at' | 'updated_at'> = {
                nome_completo: novoCliente.name,
                cpf: novoCliente.cpf,
                email: novoCliente.email,
                telefone: novoCliente.phone,
                endereco: enderecoCompleto,
                cidade: novoCliente.city,
                estado: novoCliente.state,
                pais: 'Brasil',
            };

            const resultado = await criarCliente(clienteParaBanco);

            console.log('✅ [CriacaoCliente] Cliente criado com sucesso:', resultado);

            // Se houver imagem selecionada, faz o upload
            if (imagemUri && resultado.id) {
                try {
                    console.log('🖼️ [CriacaoCliente] Iniciando upload de imagem...');
                    const imageUrl = await uploadImagemCliente(resultado.id, imagemUri);
                    console.log('✅ [CriacaoCliente] Imagem enviada com sucesso!');
                } catch (error) {
                    console.error('❌ [CriacaoCliente] ERRO ao enviar imagem:', error);
                    // Não bloqueia a criação se o upload falhar
                    showError('Cliente criado, mas houve erro ao enviar a imagem.');
                }
            }

            showSuccess(getSuccessMessage('create'));

            setTimeout(() => {
                router.push('/screens/Cliente/ListagemCliente');
            }, 2000);
        } catch (error) {
            console.error('❌ [CriacaoCliente] Erro ao criar cliente:', error);
            console.error('❌ [CriacaoCliente] Detalhes do erro:', JSON.stringify(error, null, 2));
            showError('Não foi possível criar o cliente. Tente novamente.');
        } finally {
            setLoading(false);
            console.log('🔵 [CriacaoCliente] handleSave finalizado');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            <InfoHeader
                entity="Clientes"
                action="Adição"
                onBackPress={() => router.push('/screens/Cliente/ListagemCliente')}
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
                        <Ionicons name="add-circle-outline" size={24} color={theme.accent} />
                        <Text style={[styles.title, { color: theme.text }]}>Novo Cliente</Text>
                    </View>

                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Cadastre um novo cliente no sistema
                    </Text>

                    <Separator marginTop={16} marginBottom={24} />

                    {/* Imagem do Cliente */}
                    <View style={styles.fieldGroup}>
                        <Text style={[styles.label, { color: theme.text }]}>Foto do Cliente</Text>
                        <ImagePicker
                            imageUri={imagemUri}
                            onImageSelected={setImagemUri}
                            onImageRemoved={() => setImagemUri(null)}
                            disabled={loading}
                            tone={isDarkMode ? 'dark' : 'light'}
                        />
                    </View>

                    {/* Formulário */}
                    <View style={styles.form}>
                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>
                                Nome Completo <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="person-outline"
                                placeholder="Nome completo do cliente"
                                value={name}
                                onChangeText={setName}
                                editable={!loading}
                                maxLength={100}
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={[styles.fieldGroup, styles.halfWidth]}>
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
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={[styles.fieldGroup, styles.halfWidth]}>
                            <Text style={[styles.label, { color: theme.text }]}>
                                Telefone <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="call-outline"
                                placeholder="(00) 00000-0000"
                                value={phone}
                                onChangeText={handlePhoneChange}
                                editable={!loading}
                                keyboardType="phone-pad"
                                maxLength={15}
                                isDarkMode={isDarkMode}
                            />
                        </View>
                        {/* <View style={styles.row}>
                        </View> */}

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>
                                E-mail <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="mail-outline"
                                placeholder="cliente@email.com"
                                value={email}
                                onChangeText={setEmail}
                                editable={!loading}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                maxLength={60}
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={[styles.fieldGroup, styles.halfWidth]}>
                            <Text style={[styles.label, { color: theme.text }]}>Rua</Text>
                            <FormInput
                                icon="location-outline"
                                placeholder="Nome da rua"
                                value={street}
                                onChangeText={setStreet}
                                editable={!loading}
                                maxLength={60}
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={[styles.fieldGroup, styles.halfWidth]}>
                            <Text style={[styles.label, { color: theme.text }]}>Número</Text>
                            <FormInput
                                icon="keypad-outline"
                                placeholder="Ex: 123"
                                value={number}
                                onChangeText={setNumber}
                                editable={!loading}
                                maxLength={10}
                                isDarkMode={isDarkMode}
                            />
                        </View>
                        {/* <View style={styles.row}>
                        </View> */}

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Bairro</Text>
                            <FormInput
                                icon="home-outline"
                                placeholder="Nome do bairro"
                                value={neighborhood}
                                onChangeText={setNeighborhood}
                                editable={!loading}
                                maxLength={60}
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={[styles.fieldGroup, styles.halfWidth]}>
                            <Text style={[styles.label, { color: theme.text }]}>Cidade <Text style={styles.required}>*</Text></Text>
                            <FormInput
                                icon="business-outline"
                                placeholder="Nome da cidade"
                                value={city}
                                onChangeText={setCity}
                                editable={!loading}
                                maxLength={50}
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={[styles.fieldGroup, styles.halfWidth]}>
                            <Text style={[styles.label, { color: theme.text }]}>Estado <Text style={styles.required}>*</Text></Text>
                            <FormSelect
                                icon="map-outline"
                                placeholder="Selecione o estado"
                                value={state}
                                options={estadosBrasileiros}
                                onSelect={setState}
                                disabled={loading}
                                helperText="UF do estado"
                                isDarkMode={isDarkMode}
                            />
                        </View>
                        {/* <View style={styles.row}>
                        </View> */}

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>CEP</Text>
                            <FormInput
                                icon="navigate-outline"
                                placeholder="00000-000"
                                value={zipCode}
                                onChangeText={handleZipCodeChange}
                                editable={!loading}
                                keyboardType="numeric"
                                maxLength={9}
                                isDarkMode={isDarkMode}
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
                            {loading ? 'Criando...' : 'Criar Cliente'}
                        </ActionButton>

                        <ActionButton
                            variant="secondary"
                            icon="close-circle-outline"
                            onPress={() => router.push('/screens/Cliente/ListagemCliente')}
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
    actions: {
        gap: 12,
    },
});

export default CriarCliente;


