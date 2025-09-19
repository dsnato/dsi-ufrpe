import React from 'react';
};


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
```


--- src/components/FuncionarioForm.tsx
```tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';


type FormValues = {
nome: string;
email: string;
turno: string;
};


type Props = {
initialValues?: Partial<FormValues>;
buttonText?: string;
onSubmit: (vals: FormValues) => void;
};


export default function FuncionarioForm({ initialValues = {}, buttonText = 'Salvar', onSubmit }: Props) {
const [nome, setNome] = useState(initialValues.nome ?? '');
const [email, setEmail] = useState(initialValues.email ?? '');
const [turno, setTurno] = useState(initialValues.turno ?? '');


function handleSubmit() {
// validação simples
if (!nome.trim()) {
return; // em app real, mostrar erro ao usuário
}
onSubmit({ nome: nome.trim(), email: email.trim(), turno: turno.trim() });
}


return (
<ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 12 }}>
<View style={styles.field}>
<Text style={styles.label}>Nome</Text>
<TextInput value={nome} onChangeText={setNome} style={styles.input} placeholder="Nome" />
</View>


<View style={styles.field}>
<Text style={styles.label}>Email</Text>
<TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="Email" keyboardType="email-address" />
</View>


<View style={styles.field}>
<Text style={styles.label}>Turno</Text>
<TextInput value={turno} onChangeText={setTurno} style={styles.input} placeholder="Turno" />
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
input: { width: '100%', padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
submitBtn: { marginTop: 6, paddingVertical: 12, borderRadius: 8, backgroundColor: '#4169E1', alignItems: 'center' },
submitText: { color: '#fff', fontWeight: '600' },
});