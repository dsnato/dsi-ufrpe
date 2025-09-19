import React from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import AtividadeRecreativaForm from '@/src/components/AtividadeRecreativaForm';

export default function CriacaoAtividadeRecreativa() {
  const router = useRouter();

  const handleCreate = (formData: any) => {
    console.log('Dados enviados:', formData);
    Alert.alert('Sucesso', 'Atividade recreativa cadastrada com sucesso!');
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Criar Atividade Recreativa</Text>
      </View>

      <View style={styles.container}>
        <AtividadeRecreativaForm onSubmit={handleCreate} buttonText="Cadastrar" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#4169E1' },
  header: { backgroundColor: '#4169E1', paddingVertical: 20, alignItems: 'center' },
  headerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  container: { flex: 1, backgroundColor: '#fff', padding: 25 },
});
