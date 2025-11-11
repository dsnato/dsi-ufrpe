import { supabase } from '@/lib/supabase';
import ButtonPoint from '@/src/components/button';
import PasswordInput from '@/src/components/password';
import { useToast } from '@/src/components/ToastContext';
import { getValidationMessage, translateAuthError } from '@/src/utils/errorMessages';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const NovaSenhaScreen: React.FC = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  // Verificar se há sessão válida ao carregar
//   useEffect(() => {
//     checkSession();
//   }, []);

//   async function checkSession() {
//     try {
//       const { data: { session }, error } = await supabase.auth.getSession();
      
//       if (error) {
//         console.error('Erro ao verificar sessão:', error);
//         return;
//       }

//       if (!session) {
//         console.warn('Nenhuma sessão encontrada');
//         showError('Por favor, clique no link do email de recuperação primeiro.');
//       } else {
//         console.log('Sessão válida encontrada:', session.user.email);
//       }
//     } catch (err) {
//       console.error('Erro ao verificar sessão:', err);
//     }
//   }

  async function handleUpdatePassword() {
    // Validação: campos vazios
    if (!newPassword || !confirmPassword) {
      showError('Por favor, preencha todos os campos');
      return;
    }

    // Validação: tamanho mínimo
    if (newPassword.length < 6) {
      showError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    // Validação: senhas coincidem
    if (newPassword !== confirmPassword) {
      showError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      // Atualizar a senha do usuário
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        
        // Tratamento de erros específicos
        if (error.message.toLowerCase().includes('auth session missing')) {
          showError('Sessão expirada. Por favor, solicite um novo link de recuperação.');
        } else if (error.message.toLowerCase().includes('new password should be different')) {
          showError('A nova senha deve ser diferente da senha atual.');
        } else if (error.message.toLowerCase().includes('password')) {
          showError('Erro ao atualizar senha: ' + translateAuthError(error.message));
        } else {
          showError(translateAuthError(error.message));
        }
      } else {
        console.log('Senha atualizada com sucesso:', data);
        showSuccess('Senha alterada com sucesso!');
        
        // Aguardar um pouco para o usuário ver o toast de sucesso
        setTimeout(() => {
          router.push('/screens/RecuperacaoSenha/sucesso');
        }, 1500);
      }
    } catch (err) {
      console.error('Erro inesperado ao atualizar senha:', err);
      showError('Erro ao atualizar senha. Tente novamente.');
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

      {/* Subtítulo */}
      <Text style={styles.subtitle}>Criar nova senha</Text>

      {/* Input Nova Senha */}
      <View style={styles.inputContainer}>
        <PasswordInput
          label="Nova senha"
          leftIcon={<Image source={require("@/assets/images/key-password.png")} 
            style={{ marginRight: 10 }}></Image>}
          value={newPassword}
          onChange={(event) => setNewPassword(event.nativeEvent.text)}
          placeholder="Digite a sua nova senha"
        />
      </View>

      {/* Input Confirmação da Senha */}
      <View style={styles.inputContainer}>
        <PasswordInput
          label="Confirmação da Senha"
          leftIcon={<Image source={require("@/assets/images/key-password.png")} 
            style={{ marginRight: 10 }}></Image>}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.nativeEvent.text)}
          placeholder="Repita a nova Senha"
        />
      </View>

      {/* Botão Enviar */}
      <View style={styles.buttonContainer}>
        <ButtonPoint
          label="Enviar"
          loading={loading}
          onPress={handleUpdatePassword}
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
    color: '#333',
    marginTop: 60,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 30,
  },
});

export default NovaSenhaScreen;
