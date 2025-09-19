import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Reserva = {
  id: string;
  data_check_in: string;
  data_check_out: string;
  status_reserva: string;
  valor_total: string;
};

type Props = {
  item: Reserva;
  onPress: (item: Reserva) => void;
  onDelete: (id: string) => void;
};

export default function ReservaListItem({ item, onPress, onDelete }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <View style={styles.info}>
        <Text style={styles.title}>Valor total: {item.valor_total}</Text>
        <Text style={styles.subtitle}>
          {item.data_check_in} → {item.data_check_out} • {item.status_reserva}
        </Text>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
        <MaterialIcons name="delete" size={22} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
  info: { flex: 1 },
  title: { fontWeight: '600', fontSize: 16 },
  subtitle: { color: '#666', marginTop: 4 },
  deleteBtn: { padding: 8 },
});
