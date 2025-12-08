import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


type Props = {
item: Funcionario;
onPress: (item: Funcionario) => void;
onDelete: (id: string) => void;
};


export default function FuncionarioListItem({ item, onPress, onDelete }: Props) {
return (
<TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
<View style={styles.info}>
<Text style={styles.title}>{item.nome}</Text>
<Text style={styles.subtitle}>{item.turno}</Text>
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
