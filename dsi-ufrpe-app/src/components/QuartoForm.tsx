import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';

interface QuartoFormProps {
  onSubmit: (data: any) => void;
  buttonText: string;
  initialValues?: {
    id?: string;
    numero_quarto?: string;
    tipo?: string;
    capacidade?: number;
    preco_diario?: number;
    foto_quarto?: string;
  };
}

export default function QuartoForm({ onSubmit, buttonText, initialValues }: QuartoFormProps) {
  const [numero, setNumero] = useState(initialValues?.numero_quarto || '');
  const [tipo, setTipo] = useState(initialValues?.tipo || '');
  const [capacidade, setCapacidade] = useState(initialValues?.capacidade?.toString() || '');
  const [preco, setPreco] = useState(initialValues?.preco_diario?.toString() || '');
  const [foto, setFoto] = useState(initialValues?.foto_quarto || '');

  const handleSubmit = () => {
    if (!numero || !tipo || !capacidade || !preco) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    onSubmit({
      id: initialValues?.id || Math.random().toString(),
      numero_quarto: numero,
      tipo,
      capacidade: parseInt(capacidade),
      preco_diario: parseFloat(preco),
      foto_quarto: foto,
    });
  };

  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={styles.field}>
        <Text style={styles.label}>Número do Quarto</Text>
        <TextInput style={styles.input} value={numero} onChangeText={setNumero} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Tipo</Text>
        <TextInput style={styles.input} value={tipo} onChangeText={setTipo} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Capacidade</Text>
        <TextInput style={styles.input} value={capacidade} onChangeText={setCapacidade} keyboardType="numeric" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Preço Diário</Text>
        <TextInput style={styles.input} value={preco} onChangeText={setPreco} keyboardType="numeric" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Foto (URL)</Text>
        <TextInput style={styles.input} value={foto} onChangeText={setFoto} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 15, width: '100%' },
  label: { marginBottom: 5, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#718FE9', borderRadius: 8, padding: 10, width: '100%' },
  button: { backgroundColor: '#4169E1', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
