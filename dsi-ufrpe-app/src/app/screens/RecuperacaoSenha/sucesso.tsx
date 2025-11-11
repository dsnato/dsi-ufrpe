import ButtonPoint from '@/src/components/button';
import { router } from 'expo-router';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SucessoScreen: React.FC = () => {
  const handleOk = () => {
    // Voltar para tela de login
    router.replace('/screens/Login');
  };

  return (
    <View style={styles.container}>
      {/* Ícone de sucesso */}
      <View style={styles.iconContainer}>
        <MaterialIcons name="lock-outline" size={120} color="#00A8E8" />
      </View>

      {/* Título */}
      <Text style={styles.title}>Senha Alterada com Sucesso!</Text>

      {/* Descrição */}
      <Text style={styles.description}>
        Agora você pode desfrutar de tudo o que nosso aplicativo pode oferecer.
      </Text>

      {/* Botão OK */}
      <View style={styles.buttonContainer}>
        <ButtonPoint
          label="OK"
          onPress={handleOk}
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
    justifyContent: 'center',
    marginVertical: 30,
    backgroundColor: "#D4E9F7",
    padding: 20,
    width: 180,
    height: 180,
    borderRadius: 100
  },
  checkCircle: {
    position: 'absolute',
    bottom: -5,
    right: -5,
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
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 40,
    marginBottom: 60,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
});

export default SucessoScreen;
