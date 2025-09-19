import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Alert, TextInput, SafeAreaView } from 'react-native';
import AtividadeRecreativaForm from '@/src/components/AtividadeRecreativaForm';
import AtividadeRecreativaListItem from '@/src/components/AtividadeRecreativaListItem';
import { useRouter } from 'expo-router';

export default function CrudAtividadesRecreativasScreen() {
  const router = useRouter();

  const [items, setItems] = useState([
    { id: '1', nome_atividade: 'Yoga', descricao: 'Aula de yoga matinal', horario: '08:00', local: 'Sala 1' },
    { id: '2', nome_atividade: 'Futebol', descricao: 'Partida amistosa', horario: '10:00', local: 'Quadra' },
    { id: '3', nome_atividade: 'Pintura', descricao: 'Oficina de pintura', horario: '14:00', local: 'Sala 3' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchText, setSearchText] = useState('');

  const handleEditPress = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleUpdate = (updatedData: any) => {
    setItems(prev => prev.map(i => (i.id === selectedItem.id ? { ...i, ...updatedData } : i)));
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleDelete = (itemId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => setItems(prev => prev.filter(i => i.id !== itemId)),
        },
      ]
    );
  };

  const filteredItems = items.filter(item =>
    item.nome_atividade.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CRUD de Atividades Recreativas</Text>
      </View>

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/screens/CrudAtividades/Criacao')} 
        >
          <Text style={styles.createButtonText}>Criar</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          value={searchText}
          onChangeText={setSearchText}
        />

        <FlatList
          data={filteredItems}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <AtividadeRecreativaListItem
              item={item}
              onPress={handleEditPress}
              onDelete={handleDelete}
            />
          )}
        />
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <AtividadeRecreativaForm
              initialValues={selectedItem}
              buttonText="Atualizar"
              onSubmit={handleUpdate}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#4169E1' },
  header: { backgroundColor: '#4169E1', paddingVertical: 20, alignItems: 'center' },
  headerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  container: { flex: 1, backgroundColor: '#fff', padding: 25 },
  createButton: { backgroundColor: '#4169E1', padding: 15, borderRadius: 8, marginBottom: 15, alignItems: 'center' },
  createButtonText: { color: '#fff', fontWeight: 'bold' },
  searchInput: { borderWidth: 1, borderColor: '#718FE9', borderRadius: 8, padding: 10, marginBottom: 15 },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20 },
});
