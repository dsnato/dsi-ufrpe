import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import ReservaListItem from '@/src/components/ReservaListItem';
import ReservaForm from '@/src/components/ReservaForm';

type Reserva = {
  id: string;
  data_check_in: string;
  data_check_out: string;
  status_reserva: string;
  valor_total: string; // string para facilitar o input; converta quando necessário
};

const PRIMARY = '#4169E1';
const SECONDARY = '#718FE9';

const MOCK_DATA: Reserva[] = [
  {
    id: 'r1',
    data_check_in: '2025-09-01',
    data_check_out: '2025-09-05',
    status_reserva: 'Confirmada',
    valor_total: '1200.00',
  },
  {
    id: 'r2',
    data_check_in: '2025-10-10',
    data_check_out: '2025-10-12',
    status_reserva: 'Pendente',
    valor_total: '450.50',
  },
  {
    id: 'r3',
    data_check_in: '2025-11-15',
    data_check_out: '2025-11-20',
    status_reserva: 'Cancelada',
    valor_total: '0.00',
  },
];

export default function index() {
  const [items, setItems] = useState<Reserva[]>(MOCK_DATA);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Reserva | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Em app real: buscar dados da API aqui
  }, []);

  function handleEditPress(item: Reserva) {
    setSelectedItem(item);
    setModalVisible(true);
  }

  function handleUpdate(updatedData: Partial<Reserva>) {
    if (!selectedItem) return;
    setItems(prev =>
      prev.map(i => (i.id === selectedItem.id ? { ...i, ...updatedData } as Reserva : i))
    );
    setModalVisible(false);
    setSelectedItem(null);
  }

  function handleDelete(itemId: string) {
    Alert.alert('Confirmar Exclusão', 'Você tem certeza que deseja excluir este item?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          setItems(prev => prev.filter(i => i.id !== itemId));
          // Em app real: chamar API para deletar aqui
        },
      },
    ]);
  }

  const filtered = items.filter(i =>
    i.data_check_in.includes(search) ||
    i.data_check_out.includes(search) ||
    i.status_reserva.toLowerCase().includes(search.trim().toLowerCase()) ||
    i.valor_total.includes(search)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CRUD de Reservas</Text>
      </View>

      <View style={styles.container}>
        <TouchableOpacity style={styles.createButton} onPress={() => { /* navegar para criação se tiver rota */ }}>
          <Text style={styles.createButtonText}>Criar</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Pesquisar por data, status ou valor..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ReservaListItem item={item} onPress={handleEditPress} onDelete={handleDelete} />
          )}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </View>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedItem && (
              <ReservaForm
                initialValues={{
                  data_check_in: selectedItem.data_check_in,
                  data_check_out: selectedItem.data_check_out,
                  status_reserva: selectedItem.status_reserva,
                  valor_total: selectedItem.valor_total,
                }}
                buttonText="Salvar"
                onSubmit={(vals) => handleUpdate(vals)}
              />
            )}

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => {
                setModalVisible(false);
                setSelectedItem(null);
              }}
            >
              <Text style={{ color: PRIMARY }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: PRIMARY, paddingVertical: 16, alignItems: 'center' },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 18 },
  container: { flex: 1, padding: 25 },
  createButton: { backgroundColor: PRIMARY, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  createButtonText: { color: '#fff', fontWeight: '600' },
  searchInput: { width: '100%', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: SECONDARY, marginBottom: 12 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20 },
  modalClose: { marginTop: 12, alignSelf: 'center' },
});
