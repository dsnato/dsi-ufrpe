import { supabase } from '@/lib/supabase';
import { ActionButton } from '@/src/components/ActionButton';
import { FormInput } from '@/src/components/FormInput';
import { FormSelect, SelectOption } from '@/src/components/FormSelect';
import { InfoHeader } from '@/src/components/InfoHeader';
import { Separator } from '@/src/components/Separator';
import { useToast } from '@/src/components/ToastContext';
import { criarQuarto } from '@/src/services/quartosService';
import { getSuccessMessage, getValidationMessage } from '@/src/utils/errorMessages';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const palettes = {
    light: {
        background: '#132F3B',
        content: '#F8FAFC',
        card: '#FFFFFF',
        text: '#132F3B',
        textSecondary: '#64748B',
        muted: '#94A3B8',
        accent: '#0162B3',
        border: '#E2E8F0',
        switchTrack: '#CBD5E1',
        switchThumb: '#FFFFFF',
    },
    dark: {
        background: '#050C18',
        content: '#0B1624',
        card: '#152238',
        text: '#E2E8F0',
        textSecondary: '#CBD5E1',
        muted: '#94A3B8',
        accent: '#4F9CF9',
        border: '#1F2B3C',
        switchTrack: '#1F2B3C',
        switchThumb: '#CBD5E1',
    },
} as const;

