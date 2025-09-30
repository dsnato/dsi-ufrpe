import HeaderName from "@/src/components/HeaderName";
import InfoCard from "@/src/components/InfoCard";
import RoomInfoCard from "@/src/components/RoomInfoCard";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Home() {
    function onLogout() {
        router.replace("/screens/Login")
    }

    return (
        <View style={styles.whiteContainer}>
            <View style={styles.headerSection}>
                <HeaderName title="Renato Samico" iconNameLeft="person-circle" iconNameRight="exit" />
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeText}>
                        Bem-vindo, Renato Samico!
                    </Text>
                </View>
            </View>

            <View style={styles.midContainer}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.textVariant}>Visão Geral</Text>
                    
                    <View style={styles.cardsSection}>
                        <View style={styles.cardsRow}>
                            <InfoCard iconName="calendar" subtitle="9 planejadas" title="Reservas" />
                            <InfoCard iconName="person" subtitle="32 clientes" title="Cliente" />
                        </View>
                        
                        <View style={styles.cardsRow}>
                            <InfoCard iconName="people" subtitle="7 contratados" title="Funcionarios" />
                            <InfoCard iconName="bed" subtitle="12 disponível" title="Quartos" />
                        </View>
                        
                        <View style={styles.cardsRow}>
                            <InfoCard iconName="happy" subtitle="5 agendadas" title="Atividades" />
                        </View>
                    </View>

                    <Text style={styles.textVariant}>Reservas do dia</Text>
                    
                    <View style={styles.roomInfoContainer}>
                        <RoomInfoCard title="25/10 - 30/10" subtitle="Casal" />
                        <RoomInfoCard title="10/11 - 20/11" subtitle="Quadruplo" />
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    whiteContainer: {
        flex: 1,
        backgroundColor: "#132F3B",
    },

    headerSection: {
        flex: 0.2, // 20% da tela para o header e welcome
        justifyContent: 'space-between',
    },

    welcomeSection: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        flex: 1,
    },

    midContainer: {
        flex: 0.8, // 80% da tela
        backgroundColor: "#F2F2F2",
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        paddingTop: 10,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },

    textVariant: {
        fontSize: 20,
        color: "#4BBAED",
        fontWeight: '900',
        marginBottom: 10, // Espaçamento consistente
    },

    cardsSection: {
        marginBottom: 0, // Espaçamento consistente entre seções
    },

    cardsRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: 16, // Espaçamento consistente entre linhas
        paddingHorizontal: 8,
        gap: 20, // Espaçamento consistente entre cards
    },

    roomInfoContainer: {
        flexDirection: "row",
        gap: 20, // Espaçamento consistente entre cards
        justifyContent: "center",
    },

    welcomeText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFE157",
        textAlign: 'center',
        alignSelf: 'flex-start',
    },

    // Estilos não utilizados removidos para limpeza
    text: {
        fontSize: 18,
        color: "#314EA6",
        fontWeight: "bold"
    },
    icon: {
    marginBottom: 4,
    },
});