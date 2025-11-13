import { ActionButton } from '@/src/components/ActionButton';
import { FormInput } from '@/src/components/FormInput';
import { InfoHeader } from '@/src/components/InfoHeader';
import { Separator } from '@/src/components/Separator';
import { useToast } from '@/src/components/ToastContext';
import { buscarFuncionarioPorId, atualizarFuncionario } from '@/src/services/funcionariosService';
import { getSuccessMessage, getValidationMessage } from '@/src/utils/errorMessages';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const EditarFuncionario: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();

    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [celular, setCelular] = useState('');
    const [email, setEmail] = useState('');
    const [cargo, setCargo] = useState('');
    const [salario, setSalario] = useState('');
    const [dataAdmissao, setDataAdmissao] = useState('');
    const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo');

    // Estado para gerenciar a foto
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [hasCustomPhoto, setHasCustomPhoto] = useState(false);

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

    // Formata salário automaticamente para formato monetário
    const handleSalarioChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const numberValue = parseInt(numbersOnly || '0') / 100;
        const formatted = numberValue.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        setSalario(formatted);
    };

    // Formata data de admissão automaticamente (DD/MM/AAAA)
    const handleDataAdmissaoChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const limited = numbersOnly.slice(0, 8);

        let formatted = limited;
        if (limited.length >= 3) {
            formatted = `${limited.slice(0, 2)}/${limited.slice(2)}`;
        }
        if (limited.length >= 5) {
            formatted = `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
        }

        setDataAdmissao(formatted);
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
            
            if (data) {
                setNome(data.nome_completo);
                // Formata CPF para exibição
                const cpfFormatted = data.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                setCpf(cpfFormatted);
                // Formata telefone para exibição
                const phoneFormatted = data.telefone ? data.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') : '';
                setCelular(phoneFormatted);
                setEmail(data.email);
                setCargo(data.cargo);
                // Formata salário para exibição
                const salarioFormatted = (data.salario || 0).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
                setSalario(salarioFormatted);
                // Formata data para DD/MM/YYYY
                if (data.data_admissao) {
                    const [year, month, day] = data.data_admissao.split('-');
                    setDataAdmissao(`${day}/${month}/${year}`);
                }
                setStatus((data.status?.toLowerCase() === 'ativo' ? 'ativo' : 'inativo') as 'ativo' | 'inativo');

                // TODO: Carregar foto do Supabase Storage se existir
                // if (data.foto_url) {
                //     setPhotoUri(data.foto_url);
                //     setHasCustomPhoto(true);
                // }
            }
        } catch (error) {
            console.error('Erro ao carregar funcionário:', error);
            showError('Não foi possível carregar os dados do funcionário.');
        } finally {
            setLoading(false);
        }
    }, [id, showError]);

    useFocusEffect(
        useCallback(() => {
            loadFuncionario();
        }, [loadFuncionario])
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

        if (!cargo.trim()) {
            showError('Cargo é obrigatório');
            return;
        }

        if (!salario.trim()) {
            showError('Salário é obrigatório');
            return;
        }

        if (!dataAdmissao.trim()) {
            showError('Data de admissão é obrigatória');
            return;
        }

        // Valida formato da data
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(dataAdmissao)) {
            showError('Data de admissão inválida. Use o formato DD/MM/AAAA');
            return;
        }

        try {
            setLoading(true);

            // Converte data de DD/MM/YYYY para YYYY-MM-DD
            const [day, month, year] = dataAdmissao.split('/');
            const dataFormatted = `${year}-${month}-${day}`;

            const funcionarioData = {
                nome_completo: nome.trim(),
                cpf: cpf.replace(/\D/g, ''), // Remove formatação
                telefone: celular.replace(/\D/g, ''), // Remove formatação
                email: email.trim().toLowerCase(),
                cargo: cargo.trim(),
                salario: parseFloat(salario.replace(/\./g, '').replace(',', '.')),
                data_admissao: dataFormatted,
                status: status.charAt(0).toUpperCase() + status.slice(1), // Ativo ou Inativo
            };

            await atualizarFuncionario(id as string, funcionarioData);

            showSuccess(getSuccessMessage('update'));

            setTimeout(() => {
                router.push('/screens/Funcionario/ListagemFuncionario');
            }, 2000);
        } catch (error) {
            console.error('Erro ao salvar funcionário:', error);
            showError('Ocorreu um erro ao salvar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <InfoHeader entity="Funcionários" onBackPress={() => router.push('/screens/Funcionario/ListagemFuncionario')} />

            <View style={styles.content}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Título da seção */}
                    <View style={styles.titleContainer}>
                        <Ionicons name="create-outline" size={24} color="#0162B3" />
                        <Text style={styles.title}>Editar Funcionário</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Atualize as informações do funcionário
                    </Text>

                    <Separator marginTop={16} marginBottom={24} />

                    {/* Seção de Foto de Perfil */}
                    <View style={styles.photoSection}>
                        <Text style={styles.photoLabel}>Foto de Perfil</Text>

                        <View style={styles.photoContainer}>
                            {/* Avatar */}
                            <View style={styles.avatarWrapper}>
                                {photoUri ? (
                                    <Image
                                        source={{ uri: photoUri }}
                                        style={styles.avatar}
                                    />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <Ionicons name="person" size={50} color="#94A3B8" />
                                    </View>
                                )}

                                {/* Botão de editar foto */}
                                <TouchableOpacity
                                    style={styles.editPhotoButton}
                                    onPress={handleSelectPhoto}
                                    disabled={loading}
                                >
                                    <Ionicons name="camera" size={18} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>

                            {/* Botões de ação da foto */}
                            <View style={styles.photoActions}>
                                <TouchableOpacity
                                    style={styles.photoActionButton}
                                    onPress={handleSelectPhoto}
                                    disabled={loading}
                                >
                                    <Ionicons name="cloud-upload-outline" size={20} color="#0162B3" />
                                    <Text style={styles.photoActionText}>
                                        {hasCustomPhoto ? 'Alterar Foto' : 'Adicionar Foto'}
                                    </Text>
                                </TouchableOpacity>

                                {hasCustomPhoto && (
                                    <TouchableOpacity
                                        style={[styles.photoActionButton, styles.removeButton]}
                                        onPress={handleRemovePhoto}
                                        disabled={loading}
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                        <Text style={[styles.photoActionText, styles.removeText]}>
                                            Remover Foto
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <Text style={styles.photoHelper}>
                            Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB
                        </Text>
                    </View>

                    <Separator marginTop={24} marginBottom={24} />

                    {/* Formulário */}
                    <View style={styles.form}>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Nome Completo <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="person-outline"
                                placeholder="Ex: Ana Clara Silva"
                                value={nome}
                                onChangeText={setNome}
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
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
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
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
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
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
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Cargo <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="briefcase-outline"
                                placeholder="Ex: Recepcionista, Gerente"
                                value={cargo}
                                onChangeText={setCargo}
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Salário <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="cash-outline"
                                placeholder="0,00"
                                value={salario}
                                onChangeText={handleSalarioChange}
                                editable={!loading}
                                keyboardType="numeric"
                                helperText="Formato: 2.500,00"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Data de Admissão <Text style={styles.required}>*</Text>
                            </Text>
                            <FormInput
                                icon="calendar-outline"
                                placeholder="DD/MM/AAAA"
                                value={dataAdmissao}
                                onChangeText={handleDataAdmissaoChange}
                                editable={!loading}
                                keyboardType="numeric"
                                maxLength={10}
                                helperText="Formato: DD/MM/AAAA"
                            />
                        </View>

                        {/* Status do Funcionário */}
                        <View style={styles.switchContainer}>
                            <View style={styles.switchLabel}>
                                <Ionicons
                                    name={status === 'ativo' ? "checkmark-circle" : "close-circle"}
                                    size={24}
                                    color={status === 'ativo' ? "#10B981" : "#6B7280"}
                                />
                                <View style={styles.switchTextContainer}>
                                    <Text style={styles.switchTitle}>Funcionário Ativo</Text>
                                    <Text style={styles.switchDescription}>
                                        {status === 'ativo' ? 'Este funcionário está ativo no sistema' : 'Este funcionário está inativo'}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={status === 'ativo'}
                                onValueChange={(value) => setStatus(value ? 'ativo' : 'inativo')}
                                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                                thumbColor={status === 'ativo' ? '#FFFFFF' : '#F3F4F6'}
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
                            onPress={() => router.push('/screens/Funcionario/ListagemFuncionario')}
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
    // Estilos da seção de foto
    photoSection: {
        alignItems: 'center',
        gap: 16,
    },
    photoLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#334155',
        alignSelf: 'flex-start',
    },
    photoContainer: {
        alignItems: 'center',
        gap: 16,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        backgroundColor: '#E2E8F0',
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editPhotoButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0162B3',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
    photoActions: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    photoActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#0162B3',
        backgroundColor: '#FFFFFF',
    },
    removeButton: {
        borderColor: '#EF4444',
    },
    photoActionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0162B3',
    },
    removeText: {
        color: '#EF4444',
    },
    photoHelper: {
        fontSize: 12,
        color: '#64748B',
        textAlign: 'center',
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

export default EditarFuncionario;