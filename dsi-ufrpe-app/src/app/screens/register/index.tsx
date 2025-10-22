import ButtonPoint from '@/src/components/button';
import InputText from '@/src/components/input';
import PasswordInput from '@/src/components/password';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

const RegisterScreen: React.FC = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        telefone: '',
    });


    const handleLoginRedirect = () => {
        router.navigate("/")
    };

    const handleSubmit = () => {
        Alert.alert('Cadastro', 'Usuário cadastrado com sucesso!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.textCadastro}>
                Cadastro
            </Text>
            <View style={styles.form}>
                <View style={styles.inputsContainer}>
                    <InputText label='Nome' leftIcon={<Image source={require("@/assets/images/edit-name.png")} style={{ marginRight: 10 }}></Image>}></InputText>
                    <InputText label='E-mail' leftIcon={<Image source={require("@/assets/images/at-email.png")} style={{ marginRight: 10 }}></Image>}></InputText>
                    <PasswordInput label='Senha' leftIcon={<Image source={require("@/assets/images/key-password.png")} style={{ marginRight: 10 }}></Image>}></PasswordInput>
                    <PasswordInput label='Confirmar Senha' leftIcon={<Image source={require("@/assets/images/key-password.png")} style={{ marginRight: 10 }}></Image>}></PasswordInput>
                    <InputText label='CNPJ' leftIcon={<Image source={require("@/assets/images/id-cnpj.png")} style={{ marginRight: 10 }}></Image>}></InputText>
                    <InputText label='Nome do Hotel' leftIcon={<Image source={require("@/assets/images/nome-hotel.png")} style={{ marginRight: 10 }}></Image>}></InputText>
                </View>

                <View style={styles.buttonContainer}>
                    <ButtonPoint label="Cadastrar" onPress={handleSubmit} />
                    <View style={styles.separator} />
                    <Text style={styles.footerText}>
                        Já tem uma conta?{' '}
                        <Text style={styles.footerLink} onPress={handleLoginRedirect}>
                            Entrar
                        </Text>
                    </Text>
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#132f3b',
    },
    textCadastro: {
        color: '#ffe157',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 60,
        marginBottom: 20,
    },
    form: {
        flex: 1,
        width: '100%',
        backgroundColor: '#efeff0',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 30,
        paddingHorizontal: 24,
        paddingBottom: 20,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        marginTop: 20,
    },
    inputsContainer: {
        width: '100%',
        gap: 12,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
    },
    separator: {
        width: '80%',
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 20,
    },
    footerText: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
    },
    footerLink: {
        color: '#0162b3',
        fontWeight: 'bold',
    },
});

export default RegisterScreen;