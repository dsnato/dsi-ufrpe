import { supabase } from '@/lib/supabase';
import ButtonPoint from '@/src/components/button';
import InputText from '@/src/components/input';
import { useToast } from '@/src/components/ToastContext';
import { getValidationMessage, translateAuthError } from '@/src/utils/errorMessages';
import { router } from 'expo-router';
import React, { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const RecuperacaoSenhaScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  async function handlePasswordRecovery() {
    // Validação do email
    if (!email) {
      showError(getValidationMessage('email', 'required'));
      return;
    }

    // Validação de formato de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Por favor, insira um email válido');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email,
        {redirectTo: 'dsiufrpeapp://screens/RecuperacaoSenha/nova-senha'}
      );

      if (error) {
        showError(translateAuthError(error.message));
      } else {
        // Navegar para tela de confirmação
        router.push({
          pathname: '/screens/RecuperacaoSenha/confirmacao',
          params: { email }
        });
      }
    } catch (err) {
      showError('Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>Recuperação de Senha</Text>

      {/* Ícone */}
      <View style={styles.iconContainer}>
        <MaterialIcons name="lock-outline" size={120} color="#00A8E8" />
      </View>

      {/* Descrição */}
      <Text style={styles.description}>
        Digite o seu endereço de email abaixo e enviaremos um link para redefinir sua senha.
      </Text>

      {/* Input de Email */}
      <View style={styles.inputContainer}>
        <InputText
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.nativeEvent.text)}
          placeholder="Digite seu email"
        />
      </View>

      {/* Botão Enviar */}
      <View style={styles.buttonContainer}>
        <ButtonPoint
          label="Enviar"
          loading={loading}
          onPress={handlePasswordRecovery}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF0',
    padding: 20,
    alignItems:"center"
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  backButtonText: {
    fontSize: 32,
    color: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00A8E8',
    marginTop: 60,
    marginBottom: 40,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    backgroundColor: "#D4E9F7",
    padding: 20,
    width: 180,
    height: 180,
    borderRadius: 100
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
    lineHeight: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
});

export default RecuperacaoSenhaScreen;
