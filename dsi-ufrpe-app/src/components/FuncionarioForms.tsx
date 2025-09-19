import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView } from 'react-native';


interface FuncionarioFormProps {
initialValues?: {
nome: string;
email: string;
turno: string;
};
buttonText: string;
onSubmit: (data: { nome: string; email: string; turno: string }) => void;
}


export default function FuncionarioForm({ initialValues, buttonText, onSubmit }: FuncionarioFormProps) {
const [nome, setNome] = useState(initialValues?.nome || '');
const [email, setEmail] = useState(initialValues?.email || '');
const [turno, setTurno] = useState(initialValues?.turno || '');


const handleSubmit = () => {
onSubmit({ nome, email, turno });
};


return (
<ScrollView contentContainerStyle={styles.container}>
<TextInput
style={styles.input}
placeholder="Nome"
value={nome}
onChangeText={setNome}
/>
<TextInput
style={styles.input}
placeholder="Email"
value={email}
onChangeText={setEmail}
/>
<TextInput
style={styles.input}
placeholder="Turno"
value={turno}
onChangeText={setTurno}
/>
<Button title={buttonText} color="#4169E1" onPress={handleSubmit} />
</ScrollView>
);
}


const styles = StyleSheet.create({
container: {
gap: 15,
width: '100%',
},
input: {
borderWidth: 1,
borderColor: '#ccc',
borderRadius: 8,
padding: 10,
width: '100%',
},
});