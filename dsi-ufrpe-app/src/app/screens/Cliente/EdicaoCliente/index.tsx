import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, Text, ScrollView } from 'react-native';
import InputWithText from '@/src/components/TextButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { buscarClientePorId, atualizarCliente } from '@/src/services/clientesService';
import { useToast } from '@/src/components/ToastContext';

const EditarCliente: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();
    
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [endereco, setEndereco] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [pais, setPais] = useState('');
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        carregarCliente();
    }, []);

    const carregarCliente = async () => {
        if (!id) {
            Alert.alert('Erro', 'ID do cliente não fornecido');
            router.back();
            return;
        }

        try {
            setLoading(true);
            const dados = await buscarClientePorId(id);
            if (dados) {
                setNomeCompleto(dados.nome_completo);
                setCpf(dados.cpf);
                setEmail(dados.email || '');
                setTelefone(dados.telefone || '');
                setDataNascimento(dados.data_nascimento || '');
                setEndereco(dados.endereco || '');
                setCidade(dados.cidade || '');
                setEstado(dados.estado || '');
                setPais(dados.pais || 'Brasil');
            } else {
                Alert.alert('Erro', 'Cliente não encontrado');
                router.back();
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os dados do cliente');
            router.back();
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
        return true;
    };

    const handleAtualizar = async () => {
        if (!validarCampos()) return;

        try {
            setSalvando(true);
            await atualizarCliente(id, {
                nome_completo: nomeCompleto,
                cpf,
                email: email || undefined,
                telefone: telefone || undefined,
                data_nascimento: dataNascimento || undefined,
                endereco: endereco || undefined,
                cidade: cidade || undefined,
                estado: estado || undefined,
                pais: pais || 'Brasil'
            });
            
            showSuccess('Cliente atualizado com sucesso!');
            router.back();
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : 'Erro ao atualizar cliente';
            showError(mensagem);
        } finally {
            setSalvando(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.form}>
                    <ActivityIndicator size="large" color="#4BBAED" />
                    <Text style={{marginTop: 10, color: '#64748B'}}>Carregando dados...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Image source={require("@/assets/images/callback-vector.png")}></Image>
            </TouchableOpacity>
            <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
                <InputWithText 
                    labelText="Nome Completo" 
                    placeholder="Digite o nome completo" 
                    required={true}
                    value={nomeCompleto}
                    onChangeText={setNomeCompleto}
                />
                <InputWithText 
                    labelText="CPF" 
                    placeholder="000.000.000-00" 
                    required={true}
                    value={cpf}
                    onChangeText={setCpf}
                />
                <InputWithText 
                    labelText="E-mail" 
                    placeholder="email@exemplo.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <InputWithText 
                    labelText="Telefone" 
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                />
                <InputWithText 
                    labelText="Data de Nascimento" 
                    placeholder="AAAA-MM-DD"
                    value={dataNascimento}
                    onChangeText={setDataNascimento}
                />
                <InputWithText 
                    labelText="Endereço" 
                    placeholder="Rua, número, complemento"
                    value={endereco}
                    onChangeText={setEndereco}
                />
                <InputWithText 
                    labelText="Cidade" 
                    placeholder="Digite a cidade"
                    value={cidade}
                    onChangeText={setCidade}
                />
                <InputWithText 
                    labelText="Estado" 
                    placeholder="UF (ex: PE)"
                    value={estado}
                    onChangeText={setEstado}
                />
                <InputWithText 
                    labelText="País" 
                    placeholder="País"
                    value={pais}
                    onChangeText={setPais}
                />
                <TouchableOpacity 
                    onPress={handleAtualizar}
                    disabled={salvando}
                    style={[styles.buttonConfirm, salvando && styles.buttonDisabled]}
                >
                    {salvando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Confirmar Alteração</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#132F3B',
    },
    form: {
        flex: 1,
        width: '100%',
        backgroundColor: '#EFEFF0',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 100,
    },
    formContent: {
        paddingVertical: 24,
        paddingHorizontal: 20,
    },
    buttonConfirm: {
        width: '100%',
        height: 48,
        backgroundColor: '#0162B3',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    buttonDisabled: {
        backgroundColor: '#94a3b8',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
})

export default EditarCliente;
