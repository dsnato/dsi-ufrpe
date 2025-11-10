/*src/app/screens/(tabs)/index*/
import { supabase } from "@/lib/supabase";
import HeaderName from "@/src/components/HeaderName";
import InfoCard from "@/src/components/InfoCard";
import RoomInfoCard from "@/src/components/RoomInfoCard";
import { Session } from "@supabase/supabase-js";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ActivityIndicator } from "react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    const params = useLocalSearchParams<{ session?: string }>();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('Usuário');
    const [session, setSession] = useState<Session | null>(null);
    const router = useRouter();

    useEffect(() => {
        getSession();
    }, []);

    async function getSession() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            console.log('Session obtida no Home:', session?.user?.id);
            setSession(session);
            if (session) {
                await getProfile(session);
            } else {
                setUsername('Visitante');
                setLoading(false);
            }
        } catch (error) {
            console.error('Erro ao obter sessão:', error);
            setLoading(false);
        }
    }

    async function getProfile(currentSession: Session) {
        try {
            setLoading(true);

            console.log('🔍 Buscando perfil para ID:', currentSession.user.id);

            const { data, error, status } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', currentSession.user.id)
                .single();

            console.log('Dados retornados:', data);
            console.log('Erro:', error);
            console.log('Status:', status);

            if (error && status !== 406) {
                throw error;
            }

            if (data && data.username) {
                console.log('Username encontrado:', data.username);
                setUsername(data.username);
            } else {
                console.log('Username não encontrado, usando email');
                setUsername(currentSession.user.email?.split('@')[0] || 'Usuário');
            }
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            if (error instanceof Error) {
                Alert.alert('Erro ao carregar perfil', error.message);
            }
            setUsername(currentSession?.user?.email?.split('@')[0] || 'Usuário');
        } finally {
            setLoading(false);
        }
    }

    const navigateTo = (path: string) => {
        router.push(path as any);
    };

    if (loading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#132F3B' }}>
                    <ActivityIndicator size="large" color="#FFE157" />
                    <Text style={{ color: '#FFE157', marginTop: 10 }}>Carregando perfil...</Text>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
                <View style={styles.whiteContainer}>
                    <View style={styles.headerSection}>
                        <HeaderName 
                            title={username} 
                            iconNameLeft="person-circle" 
                            iconNameRight="exit"
                        />
                        <View style={styles.welcomeSection}>
                            <Text style={styles.welcomeText}>
                                Bem-vindo, {username}!
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
                                    <InfoCard 
                                        iconName="calendar" 
                                        subtitle="9 planejadas" 
                                        title="Reservas" 
                                        onPress={() => navigateTo("/screens/Reserva/ListagemReserva")}
                                    />
                                    <InfoCard 
                                        iconName="person" 
                                        subtitle="32 clientes" 
                                        title="Cliente" 
                                        onPress={() => navigateTo("/screens/Cliente/ListagemCliente")}
                                    />
                                </View>
                                
                                <View style={styles.cardsRow}>
                                    <InfoCard 
                                        iconName="people" 
                                        subtitle="7 contratados" 
                                        title="Funcionarios" 
                                        onPress={() => navigateTo("/screens/Funcionario/ListagemFuncionario")}
                                    />
                                    <InfoCard 
                                        iconName="bed" 
                                        subtitle="12 disponível" 
                                        title="Quartos" 
                                        onPress={() => navigateTo("/screens/Quarto/ListagemQuarto")}
                                    />
                                </View>
                                
                                <View style={styles.cardsRow}>
                                    <InfoCard 
                                        iconName="happy" 
                                        subtitle="5 agendadas" 
                                        title="Atividades" 
                                        onPress={() => navigateTo("/screens/Atividade/ListagemAtividade")}
                                    />
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
    );
}

const styles = StyleSheet.create({
    whiteContainer: {
        flex: 1,
        backgroundColor: "#132F3B",
    },
    headerSection: {
        flex: 0.2,
        justifyContent: 'space-between',
    },
    welcomeSection: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        flex: 1,
    },
    midContainer: {
        flex: 0.8,
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
        marginBottom: 10,
    },
    cardsSection: {
        marginBottom: 0,
    },
    cardsRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: 16,
        paddingHorizontal: 8,
        gap: 20,
    },
    roomInfoContainer: {
        flexDirection: "row",
        gap: 20,
        justifyContent: "center",
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFE157",
        textAlign: 'center',
        alignSelf: 'flex-start',
    },
});