import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Alert, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import QuartoListItem from '@/src/components/QuartoListItem';
import QuartoForm from '@/src/components/QuartoForm'

const initialData = [
  { id: '1', numero_quarto: '101', tipo: 'Solteiro', capacidade: 1, preco_diario: 100, foto_quarto: '' },
  { id: '2', numero_quarto: '102', tipo: 'Casal', capacidade: 2, preco_diario: 150, foto_quarto: '' },
  { id: '3', numero_quarto: '103', tipo: 'Suite', capacidade: 4, preco_diario: 300, foto_quarto: '' },
];

export default function CrudQuartosGeral() {
  const router = useRouter();
  const [items, setItems] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [search, setSearch] = useState('');

  const handleEditPress = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleUpdate = (updatedData: any) => {
    setItems(prev => prev.map(i => i.id === updatedData.id ? updatedData : i));
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleDelete = (itemId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => setItems(prev => prev.filter(i => i.id !== itemId)) },
      ]
    );
  };

  const filteredItems = items.filter(i => i.numero_quarto.includes(search) || i.tipo.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>CRUD de Quartos</Text>
      </View>

      <TextInput
        placeholder="Pesquisar..."
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <QuartoListItem
            item={item}
            onPress={handleEditPress}
            onDelete={handleDelete}
          />
        )}
      />

      <TouchableOpacity style={styles.createButton} onPress={() => router.push('/screens/CrudQuartos/Criacao')}>
        <Text style={styles.createButtonText}>Criar</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <QuartoForm
              initialValues={selectedItem}
              buttonText="Salvar"
              onSubmit={handleUpdate}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#fff' },
  header: { backgroundColor: '#4169E1', padding: 15, borderRadius: 8, marginBottom: 15 },
  headerText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 18 },
  createButton: { backgroundColor: '#4169E1', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  createButtonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)' },
  modalContainer: { width:'90%', maxHeight:'80%', backgroundColor:'#fff', borderRadius:10, padding:20 },
  searchInput: { borderWidth:1, borderColor:'#718FE9', borderRadius:8, padding:10, marginBottom:10, width:'100%' },
});
