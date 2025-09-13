import ButtonPoint from '@/src/components/button';
import Input from '@/src/components/input';
import PasswordInput from '@/src/components/password';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

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
        Alert.alert('Cadastro', 'Usuário cadastrado com sucesso!');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('@/assets/images/hotel1.png')}
                    style={styles.iconSmall}
                />
                <Text style={styles.appName}>Hostify</Text>
            </View>
            <View style={styles.form}>
                <Input
                    label="Nome"
                    placeholder="Digite seu nome"
                    value={form.name}
                    onChangeText={(text) => setForm({ ...form, name: text })}
                />
                <Input
                    label="Email Institucional"
                    placeholder="Digite seu email"
                    value={form.email}
                    onChangeText={(text) => setForm({ ...form, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <PasswordInput
                    placeholder="Digite sua senha"
                    value={form.password}
                    onChangeText={text => setForm({ ...form, password: text })}
                />
                <Input
                    label="Telefone"
                    placeholder="(81) 9 0000-0000"
                    value={form.telefone}
                    onChangeText={(text) => setForm({ ...form, telefone: text })}
                    keyboardType="phone-pad"
                />
                <ButtonPoint label="Cadastrar" onPress={handleSubmit} style={styles.button} />
                <Text style={styles.footerText}>
                    Já tem uma conta?{' '}
                    <Text style={styles.footerLink} onPress={handleLoginRedirect}>
                        Entrar
                    </Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    iconSmall: {
        width: 40,
        height: 40,
        marginRight: 8,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2176ff',
    },
    form: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 0,
        alignItems: 'center',
        elevation: 2,
    },
    button: {
        width: '100%',
        backgroundColor: '#4a6cf7',
        borderRadius: 4,
        paddingVertical: 12,
        marginTop: 8,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    footerText: {
        color: '#666',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 4,
    },
    footerLink: {
        color: '#2176ff',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default RegisterScreen;