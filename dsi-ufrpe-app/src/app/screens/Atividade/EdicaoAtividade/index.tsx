import { ActionButton } from '@/src/components/ActionButton';
import { FormInput } from '@/src/components/FormInput';
import { InfoHeader } from '@/src/components/InfoHeader';
import { Separator } from '@/src/components/Separator';
import { buscarAtividadePorId, atualizarAtividade } from '@/src/services/atividadesService';
import { useToast } from '@/src/components/ToastContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const EditarAtividade: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();

    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [local, setLocal] = useState('');
    const [dataAtividade, setDataAtividade] = useState('');
    const [horario, setHorario] = useState('');
    const [capacidadeMaxima, setCapacidadeMaxima] = useState('');
    const [preco, setPreco] = useState('');
    const [status, setStatus] = useState<'ativo' | 'cancelado'>('ativo');
    const [ativa, setAtiva] = useState(true);

    // Formata a data automaticamente para DD/MM/AAAA
    const handleDateChange = (text: string) => {
        // Remove tudo que não é número
        const numbersOnly = text.replace(/\D/g, '');

        // Limita a 8 dígitos (DDMMAAAA)
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

        // Formata conforme o usuário digita
        let formatted = processedValue;
        if (processedValue.length >= 3) {
            formatted = `${processedValue.slice(0, 2)}/${processedValue.slice(2)}`;
        }
        if (processedValue.length >= 5) {
            formatted = `${processedValue.slice(0, 2)}/${processedValue.slice(2, 4)}/${processedValue.slice(4)}`;
        }

        setDataAtividade(formatted);
    };

    // Formata o horário automaticamente para HH:MM
    const handleTimeChange = (text: string) => {
        // Remove tudo que não é número
        const numbersOnly = text.replace(/\D/g, '');

        // Limita a 4 dígitos (HHMM)
        const limited = numbersOnly.slice(0, 4);

        // Valida hora (00-23)
        if (limited.length >= 2) {
            const hour = parseInt(limited.slice(0, 2));
            if (hour > 23) {
                setHorario('23:');
                return;
            }
        }

        // Valida minuto (00-59)
        if (limited.length >= 3) {
            const minute = parseInt(limited.slice(2, 4));
            if (minute > 59) {
                const formattedHour = limited.slice(0, 2);
                setHorario(`${formattedHour}:59`);
                return;
            }
        }

        // Formata conforme o usuário digita
        let formatted = limited;
        if (limited.length >= 3) {
            formatted = `${limited.slice(0, 2)}:${limited.slice(2)}`;
        }

        setHorario(formatted);
    };

    // Formata capacidade para aceitar apenas números
    const handleCapacidadeChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const limited = numbersOnly.slice(0, 3); // Limita a 3 dígitos
        setCapacidadeMaxima(limited);
    };

    // Formata o preço automaticamente para formato monetário
    const handlePrecoChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const numberValue = parseInt(numbersOnly || '0') / 100;
        const formatted = numberValue.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        setPreco(formatted);
    };

    // Carrega os dados da atividade
    const loadAtividade = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await buscarAtividadePorId(id as string);
            
            if (!data) {
                showError('Atividade não encontrada.');
                return;
            }
            
            setNome(data.nome || '');
            setDescricao(data.descricao || '');
            setLocal(data.local || '');
            
            // Split data_hora into date and time
            // Expected format: YYYY-MM-DD HH:MM:SS or YYYY-MM-DDTHH:MM:SS
            if (data.data_hora) {
                const dateTimeParts = data.data_hora.split('T')[0]; // Get date part
                const timePart = data.data_hora.includes('T') 
                    ? data.data_hora.split('T')[1].substring(0, 5) 
                    : data.data_hora.split(' ')[1]?.substring(0, 5) || '';
                
                const [year, month, day] = dateTimeParts.split('-');
                setDataAtividade(`${day}/${month}/${year}`);
                setHorario(timePart);
            }
            
            setCapacidadeMaxima(data.capacidade_maxima?.toString() || '');
            setPreco(data.preco ? data.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '');
            setStatus(data.status?.toLowerCase() as 'ativo' | 'cancelado' || 'ativo');
            setAtiva(true); // UI only field
        } catch (error) {
            console.error('Erro ao carregar atividade:', error);
            showError('Não foi possível carregar os dados da atividade.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useFocusEffect(
        useCallback(() => {
            loadAtividade();
        }, [loadAtividade])
    );

    const handleSave = async () => {
        // Validações
        if (!nome.trim()) {
            Alert.alert('Atenção', 'O nome da atividade é obrigatório.');
            return;
        }

        if (!dataAtividade.trim()) {
            Alert.alert('Atenção', 'A data da atividade é obrigatória.');
            return;
        }

        // Valida formato da data (DD/MM/AAAA)
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(dataAtividade)) {
            Alert.alert('Atenção', 'Data inválida. Use o formato DD/MM/AAAA.');
            return;
        }

        // Valida se é uma data válida
        const [day, month, year] = dataAtividade.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        if (
            date.getDate() !== day ||
            date.getMonth() !== month - 1 ||
            date.getFullYear() !== year
        ) {
            Alert.alert('Atenção', 'Data inválida. Verifique o dia e mês informados.');
            return;
        }

        if (!horario.trim()) {
            Alert.alert('Atenção', 'O horário da atividade é obrigatório.');
            return;
        }

        // Valida formato do horário (HH:MM)
        const timeRegex = /^\d{2}:\d{2}$/;
        if (!timeRegex.test(horario)) {
            Alert.alert('Atenção', 'Horário inválido. Use o formato HH:MM.');
            return;
        }

        // Valida se é um horário válido
        const [hour, minute] = horario.split(':').map(Number);
        if (hour > 23 || minute > 59) {
            Alert.alert('Atenção', 'Horário inválido. Hora deve ser 00-23 e minuto 00-59.');
            return;
        }

        if (!capacidadeMaxima.trim()) {
            Alert.alert('Atenção', 'A capacidade máxima é obrigatória.');
            return;
        }

        const capacidade = parseInt(capacidadeMaxima);
        if (capacidade <= 0) {
            Alert.alert('Atenção', 'A capacidade máxima deve ser maior que zero.');
            return;
        }

        if (!preco.trim()) {
            Alert.alert('Atenção', 'O preço da atividade é obrigatório.');
            return;
        }

        const precoNum = parseFloat(preco.replace(/\./g, '').replace(',', '.'));
        if (precoNum < 0) {
            Alert.alert('Atenção', 'O preço não pode ser negativo.');
            return;
        }

        try {
            setLoading(true);

            // Combina data e horário para data_hora (YYYY-MM-DD HH:MM:SS)
            const [day, month, year] = dataAtividade.split('/');
            const dataHora = `${year}-${month}-${day} ${horario}:00`;

            const atividadeData = {
                nome: nome.trim(),
                descricao: descricao.trim() || undefined,
                local: local.trim() || undefined,
                data_hora: dataHora,
                capacidade_maxima: parseInt(capacidadeMaxima),
                preco: parseFloat(preco.replace(/\./g, '').replace(',', '.')),
                status: status.charAt(0).toUpperCase() + status.slice(1),
                // ativa is kept in UI but not sent to backend
            };

            await atualizarAtividade(id as string, atividadeData);
            showSuccess('Atividade atualizada com sucesso!');
            router.push('/screens/Atividade/ListagemAtividade');
        } catch (error) {
            console.error('Erro ao salvar atividade:', error);
            showError('Ocorreu um erro ao salvar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <InfoHeader entity="Atividades" onBackPress={() => router.push("/screens/Atividade/ListagemAtividade")} />

            <View style={styles.content}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Título da seção */}
                    <View style={styles.titleContainer}>
                        <Ionicons name="create-outline" size={24} color="#0162B3" />
                        <Text style={styles.title}>Editar Atividade</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Atualize as informações da atividade recreativa
                    </Text>

                    <Separator marginTop={16} marginBottom={24} />

                    {/* Formulário */}
                    <View style={styles.form}>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Nome da Atividade <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="create-outline"
                                placeholder="Ex: Aula de Yoga"
                                value={nome}
                                onChangeText={setNome}
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Descrição</Text>
                            <FormInput
                                icon="document-text-outline"
                                placeholder="Descreva a atividade"
                                value={descricao}
                                onChangeText={setDescricao}
                                multiline
                                numberOfLines={3}
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Local</Text>
                            <FormInput
                                icon="location-outline"
                                placeholder="Ex: Área de lazer"
                                value={local}
                                onChangeText={setLocal}
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Data <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="calendar-outline"
                                placeholder="DD/MM/AAAA"
                                value={dataAtividade}
                                onChangeText={handleDateChange}
                                editable={!loading}
                                keyboardType="numeric"
                                maxLength={10}
                                helperText="Formato: dia/mês/ano"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Horário <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="time-outline"
                                placeholder="HH:MM"
                                value={horario}
                                onChangeText={handleTimeChange}
                                editable={!loading}
                                keyboardType="numeric"
                                maxLength={5}
                                helperText="Formato: hora:minuto (00:00 - 23:59)"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Capacidade Máxima <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="people-outline"
                                placeholder="0"
                                value={capacidadeMaxima}
                                onChangeText={handleCapacidadeChange}
                                editable={!loading}
                                keyboardType="numeric"
                                helperText="Número máximo de participantes"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Preço <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="cash-outline"
                                placeholder="0,00"
                                value={preco}
                                onChangeText={handlePrecoChange}
                                editable={!loading}
                                keyboardType="numeric"
                                helperText="Valor da atividade em reais (R$)"
                            />
                        </View>

                        {/* Status da Atividade */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Status</Text>
                            <View style={styles.statusButtonsContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.statusButton,
                                        status === 'ativo' && styles.statusButtonActive
                                    ]}
                                    onPress={() => setStatus('ativo')}
                                    disabled={loading}
                                >
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={20}
                                        color={status === 'ativo' ? '#FFFFFF' : '#10B981'}
                                    />
                                    <Text style={[
                                        styles.statusButtonText,
                                        status === 'ativo' && styles.statusButtonTextActive
                                    ]}>
                                        Ativo
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.statusButton,
                                        status === 'cancelado' && styles.statusButtonInactive
                                    ]}
                                    onPress={() => setStatus('cancelado')}
                                    disabled={loading}
                                >
                                    <Ionicons
                                        name="close-circle"
                                        size={20}
                                        color={status === 'cancelado' ? '#FFFFFF' : '#EF4444'}
                                    />
                                    <Text style={[
                                        styles.statusButtonText,
                                        status === 'cancelado' && styles.statusButtonTextActive
                                    ]}>
                                        Cancelado
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Ativa (campo extra - mantido para futuro uso) */}
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
                                        {ativa ? 'Esta atividade está disponível para os hóspedes' : 'Esta atividade está pausada'}
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
                    {/* Fazer Integração com o Supabase */}
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
                            onPress={() => router.push("/screens/Atividade/ListagemAtividade")}
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
    statusButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    statusButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    statusButtonActive: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    statusButtonInactive: {
        backgroundColor: '#EF4444',
        borderColor: '#EF4444',
    },
    statusButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
    },
    statusButtonTextActive: {
        color: '#FFFFFF',
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

export default EditarAtividade;