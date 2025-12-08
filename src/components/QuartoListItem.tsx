import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  item: any;
  onPress: (item: any) => void;
  onDelete: (id: string) => void;
}

export default function QuartoListItem({ item, onPress, onDelete }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.tipo}</Text>
        <Text style={styles.subtitle}>Número: {item.numero_quarto}</Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:15, borderWidth:1, borderColor:'#718FE9', borderRadius:8, marginBottom:10 },
  textContainer: {},
  title: { fontWeight:'bold', fontSize:16 },
  subtitle: { color:'#555' },
  deleteButton: { padding:5 },
  deleteText: { fontSize:18, color:'#FF3333' },
});
