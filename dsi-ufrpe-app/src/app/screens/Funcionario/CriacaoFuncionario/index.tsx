import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/src/components/ScreenWrapper';
import TextInputRounded from '@/src/components/TextInputRounded';
import Button from '@/src/components/button';
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
      Alert.alert('Erro de Validação', 'Nome completo é obrigatório');
      return false;
    }
    if (!cpf.trim()) {
      Alert.alert('Erro de Validação', 'CPF é obrigatório');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Erro de Validação', 'E-mail é obrigatório');
      return false;
    }
    if (!telefone.trim()) {
      Alert.alert('Erro de Validação', 'Telefone é obrigatório');
      return false;
    }
    if (!cargo.trim()) {
      Alert.alert('Erro de Validação', 'Cargo é obrigatório');
      return false;
    }
    if (!salario.trim()) {
      Alert.alert('Erro de Validação', 'Salário é obrigatório');
      return false;
    }
    if (!dataAdmissao.trim()) {
      Alert.alert('Erro de Validação', 'Data de admissão é obrigatória');
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
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Criar Novo Funcionário</Text>

        <View style={styles.formContainer}>
          <TextInputRounded
            placeholder="Nome Completo"
            value={nomeCompleto}
            onChangeText={setNomeCompleto}
            editable={!loading}
          />

          <TextInputRounded
            placeholder="CPF"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
            editable={!loading}
          />

          <TextInputRounded
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Cargo"
            value={cargo}
            onChangeText={setCargo}
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Salário"
            value={salario}
            onChangeText={setSalario}
            keyboardType="decimal-pad"
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Data de Admissão (YYYY-MM-DD)"
            value={dataAdmissao}
            onChangeText={setDataAdmissao}
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Status (ativo/inativo)"
            value={status}
            onChangeText={setStatus}
            editable={!loading}
          />

          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <>
                <Button
                  label="Criar Funcionário"
                  onPress={handleCriar}
                />
                <Button
                  label="Cancelar"
                  onPress={() => router.back()}
                />
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  formContainer: {
    gap: 15,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
});