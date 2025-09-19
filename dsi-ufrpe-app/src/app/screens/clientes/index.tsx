import ButtonPoint from "@/src/components/button";
import Header from "@/src/components/Header";
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const ClienteItem = ({ title, description }: { title: string, description: string }) => {
    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDescription}>{description}</Text>
            </View>
            <TouchableOpacity>
                <FontAwesome name="trash" size={24} color="#E53935" />
            </TouchableOpacity>
        </View>
    );
};

export default function Clientes() {
    const placeholderText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the...";
    const data = [
        { id: '1', title: 'PLACEHOLDER', description: placeholderText },
        { id: '2', title: 'PLACEHOLDER', description: placeholderText },
        { id: '3', title: 'PLACEHOLDER', description: placeholderText },
        { id: '4', title: 'PLACEHOLDER', description: placeholderText },
        { id: '5', title: 'PLACEHOLDER', description: placeholderText },
    ];

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.mainContainer}>
                <Header title="Clientes" non_image={true}/>
                <View style={styles.container}>
                    <ButtonPoint label="Criar"/>
                    <View style={styles.inputContainer}>
                        <FontAwesome name="search" size={20} color="#718FE9" />
                        <TextInput
                            placeholder="Pesquisar"
                            placeholderTextColor={"#718FE9"}
                            style={styles.input}
                        />
                    </View>
                    <FlatList
                        data={data}
                        renderItem={({ item }) => <ClienteItem title={item.title} description={item.description} />}
                        keyExtractor={item => item.id}
                        style={styles.listContainer}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fffffff',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#718FE9',
        borderRadius: 16,
        paddingHorizontal: 15,
        height: 50,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: "#718FE9",
        marginLeft: 10,
    },
    listContainer: {
        flex: 1,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#718FE9',
        padding: 20,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
        marginRight: 10
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#718FE9',
        marginBottom: 5,
    },
    cardDescription: {
        fontSize: 14,
        color: 'gray',
    },
});
