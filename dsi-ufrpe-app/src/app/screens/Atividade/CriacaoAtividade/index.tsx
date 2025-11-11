import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import InputText from '@/src/components/input';
import ButtonPoint from '@/src/components/button';
import { criarAtividade } from '@/src/services/atividadesService';
import { useToast } from '@/src/components/ToastContext';

export default function CriacaoAtividade() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Estados para cada campo
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [local, setLocal] = useState('');
  const [capacidadeMaxima, setCapacidadeMaxima] = useState('');
  const [vagasDisponiveis, setVagasDisponiveis] = useState('');
  const [responsavelId, setResponsavelId] = useState('');
  const [status, setStatus] = useState('aberta');

  const validarCampos = (): boolean => {
    if (!nome.trim()) {
      showError('Nome é obrigatório');
      return false;
    }
    if (!descricao.trim()) {
      showError('Descrição é obrigatória');
      return false;
    }
    if (!dataHora.trim()) {
      showError('Data e hora são obrigatórias');
      return false;
    }
    if (!local.trim()) {
      showError('Local é obrigatório');
      return false;
    }
    if (!capacidadeMaxima.trim()) {
      showError('Capacidade máxima é obrigatória');
      return false;
    }
    if (!vagasDisponiveis.trim()) {
      showError('Vagas disponíveis são obrigatórias');
      return false;
    }
    if (!responsavelId.trim()) {
      showError('ID do responsável é obrigatório');
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
      const novaAtividade = {
        nome,
        descricao,
        data_hora: dataHora,
        local,
        capacidade_maxima: parseInt(capacidadeMaxima),
        vagas_disponiveis: parseInt(vagasDisponiveis),
        responsavel_id: responsavelId,
        status
      };

      await criarAtividade(novaAtividade);
      
      showSuccess('Atividade criada com sucesso!');
      router.push('/screens/Atividade/ListagemAtividade');
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      showError('Não foi possível criar a atividade. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Atividade</Text>
      
      <View style={styles.form}>
        <View style={styles.inputsContainer}>
          <InputText 
            label='Nome da Atividade'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={nome}
            onChangeText={setNome}
            editable={!loading}
          />

          <InputText 
            label='Descrição'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={descricao}
            onChangeText={setDescricao}
            multiline
            editable={!loading}
          />

          <InputText 
            label='Data e Hora (YYYY-MM-DD HH:MM:SS)'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={dataHora}
            onChangeText={setDataHora}
            editable={!loading}
          />

          <InputText 
            label='Local'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={local}
            onChangeText={setLocal}
            editable={!loading}
          />

          <InputText 
            label='Capacidade Máxima'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={capacidadeMaxima}
            onChangeText={setCapacidadeMaxima}
            keyboardType="numeric"
            editable={!loading}
          />

          <InputText 
            label='Vagas Disponíveis'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={vagasDisponiveis}
            onChangeText={setVagasDisponiveis}
            keyboardType="numeric"
            editable={!loading}
          />

          <InputText 
            label='ID do Responsável'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={responsavelId}
            onChangeText={setResponsavelId}
            editable={!loading}
          />

          <InputText 
            label='Status (aberta/encerrada/cancelada)'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={status}
            onChangeText={setStatus}
            editable={!loading}
          />
        </View>

        <View style={styles.buttonContainer}>
          <ButtonPoint 
            label={loading ? "Criando..." : "Criar Atividade"}
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