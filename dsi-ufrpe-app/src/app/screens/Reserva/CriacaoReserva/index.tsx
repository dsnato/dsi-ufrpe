import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import InputText from '@/src/components/input';
import ButtonPoint from '@/src/components/button';
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
      showError('ID do cliente é obrigatório');
      return false;
    }
    if (!quartoId.trim()) {
      showError('ID do quarto é obrigatório');
      return false;
    }
    if (!dataCheckin.trim()) {
      showError('Data de check-in é obrigatória');
      return false;
    }
    if (!dataCheckout.trim()) {
      showError('Data de check-out é obrigatória');
      return false;
    }
    if (!numeroHospedes.trim()) {
      showError('Número de hóspedes é obrigatório');
      return false;
    }
    if (!valorTotal.trim()) {
      showError('Valor total é obrigatório');
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
    <View style={styles.container}>
      <Text style={styles.title}>Nova Reserva</Text>
      
      <View style={styles.form}>
        <View style={styles.inputsContainer}>
          <InputText 
            label='ID do Cliente'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={clienteId}
            onChangeText={setClienteId}
            editable={!loading}
          />

          <InputText 
            label='ID do Quarto'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={quartoId}
            onChangeText={setQuartoId}
            editable={!loading}
          />

          <InputText 
            label='Data de Check-in (YYYY-MM-DD)'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={dataCheckin}
            onChangeText={setDataCheckin}
            editable={!loading}
          />

          <InputText 
            label='Data de Check-out (YYYY-MM-DD)'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={dataCheckout}
            onChangeText={setDataCheckout}
            editable={!loading}
          />

          <InputText 
            label='Número de Hóspedes'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={numeroHospedes}
            onChangeText={setNumeroHospedes}
            keyboardType="numeric"
            editable={!loading}
          />

          <InputText 
            label='Valor Total'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={valorTotal}
            onChangeText={setValorTotal}
            keyboardType="decimal-pad"
            editable={!loading}
          />

          <InputText 
            label='Status (confirmada/cancelada/concluída)'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={status}
            onChangeText={setStatus}
            editable={!loading}
          />

          <InputText 
            label='Observações (opcional)'
            leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }} />}
            value={observacoes}
            onChangeText={setObservacoes}
            multiline
            editable={!loading}
          />
        </View>

        <View style={styles.buttonContainer}>
          <ButtonPoint 
            label={loading ? "Criando..." : "Criar Reserva"}
            disabled={loading}
            onPress={handleCriar} 
          />
          <View style={styles.separator} />
          <Text style={styles.footerText}>
            <Text style={styles.footerLink} onPress={() => router.back()}>
              Voltar
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#132f3b',
  },
  title: {
    color: '#ffe157',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  form: {
    flex: 1,
    width: '100%',
    backgroundColor: '#efeff0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 24,
    paddingBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginTop: 20,
  },
  inputsContainer: {
    width: '100%',
    gap: 12,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  separator: {
    width: '80%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  footerLink: {
    color: '#0162b3',
    fontWeight: 'bold',
  },
});