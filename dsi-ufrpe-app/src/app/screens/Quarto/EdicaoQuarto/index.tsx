import { ActionButton } from '@/src/components/ActionButton';
import { FormInput } from '@/src/components/FormInput';
import { InfoHeader } from '@/src/components/InfoHeader';
import { Separator } from '@/src/components/Separator';
import { useToast } from '@/src/components/ToastContext';
import { getSuccessMessage, getValidationMessage } from '@/src/utils/errorMessages';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditarQuarto: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();

    const [loading, setLoading] = useState(false);
    const [numero, setNumero] = useState('');
    const [tipo, setTipo] = useState('');
    const [capacidade, setCapacidade] = useState('');
    const [preco, setPreco] = useState('');
    const [disponivel, setDisponivel] = useState(true);

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
            // TODO: Implementar QuartoService.getById(id)
            // const data = await QuartoService.getById(id);
            // Por enquanto, dados de exemplo:
            setNumero('101');
            setTipo('Luxo');
            setCapacidade('2');
            setPreco('250,00');
            setDisponivel(true);
        } catch (error) {
            console.error('Erro ao carregar quarto:', error);
            showError('Não foi possível carregar os dados do quarto.');
        } finally {
            setLoading(false);
        }
    }, [id, showError]);

    useFocusEffect(
        useCallback(() => {
            loadQuarto();
        }, [loadQuarto])
    );

    const handleSave = async () => {
        // Validações
        if (!numero.trim()) {
            showError(getValidationMessage('numero_quarto', 'required'));
            return;
        }

        if (!tipo.trim()) {
            showError(getValidationMessage('tipo_quarto', 'required'));
            return;
        }

        if (!capacidade.trim()) {
            showError(getValidationMessage('capacidade', 'required'));
            return;
        }

        const capacidadeNum = parseInt(capacidade);
        if (capacidadeNum < 1 || capacidadeNum > 10) {
            showError(getValidationMessage('capacidade', 'invalid'));
            return;
        }

        if (!preco.trim()) {
            showError(getValidationMessage('preco', 'required'));
            return;
        }

        // Valida se o preço é maior que zero
        const precoNum = parseFloat(preco.replace(',', '.'));
        if (precoNum <= 0) {
            showError(getValidationMessage('preco', 'invalid'));
            return;
        }

        try {
            setLoading(true);

            const quartoData = {
                numero: parseInt(numero),
                tipo: tipo.trim(),
                capacidade: parseInt(capacidade),
                preco_diaria: parseFloat(preco.replace(',', '.')),
                disponivel,
            };

            // TODO: Implementar QuartoService.update(id, quartoData)
            console.log('Salvando quarto:', quartoData);

            showSuccess(getSuccessMessage('update'));

            setTimeout(() => {
                router.push('/screens/Quarto/ListagemQuarto');
            }, 2000);
        } catch (error) {
            console.error('Erro ao salvar quarto:', error);
            showError('Ocorreu um erro ao salvar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
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

                        {/* Status do Quarto */}
                        <View style={styles.switchContainer}>
                            <View style={styles.switchLabel}>
                                <Ionicons
                                    name={disponivel ? "checkmark-circle" : "close-circle"}
                                    size={24}
                                    color={disponivel ? "#10B981" : "#6B7280"}
                                />
                                <View style={styles.switchTextContainer}>
                                    <Text style={styles.switchTitle}>Quarto Disponível</Text>
                                    <Text style={styles.switchDescription}>
                                        {disponivel ? 'Este quarto está disponível para reservas' : 'Este quarto está indisponível'}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={disponivel}
                                onValueChange={setDisponivel}
                                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                                thumbColor={disponivel ? '#FFFFFF' : '#F3F4F6'}
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
                            onPress={() => router.push('/screens/Quarto/ListagemQuarto')}
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

export default EditarQuarto;