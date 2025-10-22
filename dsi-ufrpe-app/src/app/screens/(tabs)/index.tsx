import { supabase } from "@/lib/supabase";
import HeaderName from "@/src/components/HeaderName";
import InfoCard from "@/src/components/InfoCard";
import RoomInfoCard from "@/src/components/RoomInfoCard";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Home({ session }: { session: Session }) {
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('')
    const [website, setWebsite] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    useEffect(() => {
        if (session) getProfile()
    }, [session])

    async function getProfile() {
        try {
        setLoading(true)
        if (!session?.user) throw new Error('No user on the session!') 
        const { data, error, status } = await supabase
            .from('profiles')
            .select(`username, website, avatar_url`)
            .eq('id', session?.user.id)
            .single()
        if (error && status !== 406) {
            throw error
        }
        if (data) {
            setUsername(data.username)
            setWebsite(data.website)
            setAvatarUrl(data.avatar_url)
        }
        } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message)
        }
        } finally {
        setLoading(false)
        }
    }
    
    const router = useRouter();

    function handleClients() {
        router.push({
            pathname: "/screens/Cliente/ListagemCliente"
        });
    }

    function handleReservations() {
        router.push({
            pathname: "/screens/Reserva/ListagemReserva",
        });
    }

    function handleEmployees() {
        router.push({
            pathname: "/screens/Funcionario/ListagemFuncionario",
        });
    }

    function handleRooms() {
        router.push({
            pathname: "/screens/Quarto/ListagemQuarto",
        });
    }

    function handleActivities() {
        router.push({
            pathname: "/screens/Atividade/ListagemAtividade",
        });
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1, backgroundColor: "#000"}}>
                <View style={styles.whiteContainer}>
                    <View style={styles.headerSection}>
                        <HeaderName title="Renato Samico" iconNameLeft="person-circle" iconNameRight="exit"/>
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
                                    <InfoCard iconName="calendar" subtitle="9 planejadas" title="Reservas" onPress={()=> handleReservations()}/>
                                    <InfoCard iconName="person" subtitle="32 clientes" title="Cliente" onPress={()=> handleClients()}/>
                                </View>
                                
                                <View style={styles.cardsRow}>
                                    <InfoCard iconName="people" subtitle="7 contratados" title="Funcionarios" onPress={() => handleEmployees()}/>
                                    <InfoCard iconName="bed" subtitle="12 disponível" title="Quartos" onPress={() => handleRooms()}/>
                                </View>
                                
                                <View style={styles.cardsRow}>
                                    <InfoCard iconName="happy" subtitle="5 agendadas" title="Atividades" onPress={() => handleActivities()}/>
                                </View>
                            </View>

                            <Text style={styles.textVariant}>Reservas do dia</Text>
                            
                            <View style={styles.roomInfoContainer}>
                                <RoomInfoCard title="25/10 - 30/10" subtitle="Casal" />
                                <RoomInfoCard title="25/10 - 29/10" subtitle="Quadruplo" />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
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