import { supabase } from "@/lib/supabase";
import { DashboardCard } from "@/src/components/DashboardCard";
import { QuickActionButton } from "@/src/components/QuickActionButton";
import { Separator } from "@/src/components/Separator";
import { StatCard } from "@/src/components/StatCard";
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

export default function Home({ session }: { session: Session }) {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [username, setUsername] = useState('Usuário');
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
            if (!session?.user) throw new Error('Usuário não autenticado!');

            // Busca o profile do usuário
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select(`username, funcionario_id`)
                .eq('id', session?.user.id)
                .single();

            if (profileError && profileError.code !== 'PGRST116') throw profileError;

            // Se tiver funcionario_id, busca o nome do funcionário ()
            // TODO Possívelmente poderá haver alteração nessa parte
            if (profileData?.funcionario_id) {
                const { data: funcionarioData, error: funcionarioError } = await supabase
                    .from('funcionarios')
                    .select('name')
                    .eq('id', profileData.funcionario_id)
                    .single();

                if (!funcionarioError && funcionarioData?.name) {
                    // Usa apenas o primeiro nome
                    const firstName = funcionarioData.name.split(' ')[0];
                    setUsername(firstName);
                    return;
                }
            }

            // Fallback: usa username do profile ou email
            if (profileData?.username) {
                setUsername(profileData.username);
            } else if (session?.user?.email) {
                const emailName = session.user.email.split('@')[0];
                setUsername(emailName);
            }
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
        }
    }, [session]);

    // Busca estatísticas do dashboard
    const loadDashboardStats = useCallback(async () => {
        try {
            setLoading(true);

            // Busca estatísticas em paralelo
            const [reservasData, clientesData, funcionariosData, quartosData, atividadesData] =
                await Promise.all([
                    supabase.from('reservas').select('id, status, check_in'),
                    supabase.from('clientes').select('id'),
                    supabase.from('funcionarios').select('id'),
                    supabase.from('quartos').select('id, disponivel'),
                    supabase.from('atividade_recreativa').select('id, ativa, data_atividade'),
                ]);

            // Processa reservas
            const today = new Date().toISOString().split('T')[0];
            const reservasHoje = reservasData.data?.filter((r: any) =>
                r.check_in?.startsWith(today)
            ).length || 0;
            const reservasConfirmadas = reservasData.data?.filter((r: any) =>
                r.status === 'Confirmada'
            ).length || 0;

            // Processa quartos
            const quartosDisponiveis = quartosData.data?.filter((q: any) => q.disponivel).length || 0;
            const quartosOcupados = (quartosData.data?.length || 0) - quartosDisponiveis;

            // Processa atividades
            const atividadesAgendadas = atividadesData.data?.filter((a: any) => a.ativa).length || 0;

            setStats({
                reservations: {
                    total: reservasData.data?.length || 0,
                    today: reservasHoje,
                    confirmed: reservasConfirmadas,
                },
                clients: {
                    total: clientesData.data?.length || 0,
                    active: clientesData.data?.length || 0,
                },
                employees: {
                    total: funcionariosData.data?.length || 0,
                },
                rooms: {
                    total: quartosData.data?.length || 0,
                    available: quartosDisponiveis,
                    occupied: quartosOcupados,
                },
                activities: {
                    total: atividadesData.data?.length || 0,
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
        if (session) {
            getProfile();
            loadDashboardStats();
        }
    }, [session, getProfile, loadDashboardStats]);

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
                            <Ionicons name="log-out-outline" size={24} color="#FFE157" />
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
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#132F3B',
        borderWidth: 1,
        borderColor: '#FFE157',
        alignItems: 'center',
        justifyContent: 'center',
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