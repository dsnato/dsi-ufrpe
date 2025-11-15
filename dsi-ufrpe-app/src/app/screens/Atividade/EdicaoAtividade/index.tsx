import { ActionButton } from '@/src/components/ActionButton';
import { FormInput } from '@/src/components/FormInput';
import { InfoHeader } from '@/src/components/InfoHeader';
import { Separator } from '@/src/components/Separator';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditarAtividade: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [local, setLocal] = useState('');
    const [dataAtividade, setDataAtividade] = useState('');
    const [horario, setHorario] = useState('');
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

    // Carrega os dados da atividade
    const loadAtividade = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            // TODO: Implementar AtividadeService.getById(id)
            // const data = await AtividadeService.getById(id);
            // Por enquanto, dados de exemplo:
            setNome('Aula de Yoga');
            setDescricao('Sessão relaxante de yoga para todos os níveis');
            setLocal('Área de lazer');
            setDataAtividade('15/11/2025');
            setHorario('08:00');
            setAtiva(true);
        } catch (error) {
            console.error('Erro ao carregar atividade:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados da atividade.');
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

        try {
            setLoading(true);

            const atividadeData = {
                nome: nome.trim(),
                descricao: descricao.trim(),
                local: local.trim(),
                data_atividade: dataAtividade.trim(),
                horario: horario.trim(),
                ativa,
            };

            // TODO: Implementar AtividadeService.update(id, atividadeData)
            console.log('Salvando atividade:', atividadeData);

            Alert.alert(
                'Sucesso',
                'Atividade atualizada com sucesso!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error) {
            console.error('Erro ao salvar atividade:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
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

export default EditarAtividade;