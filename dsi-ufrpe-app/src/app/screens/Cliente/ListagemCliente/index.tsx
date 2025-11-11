import HeaderName from "@/src/components/HeaderName";
import InfoCard from "@/src/components/InfoCard";
import TextInputRounded from "@/src/components/TextInputRounded";
import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Alert, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { listarClientes } from "@/src/services/clientesService";
import type { Cliente } from "@/src/services/clientesService";

export default function ListagemCliente() {
    const router = useRouter();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');

    const carregarClientes = async () => {
        try {
            setLoading(true);
            const dados = await listarClientes();
            setClientes(dados);
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : 'Erro ao carregar clientes';
            Alert.alert('Erro', mensagem);
            console.error('Erro ao carregar clientes:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            carregarClientes();
        }, [])
    );

    const handleRefresh = () => {
        setRefreshing(true);
        carregarClientes();
    };

    const filteredItems = clientes.filter(c => 
        c.nome_completo.toLowerCase().includes(search.toLowerCase()) || 
        c.cpf.includes(search)
    );


    return (
        <SafeAreaProvider>
            <SafeAreaView style={{backgroundColor: "black", width: "100%", flex: 1}}>
                <View style={{backgroundColor: "white", flex: 1, width: "100%", height: "100%"}}>
                    <HeaderName title="Renato Samico" iconNameLeft="person-circle" iconNameRight="exit"/>
                    <View style={styles.mainContainer}>
                        <View style={{alignItems: 'center', marginBottom: 20}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', alignSelf: 'flex-start', marginHorizontal: 50, marginTop: 15, color: '#FFE157'}}>Funcionalidades</Text>
                            <View style={styles.gridContainer}>
                                <InfoCard 
                                    title="Adicionar" 
                                    elevate={false}
                                    onPress={() => router.push('/screens/Cliente/CriacaoCliente')}
                                />
                                <InfoCard title="Mapa de funcionário" elevate={false} />
                            </View>
                        </View>
                        <TextInputRounded value={search} onChangeText={setSearch} />
                        <View style={[styles.gridContainer, {flex: 1, backgroundColor: "#EFEFF0" ,borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 30, justifyContent: 'center', paddingTop: 20, flexDirection: 'column'}]}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', alignSelf: 'flex-start', marginTop: 15, color: '#4BBAED'}}>Lista de Clientes</Text>
                            
                            {loading && !refreshing ? (
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <ActivityIndicator size="large" color="#4BBAED" />
                                    <Text style={{marginTop: 10, color: '#64748B'}}>Carregando clientes...</Text>
                                </View>
                            ) : filteredItems.length === 0 ? (
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize: 16, color: '#64748B'}}>
                                        {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
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
                                            <TouchableOpacity onPress={() => router.push(`/screens/Cliente/InfoCliente?id=${item.id}`)}>
                                                <InfoCard
                                                    iconName="person-circle"
                                                    title={item.nome_completo}
                                                    subtitle={item.cpf}
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
    )
}


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
    // backgroundColor: "red",
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 26,
    justifyContent: 'center'
  },
  gridItem: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#718FE9',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '50%',
    height: 160,
  },
  text: {
    fontSize: 24,
    color: "#718FE9",
    fontWeight: "bold",
    textAlign: 'center'
  }
})