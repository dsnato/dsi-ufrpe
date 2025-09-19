import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

type FormValues = {
  data_check_in: string;
  data_check_out: string;
  status_reserva: string;
  valor_total: string;
};

type Props = {
  initialValues?: Partial<FormValues>;
  buttonText?: string;
  onSubmit: (vals: FormValues) => void;
};

const PRIMARY = '#4169E1';
const SECONDARY = '#718FE9';

export default function ReservaForm({ initialValues = {}, buttonText = 'Salvar', onSubmit }: Props) {
  const [data_check_in, setDataCheckIn] = useState(initialValues.data_check_in ?? '');
  const [data_check_out, setDataCheckOut] = useState(initialValues.data_check_out ?? '');
  const [status_reserva, setStatusReserva] = useState(initialValues.status_reserva ?? '');
  const [valor_total, setValorTotal] = useState(initialValues.valor_total ?? '');

  function handleSubmit() {
    // validação simples
    if (!data_check_in || !data_check_out) {
      // Em app real: exibir feedback ao usuário
      return;
    }
    onSubmit({
      data_check_in,
      data_check_out,
      status_reserva,
      valor_total,
    });
  }

  return (
    <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 12 }}>
      <View style={styles.field}>
        <Text style={styles.label}>Data Check-in</Text>
        <TextInput
          value={data_check_in}
          onChangeText={setDataCheckIn}
          placeholder="YYYY-MM-DD"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Data Check-out</Text>
        <TextInput
          value={data_check_out}
          onChangeText={setDataCheckOut}
          placeholder="YYYY-MM-DD"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Status da Reserva</Text>
        <TextInput
          value={status_reserva}
          onChangeText={setStatusReserva}
          placeholder="Ex: Confirmada, Pendente, Cancelada"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Valor total</Text>
        <TextInput
          value={valor_total}
          onChangeText={setValorTotal}
          placeholder="Ex: 1200.00"
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>{buttonText}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  field: { width: '100%', marginBottom: 12 },
  label: { marginBottom: 6, fontWeight: '600' },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: SECONDARY,
  },
  submitBtn: {
    marginTop: 6,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: PRIMARY,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: '600' },
});
