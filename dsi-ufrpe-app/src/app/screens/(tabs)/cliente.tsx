/*src/app/screens/(tabs)/cliente*/
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
    name: string;
    cpf: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
};

export default function ClientesTab() {
    const router = useRouter();
    const [items] = useState(clientes);
    const [search, setSearch] = useState('');
    
    const filteredItems = items.filter(i => 
        i.name.toLowerCase().includes(search.toLowerCase()) || 
        i.cpf.includes(search)
    );

    const navigateTo = (path: string, params?: any) => {
        router.push({ pathname: path as any, params });
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ backgroundColor: "black", width: "100%", flex: 1 }}>
                <View style={{ backgroundColor: "white", flex: 1, width: "100%", height: "100%" }}>
                    <HeaderName 
                        title="Renato Samico" 
                        iconNameLeft="person-circle" 
                        iconNameRight="exit"
                    />
                    
                    <View style={styles.mainContainer}>
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                            <Text style={styles.sectionTitle}>Funcionalidades</Text>
                            <View style={styles.gridContainer}>
                                {/* ✅ InfoCard já tem onPress, não precisa envolver */}
                                <InfoCard 
                                    title="Adicionar Cliente" 
                                    iconName="person-add"
                                    elevate={false}
                                    onPress={() => navigateTo("/screens/Cliente/CriacaoCliente")}
                                />
                                
                                <InfoCard 
                                    title="Ver Funcionários" 
                                    iconName="list"
                                    elevate={false}
                                    onPress={() => navigateTo("/screens/Funcionario/ListagemFuncionario")}
                                />
                            </View>
                        </View>

                        <TextInputRounded 
                            value={search} 
                            onChangeText={setSearch}
                            placeholder="Buscar por nome ou CPF..."
                        />

                        <View style={styles.listContainer}>
                            <Text style={styles.listTitle}>Lista de Clientes</Text>
                            
                            {filteredItems.length === 0 ? (
                                <Text style={styles.emptyText}>
                                    Nenhum cliente encontrado
                                </Text>
                            ) : (
                                <FlatList
                                    data={filteredItems}
                                    keyExtractor={item => item.id}
                                    numColumns={2}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <View style={styles.cardWrapper}>
                                            {/* ✅ InfoCard já tem onPress */}
                                            <InfoCard
                                                iconName="person-circle"
                                                title={item.name}
                                                subtitle={item.cpf}
                                                onPress={() => navigateTo("/screens/Cliente/InfoCliente", { id: item.id })}
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
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: "#132F3B",
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginHorizontal: 50,
        marginTop: 15,
        color: '#FFE157',
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        gap: 10,
    },
    listContainer: {
        flex: 1,
        backgroundColor: "#EFEFF0",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    listTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginTop: 15,
        color: '#4BBAED',
        marginBottom: 16,
    },
    emptyText: {
        flex: 1,
        textAlign: 'center',
        color: '#c4c4c4',
        fontSize: 18,
        marginTop: 40,
    },
    cardWrapper: {
        flex: 1,
        margin: 5,
    },
});
