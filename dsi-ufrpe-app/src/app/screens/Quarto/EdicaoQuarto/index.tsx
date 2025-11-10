import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, Text } from 'react-native';
import InputWithText from '@/src/components/TextButton';
import ButtonPoint from '@/src/components/button';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { buscarQuartoPorId, atualizarQuarto } from '@/src/services/quartosService';
import type { Quarto } from '@/src/services/quartosService';

const EditarQuarto: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    
    const [numero, setNumero] = useState('');
    const [tipo, setTipo] = useState('');
    const [capacidade, setCapacidade] = useState('');
    const [preco, setPreco] = useState('');
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        carregarQuarto();
    }, []);

    const carregarQuarto = async () => {
        if (!id) {
            Alert.alert('Erro', 'ID do quarto não fornecido');
            router.back();
            return;
        }

        try {
            setLoading(true);
            const dados = await buscarQuartoPorId(id);
            if (dados) {
                setNumero(dados.numero_quarto);
                setTipo(dados.tipo);
                setCapacidade(dados.capacidade.toString());
                setPreco(dados.preco_diario.toString());
            } else {
                Alert.alert('Erro', 'Quarto não encontrado');
                router.back();
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os dados do quarto');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const validarCampos = (): boolean => {
        if (!numero.trim()) {
            Alert.alert('Erro', 'Número do quarto é obrigatório');
            return false;
        }
        if (!tipo.trim()) {
            Alert.alert('Erro', 'Tipo do quarto é obrigatório');
            return false;
        }
        if (!capacidade || parseInt(capacidade) <= 0) {
            Alert.alert('Erro', 'Capacidade inválida');
            return false;
        }
        if (!preco || parseFloat(preco) <= 0) {
            Alert.alert('Erro', 'Preço inválido');
            return false;
        }
        return true;
    };

    const handleAtualizar = async () => {
        if (!validarCampos()) return;

        try {
            setSalvando(true);
            await atualizarQuarto(id, {
                numero_quarto: numero,
                tipo,
                capacidade: parseInt(capacidade),
                preco_diario: parseFloat(preco)
            });
            
            Alert.alert(
                'Sucesso', 
                'Quarto atualizado com sucesso!',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : 'Erro ao atualizar quarto';
            Alert.alert('Erro', mensagem);
        } finally {
            setSalvando(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.form}>
                    <ActivityIndicator size="large" color="#4BBAED" />
                    <Text style={{marginTop: 10, color: '#64748B'}}>Carregando dados...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Image source={require("@/assets/images/callback-vector.png")}></Image>
            </TouchableOpacity>
            <View style={styles.form}>
                <InputWithText 
                    labelText="Número do quarto" 
                    placeholder="Inserir número do quarto" 
                    required={true}
                    value={numero}
                    onChangeText={setNumero}
                />
                <InputWithText 
                    labelText="Tipo do quarto" 
                    placeholder="Inserir tipo do quarto" 
                    required={true}
                    value={tipo}
                    onChangeText={setTipo}
                />
                <InputWithText 
                    labelText="Capacidade do quarto" 
                    placeholder="Escolher capacidade do quarto" 
                    required={true}
                    value={capacidade}
                    onChangeText={setCapacidade}
                    keyboardType="numeric"
                />
                <InputWithText 
                    labelText="Preço do quarto" 
                    placeholder="Escolher preço do quarto" 
                    required={true}
                    value={preco}
                    onChangeText={setPreco}
                    keyboardType="decimal-pad"
                />
                <TouchableOpacity 
                    onPress={handleAtualizar}
                    disabled={salvando}
                    style={[styles.buttonConfirm, salvando && styles.buttonDisabled]}
                >
                    {salvando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Confirmar Alteração</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>

    );

}


const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#132F3B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        flex: 1,
        width: '100%',
        backgroundColor: '#EFEFF0',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginTop: 100,
    },
    buttonConfirm: {
        width: '90%',
        height: 48,
        backgroundColor: '#0162B3',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonDisabled: {
        backgroundColor: '#94a3b8',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
})

export default EditarQuarto;