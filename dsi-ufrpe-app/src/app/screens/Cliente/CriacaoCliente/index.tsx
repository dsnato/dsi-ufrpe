import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { criarCliente } from '@/src/services/clientesService';
import type { Cliente } from '@/src/services/clientesService';
import TextButton from '@/src/components/TextButton';
import { useToast } from '@/src/components/ToastContext';

export default function CriacaoCliente() {
    const router = useRouter();
    const { showSuccess, showError } = useToast();

    const [nomeCompleto, setNomeCompleto] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [pais, setPais] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');

    const [salvando, setSalvando] = useState(false);

    const validarCampos = (): boolean => {
        if (!nomeCompleto.trim()) {
            Alert.alert('Erro', 'Nome completo é obrigatório');
            return false;
        }
        if (!cpf.trim()) {
            Alert.alert('Erro', 'CPF é obrigatório');
            return false;
        }
        if (!email.trim()) {
            Alert.alert('Erro', 'Email é obrigatório');
            return false;
        }
        if (!telefone.trim()) {
            Alert.alert('Erro', 'Telefone é obrigatório');
            return false;
        }
        return true;
    };

    const handleCriar = async () => {
        console.log('🔵 [CriacaoCliente] handleCriar iniciado');
        
        if (!validarCampos()) {
            console.log('❌ [CriacaoCliente] Validação falhou');
            return;
        }

        try {
            setSalvando(true);

            const novoCliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'> = {
                nome_completo: nomeCompleto.trim(),
                cpf: cpf.trim(),
                email: email.trim(),
                telefone: telefone.trim(),
                endereco: endereco.trim() || undefined,
                cidade: cidade.trim() || undefined,
                estado: estado.trim() || undefined,
                pais: pais.trim() || undefined,
                data_nascimento: dataNascimento || undefined,
            };

            console.log('📤 [CriacaoCliente] Enviando dados:', JSON.stringify(novoCliente, null, 2));
            
            const resultado = await criarCliente(novoCliente);
            
            console.log('✅ [CriacaoCliente] Cliente criado com sucesso:', resultado);

            showSuccess('Cliente criado com sucesso!');
            router.push('/screens/Cliente/ListagemCliente');
        } catch (error) {
            console.error('❌ [CriacaoCliente] Erro ao criar cliente:', error);
            console.error('❌ [CriacaoCliente] Detalhes do erro:', JSON.stringify(error, null, 2));
            showError('Não foi possível criar o cliente');
        } finally {
            setSalvando(false);
            console.log('🔵 [CriacaoCliente] handleCriar finalizado');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>Novo Cliente</Text>
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
                        keyboardType="numeric"
                        required
                    />
                    <TextButton
                        labelText="Email"
                        placeholder="Digite o email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        required
                    />
                    <TextButton
                        labelText="Telefone"
                        placeholder="Digite o telefone"
                        value={telefone}
                        onChangeText={setTelefone}
                        keyboardType="phone-pad"
                        required
                    />
                    <TextButton
                        labelText="Endereço"
                        placeholder="Digite o endereço"
                        value={endereco}
                        onChangeText={setEndereco}
                    />
                    <TextButton
                        labelText="Cidade"
                        placeholder="Digite a cidade"
                        value={cidade}
                        onChangeText={setCidade}
                    />
                    <TextButton
                        labelText="Estado"
                        placeholder="Digite o estado (ex: PE)"
                        value={estado}
                        onChangeText={setEstado}
                    />
                    <TextButton
                        labelText="País"
                        placeholder="Digite o país (ex: Brasil)"
                        value={pais}
                        onChangeText={setPais}
                    />
                    <TextButton
                        labelText="Data de Nascimento"
                        placeholder="YYYY-MM-DD"
                        value={dataNascimento}
                        onChangeText={setDataNascimento}
                    />
                </ScrollView>

                <TouchableOpacity
                    style={[styles.saveButton, salvando && styles.saveButtonDisabled]}
                    onPress={handleCriar}
                    disabled={salvando}
                >
                    {salvando ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.saveButtonText}>Criar Cliente</Text>
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
