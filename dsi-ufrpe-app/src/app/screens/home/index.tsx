import { supabase } from "@/lib/supabase";
import { DashboardCard } from "@/src/components/DashboardCard";
import { QuickActionButton } from "@/src/components/QuickActionButton";
import { Separator } from "@/src/components/Separator";
import { StatCard } from "@/src/components/StatCard";
import { listarClientes } from "@/src/services/clientesService";
import { listarFuncionarios } from "@/src/services/funcionariosService";
import { listarQuartos } from "@/src/services/quartosService";
import { listarReservas } from "@/src/services/reservasService";
import { listarAtividades } from "@/src/services/atividadesService";
import { Ionicons } from '@expo/vector-icons';
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface DashboardStats {
    reservations: { total: number; today: number; confirmed: number };
    clients: { total: number; active: number };
    employees: { total: number };
    rooms: { total: number; available: number; occupied: number };
    activities: { total: number; scheduled: number };
}

export default function Home() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [username, setUsername] = useState('Usuário');
    const [session, setSession] = useState<Session | null>(null);
    const [stats, setStats] = useState<DashboardStats>({
        reservations: { total: 0, today: 0, confirmed: 0 },
        clients: { total: 0, active: 0 },
        employees: { total: 0 },
        rooms: { total: 0, available: 0, occupied: 0 },
        activities: { total: 0, scheduled: 0 },
    });

    // Busca perfil do usuário e nome do funcionário vinculado
    const getProfile = useCallback(async () => {
        try {
            console.log('🔍 Iniciando getProfile...');
            
            // Busca a sessão atual
            const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
            
            console.log('📝 Sessão obtida:', currentSession);
            
            if (sessionError) {
                console.error('❌ Erro ao obter sessão:', sessionError);
                throw sessionError;
            }
            
            if (!currentSession?.user) {
                console.error('❌ Usuário não autenticado!');
                router.replace('/screens/Login');
                return;
            }

            console.log('✅ Usuário autenticado:', currentSession.user.id);
            setSession(currentSession);

            // Tenta usar o display_name do user metadata (cadastrado no registro)
            const displayName = currentSession.user.user_metadata?.display_name;
            
            if (displayName) {
                const firstName = displayName.split(' ')[0];
                console.log('✅ Usando display_name do metadata:', firstName);
                setUsername(firstName);
                return;
            }

            // Fallback: usa o email
            if (currentSession?.user?.email) {
                const emailName = currentSession.user.email.split('@')[0];
                console.log('✅ Usando email como username:', emailName);
                setUsername(emailName);
            }
        } catch (error) {
            console.error('❌ Erro ao buscar perfil:', error);
        }
    }, [router]);

    // Busca estatísticas do dashboard
    const loadDashboardStats = useCallback(async () => {
        try {
            setLoading(true);

            // Busca estatísticas em paralelo usando os services
            const [reservas, clientes, funcionarios, quartos, atividades] = await Promise.all([
                listarReservas(),
                listarClientes(),
                listarFuncionarios(),
                listarQuartos(),
                listarAtividades(),
            ]);

            // Processa reservas
            const today = new Date().toISOString().split('T')[0];
            const reservasHoje = reservas.filter((r) => 
                r.data_checkin?.startsWith(today)
            ).length;
            const reservasConfirmadas = reservas.filter((r) => 
                r.status === 'confirmada'
            ).length;

            // Processa quartos
            const quartosDisponiveis = quartos.filter((q) => q.status === 'disponível').length;
            const quartosOcupados = quartos.filter((q) => q.status === 'ocupado').length;

            // Processa atividades agendadas (status ativo e data futura)
            const agora = new Date();
            const atividadesAgendadas = atividades.filter((a) => {
                if (a.status !== 'ativa') return false;
                if (!a.data_hora) return false;
                const dataAtividade = new Date(a.data_hora);
                return dataAtividade > agora;
            }).length;

            setStats({
                reservations: {
                    total: reservas.length,
                    today: reservasHoje,
                    confirmed: reservasConfirmadas,
                },
                clients: {
                    total: clientes.length,
                    active: clientes.length,
                },
                employees: {
                    total: funcionarios.length,
                },
                rooms: {
                    total: quartos.length,
                    available: quartosDisponiveis,
                    occupied: quartosOcupados,
                },
                activities: {
                    total: atividades.length,
                    scheduled: atividadesAgendadas,
                },
            });
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            Alert.alert('Erro', 'Não foi possível carregar as estatísticas do dashboard.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        console.log('🚀 useEffect executado');
        getProfile();
        loadDashboardStats();

        // Listener para mudanças na autenticação
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('🔄 Auth state changed:', _event, session?.user?.id);
            if (session) {
                setSession(session);
            } else {
                router.replace('/screens/Login');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [getProfile, loadDashboardStats]);

    const onRefresh = () => {
        setRefreshing(true);
        loadDashboardStats();
    };

    const handleLogout = async () => {
        Alert.alert(
            'Sair',
            'Deseja realmente sair do aplicativo?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        await supabase.auth.signOut();
                        router.replace('/screens/Login');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View style={styles.userInfo}>
                            <View style={styles.avatar}>
                                <Ionicons name="person" size={24} color="#FFFFFF" />
                            </View>
                            <View>
                                <Text style={styles.greeting}>Bem-vindo! 👋</Text>
                                <Text style={styles.username}>{username}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogout}
                        >
                            <Ionicons name="log-out-outline" size={22} color="#FFE157" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    >
                        {/* Quick Stats */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Visão Rápida</Text>
                            <View style={styles.statsRow}>
                                <StatCard
                                    icon="calendar-outline"
                                    value={stats.reservations.today}
                                    label="Hoje"
                                />
                                <StatCard
                                    icon="checkmark-circle-outline"
                                    value={stats.reservations.confirmed}
                                    label="Confirmadas"
                                />
                                <StatCard
                                    icon="bed-outline"
                                    value={stats.rooms.available}
                                    label="Disponíveis"
                                />
                            </View>
                        </View>

                        <Separator marginTop={8} marginBottom={16} />

                        {/* Quick Actions */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Ações Rápidas</Text>
                            <View style={styles.actionsRow}>
                                <QuickActionButton
                                    icon="add-circle-outline"
                                    label="Nova Reserva"
                                    onPress={() => router.push('/screens/Reserva/CriacaoReserva')}
                                    variant="primary"
                                />
                                <QuickActionButton
                                    icon="person-add-outline"
                                    label="Novo Cliente"
                                    onPress={() => router.push('/screens/Cliente/CriacaoCliente')}
                                    variant="secondary"
                                />
                            </View>
                        </View>

                        <Separator marginTop={8} marginBottom={16} />

                        {/* Main Cards */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Gerenciamento</Text>

                            <DashboardCard
                                icon="calendar"
                                title="Reservas"
                                count={stats.reservations.total}
                                subtitle={`${stats.reservations.confirmed} confirmadas`}
                                color="#0162B3"
                                onPress={() => router.push('/screens/Reserva/ListagemReserva')}
                            />

                            <DashboardCard
                                icon="people"
                                title="Clientes"
                                count={stats.clients.total}
                                subtitle="Cadastrados no sistema"
                                color="#10B981"
                                onPress={() => router.push('/screens/Cliente/ListagemCliente')}
                            />

                            <DashboardCard
                                icon="bed"
                                title="Quartos"
                                count={stats.rooms.total}
                                subtitle={`${stats.rooms.available} disponíveis • ${stats.rooms.occupied} ocupados`}
                                color="#F59E0B"
                                onPress={() => router.push('/screens/Quarto/ListagemQuarto')}
                            />

                            <DashboardCard
                                icon="briefcase"
                                title="Funcionários"
                                count={stats.employees.total}
                                subtitle="Equipe registrada"
                                color="#6366F1"
                                onPress={() => router.push('/screens/Funcionario/ListagemFuncionario')}
                            />

                            <DashboardCard
                                icon="fitness"
                                title="Atividades"
                                count={stats.activities.total}
                                subtitle={`${stats.activities.scheduled} agendadas`}
                                color="#EC4899"
                                onPress={() => router.push('/screens/Atividade/ListagemAtividade')}
                            />

                            <DashboardCard
                                icon="location"
                                title="Localização"
                                subtitle="Ver localização do hotel no mapa"
                                color="#14B8A6"
                                onPress={() => router.push('/screens/Localizacao' as any)}
                            />
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#132F3B',
    },
    header: {
        backgroundColor: '#132F3B',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#0162B3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    greeting: {
        fontSize: 14,
        color: '#E0F2FE',
        marginBottom: 2,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFE157',
    },
    logoutButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#132F3B',
        borderWidth: 1.5,
        borderColor: '#FFE157',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
    },
    content: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
});