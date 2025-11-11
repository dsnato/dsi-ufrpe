import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import InfoCard from '@/src/components/InfoCard';
import TextInputRounded from '@/src/components/TextInputRounded';
import { useRouter, useFocusEffect } from 'expo-router';
import { listarAtividades } from '@/src/services/atividadesService';
import type { AtividadeRecreativa } from '@/src/services/atividadesService';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const ListagemAtividade: React.FC = () => {
    const router = useRouter();
    const [atividades, setAtividades] = useState<AtividadeRecreativa[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');

    const carregarAtividades = async () => {
        try {
            setLoading(true);
            const dados = await listarAtividades();
            setAtividades(dados);
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : 'Erro ao carregar atividades';
            Alert.alert('Erro', mensagem);
            console.error('Erro ao carregar atividades:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            carregarAtividades();
        }, [])
    );

    const handleRefresh = () => {
        setRefreshing(true);
        carregarAtividades();
    };

    const filteredItems = atividades.filter(a => 
        a.nome.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{backgroundColor: "black", width: "100%", flex: 1}}>
                <View style={{backgroundColor: "white", flex: 1, width: "100%", height: "100%"}}>
                    <View style={styles.mainContainer}>
                        <View style={{alignItems: 'center', marginBottom: 20}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', alignSelf: 'flex-start', marginHorizontal: 50, marginTop: 15, color: '#FFE157'}}>Funcionalidades</Text>
                            <View style={styles.gridContainer}>
                                <InfoCard 
                                    title="Adicionar Atividade" 
                                    elevate={false}
                                    onPress={() => router.push('/screens/Atividade/CriacaoAtividade')}
                                />
                            </View>
                        </View>
                        <TextInputRounded value={search} onChangeText={setSearch} />
                        <View style={[styles.gridContainer, {flex: 1, backgroundColor: "#EFEFF0" ,borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 30, justifyContent: 'center', paddingTop: 20, flexDirection: 'column'}]}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', alignSelf: 'flex-start', marginTop: 15, color: '#4BBAED'}}>Lista de Atividades</Text>
                            
                            {loading && !refreshing ? (
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <ActivityIndicator size="large" color="#4BBAED" />
                                    <Text style={{marginTop: 10, color: '#64748B'}}>Carregando atividades...</Text>
                                </View>
                            ) : filteredItems.length === 0 ? (
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize: 16, color: '#64748B'}}>
                                        {search ? 'Nenhuma atividade encontrada' : 'Nenhuma atividade cadastrada'}
                                    </Text>
                                </View>
                            ) : (
                                <FlatList
                                    data={filteredItems}
                                    keyExtractor={item => item.id!}
                                    numColumns={2}
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#4BBAED']} />
                                    }
                                    renderItem={({ item }) => (
                                        <View style={{flex: 1, margin: 5}}>
                                            <TouchableOpacity onPress={() => router.push(`/screens/Atividade/InfoAtividade?id=${item.id}`)}>
                                                <InfoCard
                                                    iconName="calendar"
                                                    title={item.nome}
                                                    subtitle={new Date(item.data_hora).toLocaleString('pt-BR')}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: "#132F3B",
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        gap: 10,
    },
});

export default ListagemAtividade;
