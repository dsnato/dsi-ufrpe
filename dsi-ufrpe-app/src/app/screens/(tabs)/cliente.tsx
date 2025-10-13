import HeaderName from "@/src/components/HeaderName";
import InfoCard from "@/src/components/InfoCard";
import TextInputRounded from "@/src/components/TextInputRounded";
import clientes from "@/src/data/clientes.json";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type Client = {
    id: string;
    nome: string;
    cpf: string;
};

const initialData = clientes;

export default function Crud() {
    const router = useRouter();
    const [items, setItems] = useState(initialData);
    const [search, setSearch] = useState('');
    const filteredItems = items.filter(i => i.nome.toLowerCase().includes(search.toLowerCase()) || i.cpf.includes(search));

    function handleInfoClients(item: Client) {
        router.push({
            pathname: "/screens/Cliente/InfoCliente",
            params: { id: item.id }
        });
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{backgroundColor: "black", width: "100%", flex: 1}}>
                <View style={{backgroundColor: "white", flex: 1, width: "100%", height: "100%"}}>
                    <HeaderName title="Renato Samico" iconNameLeft="person-circle" iconNameRight="exit"/>
                    <View style={styles.mainContainer}>
                        <View style={{alignItems: 'center', marginBottom: 20}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', alignSelf: 'flex-start', marginHorizontal: 50, marginTop: 15, color: '#FFE157'}}>Funcionalidades</Text>
                            <View style={styles.gridContainer}>
                                <InfoCard title="Adicionar" elevate={false} />
                                <InfoCard title="Mapa de funcionário" elevate={false} />
                            </View>
                        </View>
                        <TextInputRounded value={search} onChangeText={setSearch} />
                        <View style={[styles.gridContainer, {flex: 1, backgroundColor: "#EFEFF0" ,borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 30, justifyContent: 'center', paddingTop: 20, flexDirection: 'column'}]}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', alignSelf: 'flex-start', marginTop: 15, color: '#4BBAED'}}>Lista de Clientes</Text>
                                            {filteredItems.length === 0 ? (
                                                <Text style={{flex: 1, textAlign: 'center', color: '#c4c4c4', fontSize: 18, marginTop: 40}}>Nenhum cliente encontrado</Text>
                                            ) : (
                                                <FlatList
                                                    data={filteredItems}
                                                    keyExtractor={item => item.id}
                                                    numColumns={2}
                                                    renderItem={({ item }) => (
                                                        <View style={{flex: 1, margin: 5}}>
                                                            <InfoCard
                                                                iconName="person-circle"
                                                                // elevate={false}
                                                                title={item.nome}
                                                                subtitle={item.cpf}
                                                                onPress={() => handleInfoClients(item)}
                                                            />
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