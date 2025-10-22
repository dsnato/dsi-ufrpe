import { supabase } from '@/lib/supabase';
import ButtonPoint from '@/src/components/button';
import InputText from '@/src/components/input';
import PasswordInput from '@/src/components/password';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        cnpj: '',
        hotelName: '',
        telefone: '',
    });

    async function signUpWithEmail() {
        setLoading(true)
        const {
        data: { session },
        error,
        } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
            data: {
            display_name: form.name,
            phone: form.telefone,
            cnpj: form.cnpj,
            hotel_name: form.hotelName,
            }
        }
        })
        
        if (error) {
            Alert.alert('Erro no Cadastro', error.message)
        } else if (!session) {
            Alert.alert('Verificação Necessária', 'Por favor, verifique seu e-mail para confirmar o cadastro!')
        } else {
            Alert.alert('Sucesso!', 'Usuário cadastrado com sucesso!', [
                {
                    text: 'OK',
                    onPress: () => router.replace('/')
                }
            ])
        }
        
        setLoading(false)
    }



    const handleLoginRedirect = () => {
        router.navigate("/")
    };

    const handleSubmitRegister = () => {
        // Validação dos campos obrigatórios
        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Validação de confirmação de senha
        if (form.password !== form.confirmPassword) {
            Alert.alert('Erro', 'As senhas não conferem.');
            return;
        }

        // Validação de email básica
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
            return;
        }

        // Validação de senha mínima
        if (form.password.length < 6) {
            Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        // Se tudo estiver ok, faz o cadastro
        signUpWithEmail();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textCadastro}>
                Cadastro
            </Text>
            <View style={styles.form}>
                <View style={styles.inputsContainer}>
                    <InputText label='Nome'
                    leftIcon={<Image source={require("@/assets/images/edit-name.png")}
                    style={{ marginRight: 10 }}></Image>}
                    value={form.name}
                    onChangeText={(text) => setForm({ ...form, name: text })} />
                    <InputText label='E-mail'
                    leftIcon={<Image source={require("@/assets/images/at-email.png")}
                    style={{ marginRight: 10 }}></Image>}
                    value={form.email}
                    onChangeText={(text) => setForm({ ...form, email: text })} />
                    <PasswordInput label='Senha'
                    leftIcon={<Image source={require("@/assets/images/key-password.png")}
                    style={{ marginRight: 10 }}></Image>}
                    value={form.password}
                    onChangeText={(text) => setForm({ ...form, password: text })} />
                    <PasswordInput label='Confirmar Senha'
                    leftIcon={<Image source={require("@/assets/images/key-password.png")}
                    style={{ marginRight: 10 }}></Image>}
                    value={form.confirmPassword}
                    onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
                    onBlur={() => {if(form.confirmPassword !== form.password) Alert.alert('As senhas não conferem.')}} />
                    <InputText label='CNPJ'
                    leftIcon={<Image source={require("@/assets/images/id-cnpj.png")}
                    style={{ marginRight: 10 }}></Image>}
                    value={form.cnpj}
                    onChangeText={(text) => setForm({ ...form, cnpj: text })} />
                    <InputText label='Nome do Hotel'
                    leftIcon={<Image source={require("@/assets/images/nome-hotel.png")}
                    style={{ marginRight: 10 }}></Image>}
                    value={form.hotelName}
                    onChangeText={(text) => setForm({ ...form, hotelName: text })} />
                    <InputText label='Telefone'
                    leftIcon={<Image source={require("@/assets/images/callback-vector.png")}
                    style={{ marginRight: 10 }}></Image>}
                    value={form.telefone}
                    onChangeText={(text) => setForm({ ...form, telefone: text })}
                    keyboardType="phone-pad" />
                </View>

                <View style={styles.buttonContainer}>
                    <ButtonPoint label="Cadastrar" onPress={handleSubmitRegister} />
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