import { supabase } from '@/lib/supabase';
import ButtonPoint from '@/src/components/button';
import InputText from '@/src/components/input';
import PasswordInput from '@/src/components/password';
import { useToast } from '@/src/components/ToastContext';
import { getSuccessMessage, getValidationMessage, translateAuthError } from '@/src/utils/errorMessages';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError, showInfo } = useToast();
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
            showError(translateAuthError(error.message))
        } else if (!session) {
            showInfo('📧 Verifique seu e-mail para confirmar o cadastro e ativar sua conta!')
        } else {
            showSuccess(getSuccessMessage('signup'))
            setTimeout(() => {
                router.replace('/')
            }, 3000)
        }
        
        setLoading(false)
    }



    const handleLoginRedirect = () => {
        router.navigate("/")
    };

    const handleSubmitRegister = () => {
        // Validação do nome
        if (!form.name) {
            showError(getValidationMessage('name', 'required'));
            return;
        }

        // Validação do email
        if (!form.email) {
            showError(getValidationMessage('email', 'required'));
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            showError(getValidationMessage('email', 'invalid'));
            return;
        }

        // Validação da senha
        if (!form.password) {
            showError(getValidationMessage('password', 'required'));
            return;
        }

        if (form.password.length < 6) {
            showError(getValidationMessage('password', 'invalid'));
            return;
        }

        // Validação de confirmação de senha
        if (!form.confirmPassword) {
            showError('Por favor, confirme sua senha.');
            return;
        }

        if (form.password !== form.confirmPassword) {
            showError(getValidationMessage('password', 'mismatch'));
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
                    onBlur={() => {if(form.confirmPassword && form.confirmPassword !== form.password) showError(getValidationMessage('password', 'mismatch'))}} />
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
                    <ButtonPoint label="Cadastrar" loading={loading} onPress={handleSubmitRegister} />
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