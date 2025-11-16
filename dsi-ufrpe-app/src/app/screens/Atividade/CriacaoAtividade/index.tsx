import { ActionButton } from '@/src/components/ActionButton';
import { FormInput } from '@/src/components/FormInput';
import { InfoHeader } from '@/src/components/InfoHeader';
import { Separator } from '@/src/components/Separator';
import { useToast } from '@/src/components/ToastContext';
import { ImagePicker } from '@/src/components/ImagePicker';
import { getSuccessMessage, getValidationMessage } from '@/src/utils/errorMessages';
import { criarAtividade, uploadImagemAtividade } from '@/src/services/atividadesService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View, Platform } from 'react-native';
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

    // Formata data automaticamente (DD/MM/AAAA)
    const handleDateChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const limited = numbersOnly.slice(0, 8);

        let formatted = limited;
        if (limited.length >= 3) {
            formatted = `${limited.slice(0, 2)}/${limited.slice(2)}`;
        }
        if (limited.length >= 5) {
            formatted = `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
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

            const atividadeData = {
                nome: nome.trim(),
                descricao: descricao.trim() || null,
                local: local.trim(),
                data_hora: dataHora.toISOString(),
                capacidade_maxima: capacidade ? parseInt(capacidade) : null,
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
        <SafeAreaView style={styles.container} edges={['top']}>
            <InfoHeader entity="Atividades" onBackPress={() => router.push('/screens/Atividade/ListagemAtividade')} />

            <View style={styles.content}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Título da seção */}
                    <View style={styles.titleContainer}>
                        <Ionicons name="add-circle-outline" size={24} color="#0162B3" />
                        <Text style={styles.title}>Nova Atividade</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Preencha os dados da nova atividade recreativa
                    </Text>

                    <Separator marginTop={16} marginBottom={24} />

                    {/* Imagem da Atividade */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Imagem da Atividade</Text>
                        <Text style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                            DEBUG: ImagePicker deve aparecer abaixo (Platform: {Platform.OS})
                        </Text>
                        <ImagePicker
                            imageUri={imagemUri}
                            onImageSelected={setImagemUri}
                            onImageRemoved={() => setImagemUri(null)}
                            disabled={loading}
                        />
                    </View>

                    {/* Formulário */}
                    <View style={styles.form}>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Nome da Atividade <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="fitness-outline"
                                placeholder="Ex: Yoga Matinal, Aula de Culinária"
                                value={nome}
                                onChangeText={setNome}
                                editable={!loading}
                                maxLength={100}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Descrição</Text>
                            <FormInput
                                icon="document-text-outline"
                                placeholder="Descreva a atividade (opcional)"
                                value={descricao}
                                onChangeText={setDescricao}
                                editable={!loading}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Local <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="location-outline"
                                placeholder="Ex: Salão Principal, Piscina"
                                value={local}
                                onChangeText={setLocal}
                                editable={!loading}
                                maxLength={100}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.fieldGroup, styles.halfWidth]}>
                                <Text style={styles.label}>
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
                                />
                            </View>

                            <View style={[styles.fieldGroup, styles.halfWidth]}>
                                <Text style={styles.label}>
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
                                />
                            </View>
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Capacidade (opcional)</Text>
                            <FormInput
                                icon="people-outline"
                                placeholder="Número máximo de participantes"
                                value={capacidade}
                                onChangeText={handleCapacidadeChange}
                                editable={!loading}
                                keyboardType="numeric"
                                maxLength={3}
                                helperText="Deixe em branco para capacidade ilimitada"
                            />
                        </View>

                        {/* Status da Atividade */}
                        <View style={styles.switchContainer}>
                            <View style={styles.switchLabel}>
                                <Ionicons
                                    name={ativa ? "checkmark-circle" : "close-circle"}
                                    size={24}
                                    color={ativa ? "#10B981" : "#6B7280"}
                                />
                                <View style={styles.switchTextContainer}>
                                    <Text style={styles.switchTitle}>Atividade Ativa</Text>
                                    <Text style={styles.switchDescription}>
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
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? 'Criando...' : 'Criar Atividade'}
                        </ActionButton>

                        <ActionButton
                            variant="secondary"
                            icon="close-circle-outline"
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

export default CriarAtividade;