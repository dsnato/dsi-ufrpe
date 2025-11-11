import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import InputText from '@/src/components/input';
import ButtonPoint from '@/src/components/button';
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
      showError('Número do quarto é obrigatório');
      return false;
    }
    if (!tipo.trim()) {
      showError('Tipo é obrigatório');
      return false;
    }
    if (!capacidade.trim()) {
      showError('Capacidade é obrigatória');
      return false;
    }
    if (!precoDiaria.trim()) {
      showError('Preço da diária é obrigatório');
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
    <View style={styles.container}>
      <Text style={styles.title}>Novo Quarto</Text>
      
      <View style={styles.form}>
        <View style={styles.inputsContainer}>
          <InputText 
            label='Número do Quarto'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={numeroQuarto}
            onChangeText={setNumeroQuarto}
            editable={!loading}
          />

          <InputText 
            label='Tipo (ex: Single, Double, Suite)'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={tipo}
            onChangeText={setTipo}
            editable={!loading}
          />

          <InputText 
            label='Capacidade'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={capacidade}
            onChangeText={setCapacidade}
            keyboardType="numeric"
            editable={!loading}
          />

          <InputText 
            label='Preço da Diária'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={precoDiaria}
            onChangeText={setPrecoDiaria}
            keyboardType="decimal-pad"
            editable={!loading}
          />

          <InputText 
            label='Status (disponível/ocupado/manutenção)'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={status}
            onChangeText={setStatus}
            editable={!loading}
          />

          <InputText 
            label='Descrição (opcional)'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={descricao}
            onChangeText={setDescricao}
            multiline
            editable={!loading}
          />
        </View>

        <View style={styles.buttonContainer}>
          <ButtonPoint 
            label={loading ? "Criando..." : "Criar Quarto"}
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