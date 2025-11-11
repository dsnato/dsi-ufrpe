import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/src/components/ScreenWrapper';
import TextInputRounded from '@/src/components/TextInputRounded';
import Button from '@/src/components/button';
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
      Alert.alert('Erro de Validação', 'Nome é obrigatório');
      return false;
    }
    if (!descricao.trim()) {
      Alert.alert('Erro de Validação', 'Descrição é obrigatória');
      return false;
    }
    if (!dataHora.trim()) {
      Alert.alert('Erro de Validação', 'Data e hora são obrigatórias');
      return false;
    }
    if (!local.trim()) {
      Alert.alert('Erro de Validação', 'Local é obrigatório');
      return false;
    }
    if (!capacidadeMaxima.trim()) {
      Alert.alert('Erro de Validação', 'Capacidade máxima é obrigatória');
      return false;
    }
    if (!vagasDisponiveis.trim()) {
      Alert.alert('Erro de Validação', 'Vagas disponíveis são obrigatórias');
      return false;
    }
    if (!responsavelId.trim()) {
      Alert.alert('Erro de Validação', 'ID do responsável é obrigatório');
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
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Criar Nova Atividade</Text>

        <View style={styles.formContainer}>
          <TextInputRounded
            placeholder="Nome da Atividade"
            value={nome}
            onChangeText={setNome}
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={3}
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Data e Hora (YYYY-MM-DD HH:MM:SS)"
            value={dataHora}
            onChangeText={setDataHora}
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Local"
            value={local}
            onChangeText={setLocal}
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Capacidade Máxima"
            value={capacidadeMaxima}
            onChangeText={setCapacidadeMaxima}
            keyboardType="numeric"
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Vagas Disponíveis"
            value={vagasDisponiveis}
            onChangeText={setVagasDisponiveis}
            keyboardType="numeric"
            editable={!loading}
          />

          <TextInputRounded
            placeholder="ID do Responsável"
            value={responsavelId}
            onChangeText={setResponsavelId}
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Status (aberta/encerrada/cancelada)"
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
                  label="Criar Atividade"
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