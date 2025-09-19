import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import QuartoForm from '@/src/components/QuartoForm';

export default function CriacaoQuarto() {
  const router = useRouter();

  const handleCreate = (formData: any) => {
    console.log('Novo Quarto:', formData);
    Alert.alert('Sucesso', 'Quarto criado com sucesso!');
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Criar Quarto</Text>
      </View>

      <View style={styles.formContainer}>
        <QuartoForm onSubmit={handleCreate} buttonText="Cadastrar" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#4169E1', padding: 15 },
  headerText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 18 },
  formContainer: { flex: 1, padding: 25 },
});
