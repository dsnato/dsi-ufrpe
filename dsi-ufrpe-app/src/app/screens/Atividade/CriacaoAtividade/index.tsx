import { supabase } from '@/lib/supabase';
import { ActionButton } from '@/src/components/ActionButton';
import { FormInput } from '@/src/components/FormInput';
import { ImagePicker } from '@/src/components/ImagePicker';
import { InfoHeader } from '@/src/components/InfoHeader';
import { Separator } from '@/src/components/Separator';
import { useToast } from '@/src/components/ToastContext';
import { criarAtividade, uploadImagemAtividade } from '@/src/services/atividadesService';
import { getSuccessMessage, getValidationMessage } from '@/src/utils/errorMessages';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CriarAtividade: React.FC = () => {
    const router = useRouter();
    const { showSuccess, showError } = useToast();

    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [local, setLocal] = useState('');
    const [data, setData] = useState('');
    const [hora, setHora] = useState('');
    const [capacidade, setCapacidade] = useState('');
    const [ativa, setAtiva] = useState(true);
    const [imagemUri, setImagemUri] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Paleta de cores dark/light
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
        },
    }), []);

    const theme = useMemo(() => {
        return isDarkMode ? palettes.dark : palettes.light;
    }, [isDarkMode, palettes]);

    // Carrega preferência de tema
    const loadThemePreference = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const preferredTheme = user.user_metadata?.preferred_theme;
                setIsDarkMode(preferredTheme === 'dark');
            }
        } catch (error) {
            console.error('Erro ao carregar preferência de tema:', error);
        }
    }, []);

    // Carrega tema ao montar componente
    useFocusEffect(
        useCallback(() => {
            loadThemePreference();
        }, [loadThemePreference])
    );

    // Formata data automaticamente (DD/MM/AAAA)
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
        if (limited.length >= 3) {
            formatted = `${processedValue.slice(0, 2)}/${processedValue.slice(2)}`;
        }
        if (limited.length >= 5) {
            formatted = `${processedValue.slice(0, 2)}/${processedValue.slice(2, 4)}/${processedValue.slice(4)}`;
        }

        setData(formatted);
    };

    // Formata hora automaticamente (HH:MM)
    const handleTimeChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const limited = numbersOnly.slice(0, 4);

        let formatted = limited;
        if (limited.length >= 3) {
            formatted = `${limited.slice(0, 2)}:${limited.slice(2)}`;
        }

        setHora(formatted);
    };

    // Formata capacidade (apenas números)
    const handleCapacidadeChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        setCapacidade(numbersOnly);
    };

    const handleSave = async () => {
        // Validações
        if (!nome.trim()) {
            showError(getValidationMessage('nome_atividade', 'required'));
            return;
        }

        if (nome.trim().length < 3) {
            showError('O nome da atividade deve ter pelo menos 3 caracteres.');
            return;
        }

        if (!local.trim()) {
            showError(getValidationMessage('local', 'required'));
            return;
        }

        if (!data.trim()) {
            showError(getValidationMessage('data', 'required'));
            return;
        }

        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(data)) {
            showError('Data inválida. Use o formato DD/MM/AAAA.');
            return;
        }

        // Valida se a data é válida
        const [day, month, year] = data.split('/').map(Number);
        const dateObj = new Date(year, month - 1, day);
        if (
            dateObj.getDate() !== day ||
            dateObj.getMonth() !== month - 1 ||
            dateObj.getFullYear() !== year
        ) {
            showError('Data inválida. Verifique o dia e mês informados.');
            return;
        }

        // Valida se a data não é passada
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dateObj < today) {
            showError('A data da atividade não pode ser no passado.');
            return;
        }

        if (!hora.trim()) {
            showError(getValidationMessage('hora', 'required'));
            return;
        }

        const timeRegex = /^\d{2}:\d{2}$/;
        if (!timeRegex.test(hora)) {
            showError('Hora inválida. Use o formato HH:MM.');
            return;
        }

        const [hours, minutes] = hora.split(':').map(Number);
        if (hours > 23 || minutes > 59) {
            showError('Hora inválida. Horas devem ser 00-23 e minutos 00-59.');
            return;
        }

        // Validação de capacidade (opcional)
        if (capacidade.trim()) {
            const cap = parseInt(capacidade);
            if (cap < 1 || cap > 500) {
                showError('A capacidade deve ser entre 1 e 500 pessoas.');
                return;
            }
        }

        try {
            setLoading(true);

            // Combina data e hora em um timestamp
            const [day, month, year] = data.split('/').map(Number);
            const [hours, minutes] = hora.split(':').map(Number);
            const dataHora = new Date(year, month - 1, day, hours, minutes);

            // Converte capacidade de forma segura
            const capacidadeMaxima = capacidade.trim()
                ? parseInt(capacidade.trim())
                : undefined;

            const atividadeData = {
                nome: nome.trim(),
                descricao: descricao.trim() || undefined,
                local: local.trim(),
                data_hora: dataHora.toISOString(),
                capacidade_maxima: capacidadeMaxima,
                status: ativa ? 'ativa' : 'inativa',
            };

            const novaAtividade = await criarAtividade(atividadeData);

            // Se houver imagem selecionada, faz o upload
            if (imagemUri && novaAtividade.id) {
                try {
                    console.log('🖼️ [CriacaoAtividade] Iniciando upload de imagem...');
                    console.log('🖼️ [CriacaoAtividade] Atividade ID:', novaAtividade.id);
                    console.log('🖼️ [CriacaoAtividade] Image URI length:', imagemUri.length);

                    const imageUrl = await uploadImagemAtividade(novaAtividade.id, imagemUri);

                    console.log('✅ [CriacaoAtividade] Imagem enviada com sucesso!');
                    console.log('✅ [CriacaoAtividade] URL da imagem:', imageUrl);
                } catch (error) {
                    console.error('❌ [CriacaoAtividade] ERRO ao enviar imagem:', error);
                    console.error('❌ [CriacaoAtividade] Stack trace:', error);
                    // Não bloqueia a criação se o upload falhar
                    showError('Atividade criada, mas houve erro ao enviar a imagem.');
                }
            } else {
                console.log('ℹ️ [CriacaoAtividade] Sem imagem para upload:', {
                    temImagemUri: !!imagemUri,
                    temAtividadeId: !!novaAtividade.id
                });
            }

            showSuccess(getSuccessMessage('create'));

            setTimeout(() => {
                router.back();
            }, 1500);
        } catch (error) {
            console.error('Erro ao criar atividade:', error);
            showError('Ocorreu um erro ao criar a atividade. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            <InfoHeader
                colors={{
                    background: theme.background,
                    breadcrumb: theme.breadcrumb,
                    accent: theme.accent,
                    backIcon: theme.backIcon,
                }}
                entity="Atividades"
                action="Adição"
                onBackPress={() => router.push('/screens/Atividade/ListagemAtividade')}
            />

            <View style={[styles.content, { backgroundColor: theme.content }]}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Título da seção */}
                    <View style={styles.titleContainer}>
                        <Ionicons name="add-circle-outline" size={24} color={theme.icon} />
                        <Text style={[styles.title, { color: theme.text }]}>Nova Atividade</Text>
                    </View>

                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Preencha os dados da nova atividade recreativa
                    </Text>

                    <Separator marginTop={16} marginBottom={24} />

                    {/* Imagem da Atividade */}
                    <View style={styles.fieldGroup}>
                        <Text style={[styles.label, { color: theme.text }]}>Imagem da Atividade</Text>
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
                                Nome da Atividade <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="fitness-outline"
                                placeholder="Ex: Yoga Matinal, Aula de Culinária"
                                value={nome}
                                onChangeText={setNome}
                                editable={!loading}
                                maxLength={100}
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Descrição</Text>
                            <FormInput
                                icon="document-text-outline"
                                placeholder="Descreva a atividade (opcional)"
                                value={descricao}
                                onChangeText={setDescricao}
                                editable={!loading}
                                multiline
                                numberOfLines={3}
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>
                                Local <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="location-outline"
                                placeholder="Ex: Salão Principal, Piscina"
                                value={local}
                                onChangeText={setLocal}
                                editable={!loading}
                                maxLength={100}
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.fieldGroup, styles.halfWidth]}>
                                <Text style={[styles.label, { color: theme.text }]}>
                                    Data <Text style={styles.required}>*</Text>
                                </Text>
                                <FormInput
                                    icon="calendar-outline"
                                    placeholder="DD/MM/AAAA"
                                    value={data}
                                    onChangeText={handleDateChange}
                                    editable={!loading}
                                    keyboardType="numeric"
                                    maxLength={10}
                                    helperText="Formato: dia/mês/ano"
                                    isDarkMode={isDarkMode}
                                />
                            </View>

                            <View style={[styles.fieldGroup, styles.halfWidth]}>
                                <Text style={[styles.label, { color: theme.text }]}>
                                    Horário <Text style={styles.required}>*</Text>
                                </Text>
                                <FormInput
                                    icon="time-outline"
                                    placeholder="HH:MM"
                                    value={hora}
                                    onChangeText={handleTimeChange}
                                    editable={!loading}
                                    keyboardType="numeric"
                                    maxLength={5}
                                    helperText="Formato: hora:minuto"
                                    isDarkMode={isDarkMode}
                                />
                            </View>
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Capacidade (opcional)</Text>
                            <FormInput
                                icon="people-outline"
                                placeholder="Número máximo de participantes"
                                value={capacidade}
                                onChangeText={handleCapacidadeChange}
                                editable={!loading}
                                keyboardType="numeric"
                                maxLength={3}
                                helperText="Deixe em branco para capacidade ilimitada"
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        {/* Status da Atividade */}
                        <View style={[
                            styles.switchContainer,
                            {
                                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                            }
                        ]}>
                            <View style={styles.switchLabel}>
                                <Ionicons
                                    name={ativa ? "checkmark-circle" : "close-circle"}
                                    size={24}
                                    color={ativa ? "#10B981" : "#6B7280"}
                                />
                                <View style={styles.switchTextContainer}>
                                    <Text style={[styles.switchTitle, { color: theme.text }]}>Atividade Ativa</Text>
                                    <Text style={[styles.switchDescription, { color: theme.textSecondary }]}>
                                        {ativa ? 'Atividade disponível para reservas' : 'Atividade desativada'}
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
                            tone={isDarkMode ? 'dark' : 'light'}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? 'Criando...' : 'Criar Atividade'}
                        </ActionButton>

                        <ActionButton
                            variant="secondary"
                            icon="close-circle-outline"
                            tone={isDarkMode ? 'dark' : 'light'}
                            onPress={() => router.push('/screens/Atividade/ListagemAtividade')}
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

export default CriarAtividade;
