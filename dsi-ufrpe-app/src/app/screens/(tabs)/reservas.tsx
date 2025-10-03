import Header from "@/src/components/Header";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


export default function Map() {
    const nome = "nomeUsuario";
    
    const Mock = {
    tipoQuarto: "Quarto duplo",
    numeroQuarto: 1,
    cliente: "ricardo",
    dataCheckin: "10/09/2025",
    dataCheckout: "20/10/2025",
    numeroHospedes: 10
    };

    const Mock2 = {
    tipoQuarto: "Quarto duplo",
    numeroQuarto: 64,
    cliente: "João",
    dataCheckin: "30/09/2025",
    dataCheckout: "02/10/2025",
    numeroHospedes: 3
    };

    const MockEvent = {
        custo: "R$100",
        horario: "18h",
        titulo: "Calcinha Preta",
        local: "Igrejinha"
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
                <View style={styles.mainContainer}>
                    <Header title="MAPA"/>

                    <View style={styles.welcomeMessage}>
                        <Text style={styles.text}>
                            Olá, {nome}, bem-vindo de volta!
                        </Text>
                    </View>

                    <View style={styles.proximasReservas}>
                        <Text style={styles.textVariant}>
                            Próximas Reservas
                        </Text>
                        
                    </View>

                    <View style={styles.atividadesHoje}>
                        <Text style={styles.textVariant}>
                            Atividades de Hoje
                        </Text>

                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "auto",
        height: "auto",
        backgroundColor: "#fafafa",
        padding: 25,
        rowGap: 20
    },
    text: {
        fontSize: 18,
        color: "#314EA6",
        fontWeight: "bold"
    },
    textVariant: {
        fontSize: 16,
        color: "#0162B3",
        fontWeight: 300
    },
    proximasReservas: {
        width: "auto",
        height: "auto",
        rowGap: 5
    },
    atividadesHoje: {
        width: "auto",
        height: "auto",
        rowGap: 5
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2176ff',
    },
    iconSmall: {
        width: 40,
        height: 40,
        marginRight: 8,
    },
    welcomeMessage: {
        width: "auto",
        height: "auto"
    }
})