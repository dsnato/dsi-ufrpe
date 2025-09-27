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
import FuncionarioListItem from '@/src/components/FuncionarioListItem';
import FuncionarioForm from '@/src/components/FuncionarioForms';

type Funcionario = {
  id: string;
  nome: string;
  email: string;
  turno: string;
};

const PRIMARY = '#4169E1';
const SECONDARY = '#718FE9';

const MOCK_DATA: Funcionario[] = [
  { id: '1', nome: 'João Silva', email: 'joao.silva@example.com', turno: 'Manhã' },
  { id: '2', nome: 'Maria Oliveira', email: 'maria.oliveira@example.com', turno: 'Tarde' },
  { id: '3', nome: 'Carlos Pereira', email: 'carlos.pereira@example.com', turno: 'Noite' },
];

export default function index() {
  const [items, setItems] = useState<Funcionario[]>(MOCK_DATA);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Funcionario | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // placeholder: em app real, buscar dados da API aqui
  }, []);

  function handleEditPress(item: Funcionario) {
    setSelectedItem(item);
    setModalVisible(true);
  }

  function handleUpdate(updatedData: Partial<Funcionario>) {
    if (!selectedItem) return;
    setItems(prev => prev.map(i => (i.id === selectedItem.id ? { ...i, ...updatedData } as Funcionario : i)));
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
          // se necessário, chamar API para deletar aqui
        },
      },
    ]);
  }

  const filtered = items.filter(i =>
    i.nome.toLowerCase().includes(search.trim().toLowerCase()) ||
    i.email.toLowerCase().includes(search.trim().toLowerCase()) ||
    i.turno.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CRUD de Funcionarios</Text>
      </View>

      <View style={styles.container}>
        <TouchableOpacity style={styles.createButton} onPress={() => {
          // navegar para tela de criação (rota especificada no prompt)
          // Ex.: router.push('/screens/CrudFuncionarios/Geral')
        }}>
          <Text style={styles.createButtonText}>Criar</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Pesquisar..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <FuncionarioListItem item={item} onPress={handleEditPress} onDelete={handleDelete} />
          )}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </View>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedItem && (
              <FuncionarioForm
                initialValues={{ nome: selectedItem.nome, email: selectedItem.email, turno: selectedItem.turno }}
                buttonText="Salvar"
                onSubmit={vals => handleUpdate(vals)}
              />
            )}

            <TouchableOpacity style={styles.modalClose} onPress={() => { setModalVisible(false); setSelectedItem(null); }}>
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
