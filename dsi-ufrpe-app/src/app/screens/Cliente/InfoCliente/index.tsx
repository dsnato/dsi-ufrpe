import clientes from "@/src/data/clientes.json";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function InfoDetail({ title, label }: { title: any; label: any }) {
        return (
            <View style={styles.InfoDetailContainer}>
                <Text style={{fontWeight: 'bold', fontSize: 20, color: "#4BBAED"}}>{title}</Text>
                <Text style={{fontSize: 18, color: "#666666"}}>{label}</Text>
            </View>
        );
    }

export default function InfoCard() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const user = clientes.find((c) => c.id === id);
    


    return (
        <SafeAreaProvider style={{flex: 1, backgroundColor: "black"}}>
            <SafeAreaView style={{flex: 1, backgroundColor: "black"}}>
                <View style={styles.mainContainer}>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity style={{position: 'absolute', padding: 5, top: 30, left: 20}} onPress={() => {router.dismiss(1)}}>
                            <Ionicons name="chevron-back-sharp" size={30} color="#7A7A7A"/>
                        </TouchableOpacity>
                        <Image
                            style={styles.image}
                            source={require("../../../../../assets/images/photo-model.png")}
                            placeholder={ "Imagem de Perfil" }
                            contentFit="cover"
                        />
                        <Text style={{fontSize: 24, fontWeight: 'bold', marginTop: 20, color: '#FFE157'}}>{user?.nome}</Text>
                    </View>
                    <ScrollView style={styles.InfoContainer}>
                        <InfoDetail title="Cadastro de Pessoa Física (CPF)" label={user?.nome}/>
                        <InfoDetail title="Endereço" label={`${user?.nome}, ${user?.nome}, ${user?.nome}, ${user?.nome} - ${user?.nome}, CEP: ${user?.nome}`}/>
                        <InfoDetail title="Celular" label={user?.nome}/>
                        <InfoDetail title="Email" label={user?.nome}/>
                        <View style={{height: 100, width: '100%', marginTop: 20, marginBottom: 50, flexDirection: 'row', justifyContent: 'space-around'}}>
                            <TouchableOpacity style={{justifyContent: 'center', backgroundColor: '#fafafa', paddingHorizontal: 48, height: 80, borderRadius: 20, elevation: 5}}>
                                <Text style={{fontSize: 20, fontWeight: 'bold', color: "#4BBAED"}}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{justifyContent: 'center', backgroundColor: '#fafafa', paddingHorizontal: 48, height: 80, borderRadius: 20, elevation: 5}}>
                                <Text style={{fontSize: 20, fontWeight: 'bold', color: "#DE3E3E"}}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: '#0553',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 30,
    },
    InfoContainer: {
        flex: 1,
        width: '100%',
        padding: 40,
        backgroundColor: "#EFEFF0",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        gap: 40,
    },
    InfoDetailContainer: {
        width: '100%',
        gap: 3,
        marginBottom: 20,
    }
});