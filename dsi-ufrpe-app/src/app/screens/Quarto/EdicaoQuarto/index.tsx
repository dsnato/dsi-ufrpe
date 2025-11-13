import { ActionButton } from '@/src/components/ActionButton';
import { FormInput } from '@/src/components/FormInput';
import { InfoHeader } from '@/src/components/InfoHeader';
import { Separator } from '@/src/components/Separator';
import { buscarQuartoPorId, atualizarQuarto } from '@/src/services/quartosService';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const EditarQuarto: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [loading, setLoading] = useState(false);
    const [numero, setNumero] = useState('');
    const [tipo, setTipo] = useState('');
    const [capacidade, setCapacidade] = useState('');
    const [preco, setPreco] = useState('');
    const [status, setStatus] = useState<'disponivel' | 'ocupado' | 'manutencao'>('disponivel');
    const [descricao, setDescricao] = useState('');

    // Formata o preço automaticamente para formato monetário
    const handlePriceChange = (text: string) => {
        // Remove tudo que não é número
        const numbersOnly = text.replace(/\D/g, '');

        // Converte para número e formata
        const numberValue = parseInt(numbersOnly || '0') / 100;

        // Formata para moeda brasileira
        const formatted = numberValue.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        setPreco(formatted);
    };

    // Formata capacidade para aceitar apenas números
    const handleCapacidadeChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const limited = numbersOnly.slice(0, 2); // Limita a 2 dígitos
        setCapacidade(limited);
    };

    // Formata número do quarto para aceitar apenas números
    const handleNumeroChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const limited = numbersOnly.slice(0, 4); // Limita a 4 dígitos
        setNumero(limited);
    };

    // Carrega os dados do quarto
    const loadQuarto = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await buscarQuartoPorId(id as string);
            
            if (data) {
                setNumero(data.numero_quarto);
                setTipo(data.tipo);
                setCapacidade(data.capacidade_pessoas.toString());
                const precoFormatted = data.preco_diario.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
                setPreco(precoFormatted);
                setStatus((data.status?.toLowerCase() || 'disponivel') as 'disponivel' | 'ocupado' | 'manutencao');
                setDescricao(data.descricao || '');
            }
        } catch (error) {
            console.error('Erro ao carregar quarto:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do quarto.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useFocusEffect(
        useCallback(() => {
            loadQuarto();
        }, [loadQuarto])
    );

    const handleSave = async () => {
        // Validações
        if (!numero.trim()) {
            Alert.alert('Atenção', 'O número do quarto é obrigatório.');
            return;
        }

        if (!tipo.trim()) {
            Alert.alert('Atenção', 'O tipo do quarto é obrigatório.');
            return;
        }

        if (!capacidade.trim()) {
            Alert.alert('Atenção', 'A capacidade do quarto é obrigatória.');
            return;
        }

        const capacidadeNum = parseInt(capacidade);
        if (capacidadeNum < 1 || capacidadeNum > 10) {
            Alert.alert('Atenção', 'A capacidade deve ser entre 1 e 10 pessoas.');
            return;
        }

        if (!preco.trim()) {
            Alert.alert('Atenção', 'O preço do quarto é obrigatório.');
            return;
        }

        // Valida se o preço é maior que zero
        const precoNum = parseFloat(preco.replace(',', '.'));
        if (precoNum <= 0) {
            Alert.alert('Atenção', 'O preço deve ser maior que zero.');
            return;
        }

        try {
            setLoading(true);

            const quartoData = {
                numero_quarto: numero.trim(),
                tipo: tipo.trim(),
                capacidade_pessoas: parseInt(capacidade),
                preco_diario: parseFloat(preco.replace(/\./g, '').replace(',', '.')),
                status: status.charAt(0).toUpperCase() + status.slice(1), // Disponivel, Ocupado, Manutencao
                descricao: descricao.trim() || undefined,
            };

            await atualizarQuarto(id as string, quartoData);
            console.log('Salvando quarto:', quartoData);

            Alert.alert(
                'Sucesso',
                'Quarto atualizado com sucesso!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.push('/screens/Quarto/ListagemQuarto'),
                    },
                ]
            );
        } catch (error) {
            console.error('Erro ao salvar quarto:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <InfoHeader entity="Quartos" onBackPress={() => router.push('/screens/Quarto/ListagemQuarto')} />

            <View style={styles.content}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Título da seção */}
                    <View style={styles.titleContainer}>
                        <Ionicons name="create-outline" size={24} color="#0162B3" />
                        <Text style={styles.title}>Editar Quarto</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Atualize as informações do quarto
                    </Text>

                    <Separator marginTop={16} marginBottom={24} />

                    {/* Formulário */}
                    <View style={styles.form}>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Número do Quarto <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="home-outline"
                                placeholder="Ex: 101"
                                value={numero}
                                onChangeText={handleNumeroChange}
                                editable={!loading}
                                keyboardType="numeric"
                                maxLength={4}
                                helperText="Número de identificação do quarto"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Tipo do Quarto <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="bed-outline"
                                placeholder="Ex: Standard, Luxo, Premium"
                                value={tipo}
                                onChangeText={setTipo}
                                editable={!loading}
                                helperText="Categoria ou classificação do quarto"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Capacidade <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="people-outline"
                                placeholder="Ex: 2"
                                value={capacidade}
                                onChangeText={handleCapacidadeChange}
                                editable={!loading}
                                keyboardType="numeric"
                                maxLength={2}
                                helperText="Número máximo de hóspedes (1-10)"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Preço da Diária <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="cash-outline"
                                placeholder="0,00"
                                value={preco}
                                onChangeText={handlePriceChange}
                                editable={!loading}
                                keyboardType="numeric"
                                helperText="Valor da diária em reais (R$)"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Descrição</Text>
                            <FormInput
                                icon="document-text-outline"
                                placeholder="Descrição do quarto (opcional)"
                                value={descricao}
                                onChangeText={setDescricao}
                                editable={!loading}
                                multiline
                                numberOfLines={4}
                                helperText="Detalhes e comodidades do quarto"
                            />
                        </View>

                        {/* Status do Quarto */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Status</Text>
                            <View style={styles.statusButtonsRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.statusButtonSmall,
                                        status === 'disponivel' && styles.statusButtonDisponivel
                                    ]}
                                    onPress={() => setStatus('disponivel')}
                                    disabled={loading}
                                >
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={18}
                                        color={status === 'disponivel' ? '#FFFFFF' : '#10B981'}
                                    />
                                    <Text style={[
                                        styles.statusButtonTextSmall,
                                        status === 'disponivel' && styles.statusButtonTextActive
                                    ]}>
                                        Disponível
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.statusButtonSmall,
                                        status === 'ocupado' && styles.statusButtonOcupado
                                    ]}
                                    onPress={() => setStatus('ocupado')}
                                    disabled={loading}
                                >
                                    <Ionicons
                                        name="close-circle"
                                        size={18}
                                        color={status === 'ocupado' ? '#FFFFFF' : '#EF4444'}
                                    />
                                    <Text style={[
                                        styles.statusButtonTextSmall,
                                        status === 'ocupado' && styles.statusButtonTextActive
                                    ]}>
                                        Ocupado
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.statusButtonSmall,
                                        status === 'manutencao' && styles.statusButtonManutencao
                                    ]}
                                    onPress={() => setStatus('manutencao')}
                                    disabled={loading}
                                >
                                    <Ionicons
                                        name="build-outline"
                                        size={18}
                                        color={status === 'manutencao' ? '#FFFFFF' : '#F59E0B'}
                                    />
                                    <Text style={[
                                        styles.statusButtonTextSmall,
                                        status === 'manutencao' && styles.statusButtonTextActive
                                    ]}>
                                        Manutenção
                                    </Text>
                                </TouchableOpacity>
                            </View>
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
                            onPress={() => router.push('/screens/Quarto/ListagemQuarto')}
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
    statusButtonsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    statusButtonSmall: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    statusButtonDisponivel: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    statusButtonOcupado: {
        backgroundColor: '#EF4444',
        borderColor: '#EF4444',
    },
    statusButtonManutencao: {
        backgroundColor: '#F59E0B',
        borderColor: '#F59E0B',
    },
    statusButtonTextSmall: {
        fontSize: 12,
        fontWeight: '600',
        color: '#334155',
    },
    statusButtonTextActive: {
        color: '#FFFFFF',
    },
    actions: {
        gap: 12,
    },
});

export default EditarQuarto;