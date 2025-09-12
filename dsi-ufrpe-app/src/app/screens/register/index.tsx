import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import Input from '@/src/components/input';
import ButtonPoint from '@/src/components/button';
import { useNavigation } from '@react-navigation/native';
import PasswordInput from '@/src/components/password';

const RegisterScreen: React.FC = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        telefone: '',
    });

    const navigation = useNavigation();

    const handleLoginRedirect = () => {
        navigation.navigate('Login' as never);
    };

    const handleSubmit = () => {
        // Lógica de cadastro aqui
        Alert.alert('Cadastro', 'Usuário cadastrado com sucesso!');
    };

    return (
        
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro</Text>
            <View style={styles.form}>
                <Input
                    
                    label="Nome"
                    placeholder="Digite o seu Nome"
                    value={form.name}
                    onChangeText={(text) => setForm({ ...form, name: text })}
                />
                <Input
                    
                    label="Email"
                    placeholder="Digite o seu Email"
                    value={form.email}
                    onChangeText={(text) => setForm({ ...form, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <PasswordInput
                    placeholder="Senha"
                    value={form.password}
                    onChangeText={text => setForm({ ...form, password: text })}
                />
                <Input
                    label="Telefone"
                    placeholder="Digite o seu Telefone"
                    value={form.telefone}
                    onChangeText={(text) => setForm({ ...form, telefone: text })}
                    keyboardType="phone-pad"

                />

            </View>
            <View style={styles.registerView}>
                <ButtonPoint label="Cadastrar" onPress={handleSubmit} style={styles.button} />
                <Text style={styles.footerText}>
                    Já possui uma conta?{' '}
                    <TouchableOpacity>
                        <Text style={styles.footerLink} onPress={handleLoginRedirect}>Faça login</Text>
                        </TouchableOpacity>
                    </Text>
                </View>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 16,
        rowGap: 10
    },
    form: {
        width: '100%',
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    input: {
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footerText: {
        marginTop: 16,
        color: '#666',
    },
    footerLink: {
        color: '#007075',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    button: {
        padding: 12,
        borderRadius: 10,
        width: '150%',
        backgroundColor: '#1cad54ff',
        alignItems: 'center',   
    },
    registerView: {
         justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 32,
    marginTop: 16,
    marginBottom: 16,

    },
});

export default RegisterScreen;