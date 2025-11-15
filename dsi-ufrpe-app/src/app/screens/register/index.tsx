import { supabase } from '@/lib/supabase';
import { ActionButton } from '@/src/components/ActionButton';
import { FormInput } from '@/src/components/FormInput';
import { Separator } from '@/src/components/Separator';
import { useToast } from '@/src/components/ToastContext';
import { getSuccessMessage, getValidationMessage, translateAuthError } from '@/src/utils/errorMessages';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError, showInfo } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [hotelName, setHotelName] = useState('');
    const [telefone, setTelefone] = useState('');

    // Formata CNPJ (00.000.000/0000-00)
    const handleCnpjChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const limited = numbersOnly.slice(0, 14);

        let formatted = limited;
        if (limited.length >= 3) {
            formatted = `${limited.slice(0, 2)}.${limited.slice(2)}`;
        }
        if (limited.length >= 6) {
            formatted = `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5)}`;
        }
        if (limited.length >= 9) {
            formatted = `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8)}`;
        }
        if (limited.length >= 13) {
            formatted = `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8, 12)}-${limited.slice(12)}`;
        }

        setCnpj(formatted);
    };

    // Formata telefone ((00) 00000-0000)
    const handleTelefoneChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, '');
        const limited = numbersOnly.slice(0, 11);

        let formatted = limited;
        if (limited.length >= 3) {
            formatted = `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
        }
        if (limited.length >= 8) {
            formatted = `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
        }

        setTelefone(formatted);
    };

    async function signUpWithEmail() {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    display_name: name,
                    phone: telefone.replace(/\D/g, ''),
                    cnpj: cnpj.replace(/\D/g, ''),
                    hotel_name: hotelName,
                }
            }
        });

        if (error) {
            showError(translateAuthError(error.message));
        } else if (!session) {
            showInfo('📧 Verifique seu e-mail para confirmar o cadastro e ativar sua conta!');
        } else {
            showSuccess(getSuccessMessage('signup'));
            setTimeout(() => {
                router.replace('/');
            }, 3000);
        }

        setLoading(false);
    }



    const handleLoginRedirect = () => {
        router.navigate("/")
    };

    const handleSubmitRegister = () => {
        // Validação do nome
        if (!name.trim()) {
            showError(getValidationMessage('name', 'required'));
            return;
        }

        if (name.trim().length < 3) {
            showError('O nome deve ter pelo menos 3 caracteres.');
            return;
        }

        // Validação do email
        if (!email.trim()) {
            showError(getValidationMessage('email', 'required'));
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError(getValidationMessage('email', 'invalid'));
            return;
        }

        // Validação da senha
        if (!password) {
            showError(getValidationMessage('password', 'required'));
            return;
        }

        if (password.length < 6) {
            showError(getValidationMessage('password', 'invalid'));
            return;
        }

        // Validação de confirmação de senha
        if (!confirmPassword) {
            showError('Por favor, confirme sua senha.');
            return;
        }

        if (password !== confirmPassword) {
            showError(getValidationMessage('password', 'mismatch'));
            return;
        }

        // Validação do CNPJ
        if (!cnpj.trim()) {
            showError(getValidationMessage('cnpj', 'required'));
            return;
        }

        const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        if (!cnpjRegex.test(cnpj)) {
            showError(getValidationMessage('cnpj', 'invalid'));
            return;
        }

        // Validação do nome do hotel
        if (!hotelName.trim()) {
            showError(getValidationMessage('hotel_name', 'required'));
            return;
        }

        // Validação do telefone
        if (!telefone.trim()) {
            showError(getValidationMessage('phone', 'required'));
            return;
        }

        const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
        if (!telefoneRegex.test(telefone)) {
            showError(getValidationMessage('phone', 'invalid'));
            return;
        }

        // Se tudo estiver ok, faz o cadastro
        signUpWithEmail();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Criar Conta</Text>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Card de Informações Pessoais */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person-circle-outline" size={24} color="#0162B3" />
                        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
                    </View>

                    <Separator marginTop={12} marginBottom={16} />

                    <View style={styles.inputGroup}>
                        <FormInput
                            icon="person-outline"
                            placeholder="Nome completo *"
                            value={name}
                            onChangeText={setName}
                            autoCorrect={false}
                        />

                        <FormInput
                            icon="mail-outline"
                            placeholder="Email *"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            autoCorrect={false}
                        />

                        <FormInput
                            icon="key-outline"
                            placeholder="Senha *"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            helperText="Mínimo 6 caracteres"
                        />

                        <FormInput
                            icon="key-outline"
                            placeholder="Confirmar senha *"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>
                </View>

                {/* Card de Informações do Hotel */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="business-outline" size={24} color="#0162B3" />
                        <Text style={styles.sectionTitle}>Informações do Hotel</Text>
                    </View>

                    <Separator marginTop={12} marginBottom={16} />

                    <View style={styles.inputGroup}>
                        <FormInput
                            icon="business-outline"
                            placeholder="Nome do Hotel *"
                            value={hotelName}
                            onChangeText={setHotelName}
                            autoCorrect={false}
                        />

                        <FormInput
                            icon="document-text-outline"
                            placeholder="CNPJ *"
                            value={cnpj}
                            onChangeText={handleCnpjChange}
                            keyboardType="numeric"
                            helperText="Formato: 00.000.000/0000-00"
                            maxLength={18}
                        />

                        <FormInput
                            icon="call-outline"
                            placeholder="Telefone *"
                            value={telefone}
                            onChangeText={handleTelefoneChange}
                            keyboardType="phone-pad"
                            helperText="Formato: (00) 00000-0000"
                            maxLength={15}
                        />
                    </View>
                </View>

                {/* Botões de ação */}
                <View style={styles.actions}>
                    <ActionButton
                        variant="primary"
                        icon="checkmark-circle-outline"
                        onPress={handleSubmitRegister}
                        disabled={loading}
                    >
                        {loading ? "Cadastrando..." : "Criar Conta"}
                    </ActionButton>

                    <ActionButton
                        variant="secondary"
                        icon="arrow-back-circle-outline"
                        onPress={handleLoginRedirect}
                        disabled={loading}
                    >
                        Voltar para Login
                    </ActionButton>
                </View>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#132F3B',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: '#132F3B',
        gap: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        flex: 1,
    },
    content: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
    },
    inputGroup: {
        gap: 16,
    },
    actions: {
        gap: 12,
        marginTop: 8,
    },
});