import React from "react";
import { StyleSheet, View, Text } from "react-native";


export default function Home() {
    const nome = "nomeUsuario";
    
    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>

            </View>

            <View>
                <Text>
                    Olá, {nome}, bem-vindo de volta!
                </Text>
            </View>

            <View style={styles.proximasReservas}>
                <Text>
                    Próximas Reservas
                </Text>
            </View>

            <View style={styles.atividadesHoje}>
                <Text>
                    Atividades de Hoje
                </Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "auto",
        height: "auto",
        backgroundColor: "#fafafa"
    },
    header: {

    },
    text: {
        fontSize: 18,
        color: "#314EA6",
        fontWeight: 400
    },
    textVariant: {
        fontSize: 16,
        color: "#0162B3",
        fontWeight: 300
    },
    proximasReservas: {

    },
    atividadesHoje: {

    },
})