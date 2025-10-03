import HeaderName from "@/src/components/HeaderName";
import InfoCard from "@/src/components/InfoCard";
import TextInputRounded from "@/src/components/TextInputRounded";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const initialData = [
    { id: '1', nome: 'João Silva', cpf: '123.456.789-00' },
    { id: '2', nome: 'Maria Santos', cpf: '987.654.321-00' },
    { id: '3', nome: 'Pedro Oliveira', cpf: '456.123.789-11' },
    { id: '4', nome: 'Ana Costa', cpf: '789.321.654-22' },
    { id: '5', nome: 'Carlos Pereira', cpf: '654.987.321-33' },
    { id: '6', nome: 'Juliana Lima', cpf: '321.654.987-44' },
    { id: '7', nome: 'Roberto Alves', cpf: '147.258.369-55' },
    { id: '8', nome: 'Fernanda Souza', cpf: '258.369.147-66' },
    { id: '9', nome: 'Ricardo Martins', cpf: '369.147.258-77' },
    { id: '10', nome: 'Amanda Rocha', cpf: '951.753.824-88' },
];

export default function Crud() {
    const router = useRouter();
    const [items, setItems] = useState(initialData);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [search, setSearch] = useState('');

    const handleUpdate = (updatedData: any) => {
        setItems(prev => prev.map(i => i.id === updatedData.id ? updatedData : i));
        setModalVisible(false);
        setSelectedItem(null);
    };
const filteredItems = items.filter(i => i.nome.toLowerCase().includes(search.toLowerCase()) || i.cpf.includes(search));


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
                                            // onPress={handleEditPress}
                                        />
                                    </View>
                                )}
                            />
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