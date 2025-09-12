import Button from '@/src/components/button';
import Input from '@/src/components/input';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import PasswordInput from '@/src/components/password';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ButtonPoint from '@/src/components/button';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Adicione a lógica de login aqui
    Alert.alert('Login', `Email: ${email}\nPassword: ${password}`);
  };

  const navigation = useNavigation()

  const registerTransition = () => {
      navigation.navigate('Register' as never);
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>

        {/*Adicionar View possívelmente*/}
        <Input label="Email" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" /> 
        <PasswordInput placeholder="Senha" value={password} onChangeText={setPassword} />

        <Text style={{marginTop: 2, textAlign: 'left', color: '#666'}}>
          Esqueceu a senha?  
           <TouchableOpacity><Text style={{color: '#007075', fontWeight: 'bold',textDecorationLine: 'underline', paddingLeft: 3}}>Recuperar</Text></TouchableOpacity>
        </Text>
      </View>
        
        <View style={styles.registerContainer}>
          <ButtonPoint label="Entrar" onPress={handleLogin} />
          <Text style={{ color: '#666' }}>Ainda não possui um cadastro? <TouchableOpacity><Text style={{ color: '#007075', paddingTop: 5, fontWeight: 'bold', textDecorationLine: 'underline' }} onPress={registerTransition}>Cadastre-se</Text></TouchableOpacity></Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  form: {
    width: '80%',
    padding: 32,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
    color: '#333',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#1cad54ff',
    alignItems: 'center',
    width: '100%',  
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 32,
    marginTop: 16,
    marginBottom: 16,
  },
});

export default LoginScreen;