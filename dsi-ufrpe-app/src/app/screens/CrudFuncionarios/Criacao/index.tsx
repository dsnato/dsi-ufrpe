import React from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import FuncionarioForm from '@/src/components/FuncionarioForms';

export default function CriarFuncionario() {
  const router = useRouter();

  const handleCreate = (formData: { nome: string; email: string; turno: string }) => {
    console.log('Novo funcionário:', formData);
    Alert.alert('Sucesso', 'Funcionário cadastrado com sucesso!');
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Criar Funcionário</Text>
      </View>

      <View style={styles.container}>
        <FuncionarioForm buttonText="Cadastrar" onSubmit={handleCreate} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#4169E1',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#fff',
  },
});
