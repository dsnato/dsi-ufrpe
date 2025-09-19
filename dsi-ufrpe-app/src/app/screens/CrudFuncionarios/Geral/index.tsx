import React, { useEffect, useState } from 'react';
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