import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/src/components/ScreenWrapper';
import TextInputRounded from '@/src/components/TextInputRounded';
import Button from '@/src/components/button';
import { criarReserva } from '@/src/services/reservasService';
import { useToast } from '@/src/components/ToastContext';

export default function CriacaoReserva() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Estados para cada campo
  const [clienteId, setClienteId] = useState('');
  const [quartoId, setQuartoId] = useState('');
  const [dataCheckin, setDataCheckin] = useState('');
  const [dataCheckout, setDataCheckout] = useState('');
  const [numeroHospedes, setNumeroHospedes] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [status, setStatus] = useState('confirmada');
  const [observacoes, setObservacoes] = useState('');

  const validarCampos = (): boolean => {
    if (!clienteId.trim()) {
      Alert.alert('Erro de Validação', 'ID do cliente é obrigatório');
      return false;
    }
    if (!quartoId.trim()) {
      Alert.alert('Erro de Validação', 'ID do quarto é obrigatório');
      return false;
    }
    if (!dataCheckin.trim()) {
      Alert.alert('Erro de Validação', 'Data de check-in é obrigatória');
      return false;
    }
    if (!dataCheckout.trim()) {
      Alert.alert('Erro de Validação', 'Data de check-out é obrigatória');
      return false;
    }
    if (!numeroHospedes.trim()) {
      Alert.alert('Erro de Validação', 'Número de hóspedes é obrigatório');
      return false;
    }
    if (!valorTotal.trim()) {
      Alert.alert('Erro de Validação', 'Valor total é obrigatório');
      return false;
    }
    return true;
  };

  const handleCriar = async () => {
    if (!validarCampos()) {
      return;
    }

    setLoading(true);
    try {
      const novaReserva = {
        id_cliente: clienteId,
        id_quarto: quartoId,
        data_checkin: dataCheckin,
        data_checkout: dataCheckout,
        numero_hospedes: parseInt(numeroHospedes),
        valor_total: parseFloat(valorTotal),
        status,
        observacoes: observacoes || undefined
      };

      await criarReserva(novaReserva);
      
      showSuccess('Reserva criada com sucesso!');
      router.push('/screens/Reserva/ListagemReserva');
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      showError('Não foi possível criar a reserva. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Criar Nova Reserva</Text>

        <View style={styles.formContainer}>
          <TextInputRounded
            placeholder="ID do Cliente"
            value={clienteId}
            onChangeText={setClienteId}
            editable={!loading}
          />

          <TextInputRounded
            placeholder="ID do Quarto"
            value={quartoId}
            onChangeText={setQuartoId}
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Data de Check-in (YYYY-MM-DD)"
            value={dataCheckin}
            onChangeText={setDataCheckin}
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Data de Check-out (YYYY-MM-DD)"
            value={dataCheckout}
            onChangeText={setDataCheckout}
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Número de Hóspedes"
            value={numeroHospedes}
            onChangeText={setNumeroHospedes}
            keyboardType="numeric"
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Valor Total"
            value={valorTotal}
            onChangeText={setValorTotal}
            keyboardType="decimal-pad"
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Status (confirmada/cancelada/concluída)"
            value={status}
            onChangeText={setStatus}
            editable={!loading}
          />

          <TextInputRounded
            placeholder="Observações (opcional)"
            value={observacoes}
            onChangeText={setObservacoes}
            multiline
            numberOfLines={4}
            editable={!loading}
          />

          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <>
                <Button
                  label="Criar Reserva"
                  onPress={handleCriar}
                />
                <Button
                  label="Cancelar"
                  onPress={() => router.back()}
                />
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  formContainer: {
    gap: 15,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
});