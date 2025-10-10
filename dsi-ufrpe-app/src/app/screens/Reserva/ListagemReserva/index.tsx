import HeaderName from "@/src/components/HeaderName";
import InfoCard from "@/src/components/InfoCard";
import TextInputRounded from "@/src/components/TextInputRounded";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const initialData = [
    { id: '1', numero: '042', dataReserva: '10/10/26 a 20/10/26' },
    { id: '2', numero: '007', dataReserva: '05/11/26 a 12/11/26' },
    { id: '3', numero: '100', dataReserva: '01/12/26 a 07/12/26' },
    { id: '4', numero: '021', dataReserva: '15/10/26 a 18/10/26' },
    { id: '5', numero: '089', dataReserva: '20/09/26 a 25/09/26' },
    { id: '6', numero: '034', dataReserva: '02/01/27 a 09/01/27' },
    { id: '7', numero: '076', dataReserva: '10/02/27 a 14/02/27' },
    { id: '8', numero: '058', dataReserva: '22/11/26 a 29/11/26' },
    { id: '9', numero: '013', dataReserva: '30/12/26 a 05/01/27' },
    { id: '10', numero: '066', dataReserva: '07/03/27 a 14/03/27' },
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
const filteredItems = items.filter(i => i.numero.toLowerCase().includes(search.toLowerCase()) || i.dataReserva.includes(search));


    return (
        <SafeAreaProvider>
            <SafeAreaView style={{backgroundColor: "black", width: "100%", flex: 1}}>
                <View style={{backgroundColor: "white", flex: 1, width: "100%", height: "100%"}}>                    
                    <View style={styles.mainContainer}>
                        <View style={{alignItems: 'center', marginBottom: 20}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', alignSelf: 'flex-start', marginHorizontal: 50, marginTop: 15, color: '#FFE157'}}>Funcionalidades</Text>
                            <View style={styles.gridContainer}>
                                <InfoCard title="Adicionar" elevate={false} />                            
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
                                            iconName="bed"                                            // elevate={false}
                                            title={item.numero}
                                            subtitle={item.dataReserva}
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