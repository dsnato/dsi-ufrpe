import HeaderName from "@/src/components/HeaderName";
import InfoCard from "@/src/components/InfoCard";
import TextInputRounded from "@/src/components/TextInputRounded";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const initialData = [
  { id: '1', nome: 'Ana Clara', cpf: '987.654.321-00' },
  { id: '2', nome: 'Ana Júlia', cpf: '917.234.222-20' },
  { id: '3', nome: 'Carlos José', cpf: '127.124.334-09' },
  { id: '4', nome: 'João Lucas', cpf: '045.254.111-30' },
  { id: '5', nome: 'Maria Silva', cpf: '231.632.345-98' },
  { id: '6', nome: 'Maria da Paz', cpf: '230.103.984-14' },
  { id: '7', nome: 'Edson Gomes', cpf: '655.923.103-87' },
  { id: '8', nome: 'Milka Marques', cpf: '789.456.123-24' },
  { id: '9', nome: 'Adriana Salsa', cpf: '834.943.114-45' },
  { id: '10', nome: 'Evandro Silva', cpf: '201.349.583-58' },
  { id: '11', nome: 'Vinícius Araujo', cpf: '028.095.545-34' },
  { id: '12', nome: 'Denilson Gomes', cpf: '459.293.201-57' },
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
                    <View style={styles.mainContainer}>
                        <View style={{alignItems: 'center', marginBottom: 20}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', alignSelf: 'flex-start', marginHorizontal: 50, marginTop: 15, color: '#FFE157'}}>Funcionalidades</Text>
                            <View style={styles.gridContainer}>
                                <InfoCard title="Adicionar Funcionário" elevate={false} />
                            </View>
                        </View>
                        <TextInputRounded value={search} onChangeText={setSearch} />
                        <View style={[styles.gridContainer, {flex: 1, backgroundColor: "#EFEFF0" ,borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 30, justifyContent: 'center', paddingTop: 20, flexDirection: 'column'}]}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', alignSelf: 'flex-start', marginTop: 15, color: '#4BBAED'}}>Lista de Funcionários</Text>
                            <FlatList
                                data={filteredItems}
                                keyExtractor={item => item.id}
                                numColumns={2}
                                renderItem={({ item }) => (
                                    <View style={{flex: 1, margin: 5}}>
                                        <InfoCard
                                            iconName="person"
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