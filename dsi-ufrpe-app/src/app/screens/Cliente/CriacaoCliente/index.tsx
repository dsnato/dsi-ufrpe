import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import InputText from '@/src/components/input';
import ButtonPoint from '@/src/components/button';
import { criarCliente } from '@/src/services/clientesService';
import type { Cliente } from '@/src/services/clientesService';
import { useToast } from '@/src/components/ToastContext';

export default function CriacaoCliente() {
    const router = useRouter();
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState(false);

    const [nomeCompleto, setNomeCompleto] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [pais, setPais] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');

    const validarCampos = (): boolean => {
        if (!nomeCompleto.trim()) {
            showError('Nome completo é obrigatório');
            return false;
        }
        if (!cpf.trim()) {
            showError('CPF é obrigatório');
            return false;
        }
        if (!email.trim()) {
            showError('Email é obrigatório');
            return false;
        }
        if (!telefone.trim()) {
            showError('Telefone é obrigatório');
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
            setLoading(true);

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
            setLoading(false);
            console.log('🔵 [CriacaoCliente] handleCriar finalizado');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Novo Cliente</Text>
            
            <View style={styles.form}>
                <View style={styles.inputsContainer}>
                    <InputText 
                        label='Nome Completo'
                        leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
                        value={nomeCompleto}
                        onChangeText={setNomeCompleto}
                        editable={!loading}
                    />

                    <InputText 
                        label='CPF'
                        leftIcon={<Image source={require("@/assets/images/id-cnpj.png")} style={{ marginRight: 10 }} />}
                        value={cpf}
                        onChangeText={setCpf}
                        keyboardType="numeric"
                        editable={!loading}
                    />

                    <InputText 
                        label='E-mail'
                        leftIcon={<Image source={require("@/assets/images/at-email.png")} style={{ marginRight: 10 }} />}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                    />

                    <InputText 
                        label='Telefone'
                        leftIcon={<Image source={require("@/assets/images/callback-vector.png")} style={{ marginRight: 10 }} />}
                        value={telefone}
                        onChangeText={setTelefone}
                        keyboardType="phone-pad"
                        editable={!loading}
                    />

                    <InputText 
                        label='Endereço'
                        leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
                        value={endereco}
                        onChangeText={setEndereco}
                        editable={!loading}
                    />

                    <InputText 
                        label='Cidade'
                        leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
                        value={cidade}
                        onChangeText={setCidade}
                        editable={!loading}
                    />

                    <InputText 
                        label='Estado (ex: PE)'
                        leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
                        value={estado}
                        onChangeText={setEstado}
                        editable={!loading}
                    />

                    <InputText 
                        label='País (ex: Brasil)'
                        leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
                        value={pais}
                        onChangeText={setPais}
                        editable={!loading}
                    />

                    <InputText 
                        label='Data de Nascimento (YYYY-MM-DD)'
                        leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
                        value={dataNascimento}
                        onChangeText={setDataNascimento}
                        editable={!loading}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <ButtonPoint 
                        label={loading ? "Criando..." : "Criar Cliente"}
                        disabled={loading}
                        onPress={handleCriar} 
                    />
                    <View style={styles.separator} />
                    <Text style={styles.footerText}>
                        <Text style={styles.footerLink} onPress={() => router.back()}>
                            Voltar
                        </Text>
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#132f3b',
    },
    title: {
        color: '#ffe157',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 60,
        marginBottom: 20,
    },
    form: {
        flex: 1,
        width: '100%',
        backgroundColor: '#efeff0',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 30,
        paddingHorizontal: 24,
        paddingBottom: 20,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        marginTop: 20,
    },
    inputsContainer: {
        width: '100%',
        gap: 12,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
    },
    separator: {
        width: '80%',
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 20,
    },
    footerText: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
    },
    footerLink: {
        color: '#0162b3',
        fontWeight: 'bold',
    },
});
