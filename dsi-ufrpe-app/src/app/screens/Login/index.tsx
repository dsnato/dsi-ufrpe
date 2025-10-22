import { supabase } from '@/lib/supabase';
import ButtonPoint from '@/src/components/button';
import InputText from '@/src/components/input';
import PasswordInput from '@/src/components/password';
import { useToast } from '@/src/components/ToastContext';
import { getSuccessMessage, getValidationMessage, translateAuthError } from '@/src/utils/errorMessages';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { AppState, Image, StyleSheet, Text, View } from 'react-native';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  async function signInWithEmail() {
    // Validações antes de enviar
    if (!email || !password) {
      showError(getValidationMessage(email ? 'password' : 'email', 'required'));
      return;
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    
    if (error) {
      showError(translateAuthError(error.message))
    } else {
      showSuccess(getSuccessMessage('login'))
      setTimeout(() => {
        router.replace('/screens/(tabs)')
      }, 3000)
    }
    
    setLoading(false)
  }

  const registerTransition = () => {
    router.navigate("/screens/register");
  };

  return (
    <View style={styles.container}>

      {/* Container da Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/hotel1.png')}
          style={styles.logo}
        />
        <Text style={styles.logoText}>Hostify</Text>
      </View>

      {/* Container do Form */}
      <View style={styles.form}>
        {/* Email */}
        <InputText
        label='E-mail'
        leftIcon={<Image source={require("@/assets/images/at-email.png")}
        style={{ marginRight: 10 }}></Image>}
        value={email}
        onChange={event => setEmail(event.nativeEvent.text)}></InputText>

        {/* Senha */}
        <PasswordInput
        leftIcon={<Image source={require("@/assets/images/key-password.png")} 
        style={{ marginRight: 10 }}></Image>}
        value={password}
        onChange={event => setPassword(event.nativeEvent.text)}></PasswordInput>

        <View style={styles.buttonContainer}>
          <ButtonPoint
          label="Entrar"
          loading={loading}
          onPress={() => {signInWithEmail()}}
          />
          <Text style={styles.registerText}>
            Não tem uma conta? <Text style={styles.registerLink} onPress={registerTransition}>Cadastre-se</Text>
          </Text>
          <Text style={styles.registerText}>
            Esqueceu a senha? <Text style={styles.registerLink} onPress={registerTransition}>Recuperar</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#132F3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: 80,              // controla a altura da logo
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 2,            // garante que fique acima do form
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0162B3',
    marginTop: 8,
  },
  form: {
    flex: 1,                   // ocupa todo o espaço disponível
    width: '100%',             // vai de ponta a ponta
    backgroundColor: '#EFEFF0',// cor do retângulo
    borderTopLeftRadius: 20,   // arredonda só em cima
    borderTopRightRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // sombra para parecer "cartão"
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 140,
  },
  input: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    backgroundColor: '#fff',
    color: '#9da3a3ff',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  registerText: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
  },
  registerLink: {
    color: '#0162B3',
    fontWeight: 'bold',
  },
  inputIconWrapper: {
    width: '100%',
    marginBottom: 16,
    position: 'relative',
    justifyContent: 'center',
  },
  iconEye: {
    position: 'absolute',
    right: 12,
    top: -8,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: 6,
  },
});

export default LoginScreen;