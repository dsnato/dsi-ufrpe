import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { listarFuncionarios, buscarFuncionarioPorId, atualizarFuncionario, Funcionario } from '@/src/services/funcionariosService';
import TextButton from '@/src/components/TextButton';
import { useToast } from '@/src/components/ToastContext';

export default function EdicaoFuncionario() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();

    const [nomeCompleto, setNomeCompleto] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cargo, setCargo] = useState('');
    const [salario, setSalario] = useState('');
    const [dataAdmissao, setDataAdmissao] = useState('');
    const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo');

    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        carregarFuncionario();
    }, [id]);

    const carregarFuncionario = async () => {
        if (!id) {
            Alert.alert('Erro', 'ID do funcionário não fornecido');
            router.back();
            return;
        }

        try {
            setLoading(true);
            const funcionario = await buscarFuncionarioPorId(id);

            if (!funcionario) {
                Alert.alert('Erro', 'Funcionário não encontrado');
                router.back();
                return;
            }

            setNomeCompleto(funcionario.nome_completo || '');
            setCpf(funcionario.cpf || '');
            setEmail(funcionario.email || '');
            setTelefone(funcionario.telefone || '');
            setCargo(funcionario.cargo || '');
            setSalario(funcionario.salario?.toString() || '');
            setDataAdmissao(funcionario.data_admissao || '');
            setStatus(funcionario.status as 'ativo' | 'inativo' || 'ativo');
        } catch (error) {
            console.error('Erro ao carregar funcionário:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do funcionário');
        } finally {
            setLoading(false);
        }
    };

    const validarCampos = (): boolean => {
        if (!nomeCompleto.trim()) {
            Alert.alert('Erro', 'Nome completo é obrigatório');
            return false;
        }
        if (!cpf.trim()) {
            Alert.alert('Erro', 'CPF é obrigatório');
            return false;
        }
        if (!cargo.trim()) {
            Alert.alert('Erro', 'Cargo é obrigatório');
            return false;
        }
        if (!salario.trim()) {
            Alert.alert('Erro', 'Salário é obrigatório');
            return false;
        }
        if (isNaN(Number(salario))) {
            Alert.alert('Erro', 'Salário deve ser um número válido');
            return false;
        }
        return true;
    };

    const handleAtualizar = async () => {
        if (!validarCampos()) return;

        try {
            setSalvando(true);
            const dados: Partial<Funcionario> = {
                nome_completo: nomeCompleto,
                cpf,
                email: email || undefined,
                telefone: telefone || undefined,
                cargo,
                salario: Number(salario),
                data_admissao: dataAdmissao || undefined,
                status
            };

            await atualizarFuncionario(id, dados);
            showSuccess('Funcionário atualizado com sucesso!');
            router.back();
        } catch (error) {
            console.error('Erro ao atualizar funcionário:', error);
            showError('Não foi possível atualizar o funcionário');
        } finally {
            setSalvando(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Editar Funcionário</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0162B3" />
                    <Text style={styles.loadingText}>Carregando...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>Editar Funcionário</Text>
            </View>

            <View style={styles.formContainer}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <TextButton
                        labelText="Nome Completo"
                        placeholder="Digite o nome completo"
                        value={nomeCompleto}
                        onChangeText={setNomeCompleto}
                        required
                    />
                    <TextButton
                        labelText="CPF"
                        placeholder="Digite o CPF"
                        value={cpf}
                        onChangeText={setCpf}
                        required
                    />
                    <TextButton
                        labelText="Email"
                        placeholder="Digite o email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <TextButton
                        labelText="Telefone"
                        placeholder="Digite o telefone"
                        value={telefone}
                        onChangeText={setTelefone}
                        keyboardType="phone-pad"
                    />
                    <TextButton
                        labelText="Cargo"
                        placeholder="Digite o cargo"
                        value={cargo}
                        onChangeText={setCargo}
                        required
                    />
                    <TextButton
                        labelText="Salário"
                        placeholder="Digite o salário"
                        value={salario}
                        onChangeText={setSalario}
                        keyboardType="decimal-pad"
                        required
                    />
                    <TextButton
                        labelText="Data de Admissão"
                        placeholder="YYYY-MM-DD"
                        value={dataAdmissao}
                        onChangeText={setDataAdmissao}
                    />
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusLabel}>Status</Text>
                        <View style={styles.statusButtons}>
                            <TouchableOpacity
                                style={[styles.statusButton, status === 'ativo' && styles.statusButtonActive]}
                                onPress={() => setStatus('ativo')}
                            >
                                <Text style={[styles.statusButtonText, status === 'ativo' && styles.statusButtonTextActive]}>
                                    Ativo
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.statusButton, status === 'inativo' && styles.statusButtonActive]}
                                onPress={() => setStatus('inativo')}
                            >
                                <Text style={[styles.statusButtonText, status === 'inativo' && styles.statusButtonTextActive]}>
                                    Inativo
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={[styles.saveButton, salvando && styles.saveButtonDisabled]}
                    onPress={handleAtualizar}
                    disabled={salvando}
                >
                    {salvando ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#132F3B',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748B',
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 20,
    },
    scrollView: {
        flex: 1,
    },
    statusContainer: {
        marginTop: 16,
        marginBottom: 20,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 12,
    },
    statusButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    statusButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    statusButtonActive: {
        backgroundColor: '#0162B3',
        borderColor: '#0162B3',
    },
    statusButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    statusButtonTextActive: {
        color: '#FFFFFF',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0162B3',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 16,
        gap: 8,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
