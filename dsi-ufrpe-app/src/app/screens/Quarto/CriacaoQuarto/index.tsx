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
                numero: numeroInt,
                tipo: tipo,
                capacidade: capacidadeInt,
                preco_diaria: precoNumerico,
                descricao: descricao.trim() || null,
                disponivel: disponivel,
            };

            // TODO: Implementar QuartoService.create(quartoData)
            console.log('Criando quarto:', quartoData);

            showSuccess(getSuccessMessage('create'));

            setTimeout(() => {
                router.push('/screens/Quarto/ListagemQuarto');
            }, 2000);
        } catch (error) {
            console.error('Erro ao criar quarto:', error);
            showError('Ocorreu um erro ao criar o quarto. Tente novamente.');
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
                        <Ionicons name="add-circle-outline" size={24} color="#0162B3" />
                        <Text style={styles.title}>Novo Quarto</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Cadastre um novo quarto no sistema
                    </Text>

                    <Separator marginTop={16} marginBottom={24} />

                    {/* Formulário */}
                    <View style={styles.form}>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
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
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
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

                        <View style={styles.row}>
                            <View style={[styles.fieldGroup, styles.halfWidth]}>
                                <Text style={styles.label}>
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
                                />
                            </View>

                            <View style={[styles.fieldGroup, styles.halfWidth]}>
                                <Text style={styles.label}>
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
                                />
                            </View>
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Descrição</Text>
                            <FormInput
                                icon="document-text-outline"
                                placeholder="Características e amenidades do quarto (opcional)"
                                value={descricao}
                                onChangeText={setDescricao}
                                editable={!loading}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        {/* Status de Disponibilidade */}
                        <View style={styles.switchContainer}>
                            <View style={styles.switchLabel}>
                                <Ionicons
                                    name={disponivel ? "checkmark-circle" : "close-circle"}
                                    size={24}
                                    color={disponivel ? "#10B981" : "#EF4444"}
                                />
                                <View style={styles.switchTextContainer}>
                                    <Text style={styles.switchTitle}>
                                        {disponivel ? 'Quarto Disponível' : 'Quarto Indisponível'}
                                    </Text>
                                    <Text style={styles.switchDescription}>
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
                            {loading ? 'Criando...' : 'Criar Quarto'}
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

export default CriarQuarto;