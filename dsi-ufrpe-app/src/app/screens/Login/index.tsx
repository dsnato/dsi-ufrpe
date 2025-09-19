import ButtonPoint from '@/src/components/button';
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  const handleLogin = () => {
    Alert.alert('Login', `Email: ${email}\nPassword: ${password}`);
  };

  const registerTransition = () => {
    router.navigate("/screens/register");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/hotel1.png')}
        style={styles.logo}
      />
      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        {/* Campo de senha com o mesmo estilo do input de email, apenas adicionando o ícone */}
        <View style={styles.inputIconWrapper}>
          <TextInput
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.iconEye}>
            <Ionicons
              name={secure ? "eye-off" : "eye"}
              size={22}
              color={secure ? "#737a7a" : "#2176ff"}
            />
          </TouchableOpacity>
        </View>
        <ButtonPoint
          label="Entrar"
          style={styles.button}
          onPress={() => router.replace('/screens/(tabs)')}
        />
        <Text style={styles.registerText}>
          Não tem uma conta?{' '}
          <Text style={styles.registerLink} onPress={registerTransition}>
            Cadastre-se
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 24,
    marginTop: 32,
  },
  form: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 0,
    alignItems: 'center',
    elevation: 2,
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
  button: {
    width: '100%',
    backgroundColor: '#4a6cf7',
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 4,
  },
  registerLink: {
    color: '#2176ff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
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