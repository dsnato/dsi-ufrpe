import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import InputText from '@/src/components/input';
import ButtonPoint from '@/src/components/button';
import { criarFuncionario } from '@/src/services/funcionariosService';
import { useToast } from '@/src/components/ToastContext';

export default function CriacaoFuncionario() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Estados para cada campo
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('');
  const [salario, setSalario] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [status, setStatus] = useState('ativo');

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
      showError('E-mail é obrigatório');
      return false;
    }
    if (!telefone.trim()) {
      showError('Telefone é obrigatório');
      return false;
    }
    if (!cargo.trim()) {
      showError('Cargo é obrigatório');
      return false;
    }
    if (!salario.trim()) {
      showError('Salário é obrigatório');
      return false;
    }
    if (!dataAdmissao.trim()) {
      showError('Data de admissão é obrigatória');
      return false;
    }
    return true;
  };

  const handleCriar = async () => {
    if (!validarCampos()) {
      return;
    }

    setLoading(true);
    try {
      const novoFuncionario = {
        nome_completo: nomeCompleto,
        cpf,
        email,
        telefone,
        cargo,
        salario: parseFloat(salario),
        data_admissao: dataAdmissao,
        status
      };

      await criarFuncionario(novoFuncionario);
      
      showSuccess('Funcionário criado com sucesso!');
      router.push('/screens/Funcionario/ListagemFuncionario');
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      showError('Não foi possível criar o funcionário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Funcionário</Text>
      
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
            label='Cargo'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={cargo}
            onChangeText={setCargo}
            editable={!loading}
          />

          <InputText 
            label='Salário'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={salario}
            onChangeText={setSalario}
            keyboardType="decimal-pad"
            editable={!loading}
          />

          <InputText 
            label='Data de Admissão (YYYY-MM-DD)'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={dataAdmissao}
            onChangeText={setDataAdmissao}
            editable={!loading}
          />

          <InputText 
            label='Status (ativo/inativo)'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={status}
            onChangeText={setStatus}
            editable={!loading}
          />
        </View>

        <View style={styles.buttonContainer}>
          <ButtonPoint 
            label={loading ? "Criando..." : "Criar Funcionário"}
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