import ButtonPoint from '@/src/components/button';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image, StyleSheet, Text, View } from 'react-native';

const EmailVerificadoScreen: React.FC = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const handleContinue = () => {
    // Navegar para tela de criar nova senha
    router.push({
        pathname: '/screens/RecuperacaoSenha/nova-senha',
        params: { email }
    });
  };

  return (
    <View style={styles.container}>
      {/* Ícone de sucesso */}
      <View style={styles.iconContainer}>
        <View style={styles.checkIconWrapper}>
          <View style={styles.checkCircle}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
          <FontAwesome name="at" size={100} color="#00A8E8" />
        </View>
      </View>

      {/* Título */}
      <Text style={styles.title}>Email Verificado!</Text>

      {/* Botão OK */}
      <View style={styles.buttonContainer}>
        <ButtonPoint
          label="Ok"
          onPress={handleContinue}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  checkIconWrapper: {
    position: 'relative',
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailIcon: {
    width: 80,
    height: 80,
    tintColor: '#00A8E8',
  },
  checkCircle: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    zIndex: 1,
  },
  checkMark: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#00A8E8',
    marginBottom: 60,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
});

export default EmailVerificadoScreen;
