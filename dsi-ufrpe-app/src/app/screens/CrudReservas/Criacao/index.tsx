import React from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import ReservaForm from '@/src/components/ReservaForm';

export default function CriarReservaScreen() {
  const router = useRouter();

  const handleCreate = (formData: any) => {
    console.log('Reserva criada:', formData);
    Alert.alert('Sucesso', 'Reserva criada com sucesso!');
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Criar Reserva</Text>
      </View>

      <View style={styles.container}>
        <ReservaForm onSubmit={handleCreate} buttonText="Cadastrar" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#4169E1',
  },
  header: {
    backgroundColor: '#4169E1',
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 25,
  },
});
