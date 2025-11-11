import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/src/components/ScreenWrapper';
import TextInputRounded from '@/src/components/TextInputRounded';
import Button from '@/src/components/button';
import { criarQuarto } from '@/src/services/quartosService';
import { useToast } from '@/src/components/ToastContext';

export default function CriacaoQuarto() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Estados para cada campo
  const [numeroQuarto, setNumeroQuarto] = useState('');
  const [tipo, setTipo] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [precoDiaria, setPrecoDiaria] = useState('');
  const [status, setStatus] = useState('disponível');
  const [descricao, setDescricao] = useState('');

  const validarCampos = (): boolean => {
    if (!numeroQuarto.trim()) {
      Alert.alert('Erro de Validação', 'Número do quarto é obrigatório');
      return false;
    }
    if (!tipo.trim()) {
      Alert.alert('Erro de Validação', 'Tipo é obrigatório');
      return false;
    }
    if (!capacidade.trim()) {
      Alert.alert('Erro de Validação', 'Capacidade é obrigatória');
      return false;
    }
    if (!precoDiaria.trim()) {
      Alert.alert('Erro de Validação', 'Preço da diária é obrigatório');
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
      const novoQuarto = {
        numero_quarto: numeroQuarto,
        tipo,
        capacidade: parseInt(capacidade),
        preco_diario: parseFloat(precoDiaria),
        status,
        descricao: descricao || null
      };

      await criarQuarto(novoQuarto);
      
      showSuccess('Quarto criado com sucesso!');
      router.push('/screens/Quarto/ListagemQuarto');
    } catch (error) {
      console.error('Erro ao criar quarto:', error);
      showError('Não foi possível criar o quarto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Criar Novo Quarto</Text>

        <View style={styles.formContainer}>
          <TextInputRounded
            placeholder="Número do Quarto"
            value={numeroQuarto}
            onChangeText={setNumeroQuarto}
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Tipo (ex: Single, Double, Suite)"
            value={tipo}
            onChangeText={setTipo}
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Capacidade"
            value={capacidade}
            onChangeText={setCapacidade}
            keyboardType="numeric"
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Preço da Diária"
            value={precoDiaria}
            onChangeText={setPrecoDiaria}
            keyboardType="decimal-pad"
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Status (disponível/ocupado/manutenção)"
            value={status}
            onChangeText={setStatus}
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Descrição (opcional)"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
            editable={!loading}
          />

          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <>
                <Button
                  label="Criar Quarto"
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