const CriarQuarto: React.FC = () => {
    const router = useRouter();
    const { showSuccess, showError } = useToast();

    const [loading, setLoading] = useState(false);
    const [numero, setNumero] = useState('');
    const [tipo, setTipo] = useState('');
    const [capacidade, setCapacidade] = useState('');
    const [preco, setPreco] = useState('');
    const [descricao, setDescricao] = useState('');
    const [disponivel, setDisponivel] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const theme = useMemo(() => palettes[isDarkMode ? 'dark' : 'light'], [isDarkMode]);

    // Carrega a preferência de tema do Supabase
    const loadThemePreference = useCallback(async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.user_metadata?.preferred_theme) {
                setIsDarkMode(session.user.user_metadata.preferred_theme === 'dark');
            }
        } catch (error) {
            console.error('Erro ao carregar tema:', error);
        }
    }, []);

    // Carrega tema ao montar componente
    useEffect(() => {
        loadThemePreference();

        // Listener para mudanças no tema
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user?.user_metadata?.preferred_theme) {
                setIsDarkMode(session.user.user_metadata.preferred_theme === 'dark');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [loadThemePreference]);

    // Recarrega tema ao focar na tela
    useFocusEffect(
        useCallback(() => {
            loadThemePreference();
        }, [loadThemePreference])
    );

    // Tipos de quarto disponíveis
    const tiposQuarto: SelectOption[] = [
        { label: 'Standard - Acomodação básica confortável', value: 'Standard' },
        { label: 'Luxo - Acomodação premium com amenidades', value: 'Luxo' },
        { label: 'Suíte - Espaço amplo com sala separada', value: 'Suíte' },
        { label: 'Suíte Presidencial - Máximo luxo e conforto', value: 'Suíte Presidencial' },
        { label: 'Econômico - Opção acessível e prática', value: 'Econômico' },
    ];

    // Formata número do quarto (apenas números)
    const handleNumeroChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        setNumero(numbersOnly);
    };

    // Formata capacidade (apenas números)
    const handleCapacidadeChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        setCapacidade(numbersOnly);
    };

    // Formata preço (R$ 0.000,00)
    const handlePrecoChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const numberValue = parseInt(numbersOnly) / 100;

        if (isNaN(numberValue)) {
            setPreco('');
            return;
        }

        const formatted = numberValue.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        setPreco(formatted);
    };

    const handleSave = async () => {
        // Validações
        if (!numero.trim()) {
            showError(getValidationMessage('numero_quarto', 'required'));
            return;
        }

        const numeroInt = parseInt(numero);
        if (numeroInt <= 0) {
            showError('O número do quarto deve ser maior que zero.');
            return;
        }

        if (!tipo) {
            showError(getValidationMessage('tipo_quarto', 'required'));
            return;
        }

        if (!capacidade.trim()) {
            showError(getValidationMessage('capacidade', 'required'));
            return;
        }

        const capacidadeInt = parseInt(capacidade);
        if (capacidadeInt < 1 || capacidadeInt > 10) {
            showError(getValidationMessage('capacidade', 'invalid'));
            return;
        }

        if (!preco.trim()) {
            showError(getValidationMessage('preco', 'required'));
            return;
        }

        const precoNumerico = parseFloat(preco.replace(/\./g, '').replace(',', '.'));
        if (precoNumerico <= 0) {
            showError(getValidationMessage('preco', 'invalid'));
            return;
        }

        try {
            setLoading(true);

            const quartoData = {
                numero_quarto: numero.trim(),
                tipo: tipo,
                capacidade_pessoas: capacidadeInt,
                preco_diario: precoNumerico,
                descricao: descricao.trim() || undefined,
                status: disponivel ? 'disponível' : 'ocupado',
            };

            await criarQuarto(quartoData);

            showSuccess(getSuccessMessage('create'));

            setTimeout(() => {
                router.back();
            }, 1500);
        } catch (error) {
            console.error('Erro ao criar quarto:', error);
            showError('Ocorreu um erro ao criar o quarto. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            <InfoHeader
                entity="Quartos"
                action="Adição"
                onBackPress={() => router.push('/screens/Quarto/ListagemQuarto')}
                colors={{
                    background: theme.background,
                    breadcrumb: theme.textSecondary,
                    accent: isDarkMode ? '#FACC15' : '#FFE157',
                    backIcon: '#FFFFFF'
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
                        <Text style={[styles.title, { color: theme.text }]}>Novo Quarto</Text>
                    </View>

                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Cadastre um novo quarto no sistema
                    </Text>

                    <Separator marginTop={16} marginBottom={24} />

                    {/* Formulário */}
                    <View style={styles.form}>
                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>
                                Número do Quarto <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="keypad-outline"
                                placeholder="Ex: 101, 205, 303"
                                value={numero}
                                onChangeText={handleNumeroChange}
                                editable={!loading}
                                keyboardType="numeric"
                                maxLength={4}
                                helperText="Identificação única do quarto"
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>
                                Tipo do Quarto <Text style={styles.required}>*</Text>
                            </Text>
                            <FormSelect
                                icon="bed-outline"
                                placeholder="Selecione o tipo do quarto"
                                value={tipo}
                                options={tiposQuarto}
                                onSelect={setTipo}
                                disabled={loading}
                                helperText="Categoria de acomodação"
                            />
                        </View>

                        <View style={[styles.fieldGroup, styles.halfWidth]}>
                            <Text style={[styles.label, { color: theme.text }]}>
                                Capacidade <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="people-outline"
                                placeholder="1-10"
                                value={capacidade}
                                onChangeText={handleCapacidadeChange}
                                editable={!loading}
                                keyboardType="numeric"
                                maxLength={2}
                                helperText="Número de hóspedes"
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={[styles.fieldGroup, styles.halfWidth]}>
                            <Text style={[styles.label, { color: theme.text }]}>
                                Preço Diária <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="cash-outline"
                                placeholder="0.000,00"
                                value={preco}
                                onChangeText={handlePrecoChange}
                                editable={!loading}
                                keyboardType="numeric"
                                helperText="Valor por dia (R$)"
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Descrição</Text>
                            <FormInput
                                icon="document-text-outline"
                                placeholder="Características e amenidades do quarto (opcional)"
                                value={descricao}
                                onChangeText={setDescricao}
                                editable={!loading}
                                multiline
                                numberOfLines={3}
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        {/* Status de Disponibilidade */}
                        <View style={[styles.switchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <View style={styles.switchLabel}>
                                <Ionicons
                                    name={disponivel ? "checkmark-circle" : "close-circle"}
                                    size={24}
                                    color={disponivel ? "#10B981" : "#EF4444"}
                                />
                                <View style={styles.switchTextContainer}>
                                    <Text style={[styles.switchTitle, { color: theme.text }]}>
                                        {disponivel ? 'Quarto Disponível' : 'Quarto Indisponível'}
                                    </Text>
                                    <Text style={[styles.switchDescription, { color: theme.textSecondary }]}>
                                        {disponivel
                                            ? 'Pronto para receber reservas'
                                            : 'Não aceita novas reservas'}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={disponivel}
                                onValueChange={setDisponivel}
                                trackColor={{ false: '#EF4444', true: '#10B981' }}
                                thumbColor={theme.switchThumb}
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
                            {loading ? 'Criando...' : 'Criar Quarto'}
                        </ActionButton>

                        <ActionButton
                            variant="secondary"
                            icon="close-circle-outline"
                            onPress={() => router.push('/screens/Quarto/ListagemQuarto')}
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
});

export default CriarQuarto;

