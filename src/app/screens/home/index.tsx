// Reservado

import { supabase } from "@/lib/supabase";
import { DashboardCard } from "@/src/components/DashboardCard";
import { LogoutModal } from "@/src/components/ImagePickerModal";
import { QuickActionButton } from "@/src/components/QuickActionButton";
import { Separator } from "@/src/components/Separator";
import { StatCard } from "@/src/components/StatCard";
import { useToast } from "@/src/components/ToastContext";
import { listarAtividades } from "@/src/services/atividadesService";
import { listarClientes } from "@/src/services/clientesService";
import { listarFuncionarios } from "@/src/services/funcionariosService";
import { listarQuartos } from "@/src/services/quartosService";
import { listarReservas } from "@/src/services/reservasService";
import { Ionicons } from '@expo/vector-icons';
import { Session } from "@supabase/supabase-js";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const palettes = {
    light: {
        background: '#132F3B',
        content: '#F8FAFC',
        card: '#FFFFFF',
        text: '#132F3B',
        textSecondary: '#64748B',
        textMuted: '#94A3B8',
        headerText: '#FFFFFF',
        accent: '#0162B3',
        accentYellow: '#FACC15',
        border: '#E2E8F0',
        // StatCard
        statCardBg: '#FFFFFF',
        statIconBg: '#EFF6FF',
        statIconColor: '#0162B3',
        statValue: '#1E293B',
        statLabel: '#64748B',
        // DashboardCard
        dashCardBg: '#FFFFFF',
        dashCountColor: '#1E293B',
        dashTitleColor: '#64748B',
        dashSubtitleColor: '#94A3B8',
        dashChevronColor: '#94A3B8',
    },
    dark: {
        background: '#050C18',
        content: '#0B1624',
        card: '#152238',
        text: '#E2E8F0',
        textSecondary: '#CBD5E1',
        textMuted: '#94A3B8',
        headerText: '#E2E8F0',
        accent: '#4F9CF9',
        accentYellow: '#FACC15',
        border: '#1F2B3C',
        // StatCard
        statCardBg: '#1A2942',
        statIconBg: 'rgba(79, 156, 249, 0.15)',
        statIconColor: '#60A5FA',
        statValue: '#F1F5F9',
        statLabel: '#94A3B8',
        // DashboardCard
        dashCardBg: '#1A2942',
        dashCountColor: '#F8FAFC',
        dashTitleColor: '#94A3B8',
        dashSubtitleColor: '#64748B',
        dashChevronColor: '#475569',
    },
} as const;

interface DashboardStats {
    reservations: { total: number; today: number; confirmed: number };
    clients: { total: number; active: number };
    employees: { total: number };
    rooms: { total: number; available: number; occupied: number };
    activities: { total: number; scheduled: number };
}

export default function Home() {
    const router = useRouter();
    const { showError } = useToast();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [username, setUsername] = useState('Usuário');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [stats, setStats] = useState<DashboardStats>({
        reservations: { total: 0, today: 0, confirmed: 0 },
        clients: { total: 0, active: 0 },
        employees: { total: 0 },
        rooms: { total: 0, available: 0, occupied: 0 },
        activities: { total: 0, scheduled: 0 },
    });

    const theme = useMemo(() => palettes[isDarkMode ? 'dark' : 'light'], [isDarkMode]);

    // Carrega a preferência de tema do Supabase
    const loadThemePreference = useCallback(async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.user_metadata?.preferred_theme) {
                setIsDarkMode(session.user.user_metadata.preferred_theme === 'dark');
            }
        } catch (error) {
            console.error('Erro ao carregar tema:', error);
        }
    }, []);

    // Carrega tema ao montar componente
    useEffect(() => {
        loadThemePreference();

        // Listener para mudanças no tema
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user?.user_metadata?.preferred_theme) {
                setIsDarkMode(session.user.user_metadata.preferred_theme === 'dark');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [loadThemePreference]);

    // Recarrega tema ao focar na tela
    useFocusEffect(
        useCallback(() => {
            loadThemePreference();
        }, [loadThemePreference])
    );

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
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reseta para início do dia

            // Filtra apenas reservas não finalizadas e não canceladas
            const reservasAtivas = reservas.filter((r) =>
                r.status !== 'Finalizada' && r.status !== 'finalizada' &&
                r.status !== 'Cancelada' && r.status !== 'cancelada'
            );

            const reservasHoje = reservasAtivas.filter((r) => {
                if (!r.data_checkin) return false;

                // Converte data de check-in para Date
                const checkinDate = new Date(r.data_checkin);
                checkinDate.setHours(0, 0, 0, 0);

                // Converte data de check-out para Date (se existir)
                let checkoutDate = null;
                if (r.data_checkout) {
                    checkoutDate = new Date(r.data_checkout);
                    checkoutDate.setHours(0, 0, 0, 0);
                }

                // Check-in é hoje
                if (checkinDate.getTime() === today.getTime()) {
                    return true;
                }

                // Reserva ativa hoje (hoje está entre check-in e check-out)
                if (checkoutDate && checkinDate < today && today < checkoutDate) {
                    return true;
                }

                return false;
            }).length;

            const reservasConfirmadas = reservasAtivas.filter((r) =>
                r.status === 'Confirmada' || r.status === 'confirmada'
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
            showError('Não foi possível carregar as estatísticas do dashboard.');
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
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/screens/Login');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: theme.background }]}>
                    <View style={styles.headerTop}>
                        <View style={styles.userInfo}>
                            <TouchableOpacity
                                style={styles.avatar}
                                onPress={() => router.push('/screens/Perfil')}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="person" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                            <View>
                                <Text style={[styles.greeting, { color: theme.headerText }]}>Bem-vindo! 👋</Text>
                                <Text style={[styles.username, { color: theme.headerText }]}>{username}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogout}
                        >
                            <Ionicons name="log-out-outline" size={22} color={theme.accentYellow} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <View style={[styles.content, { backgroundColor: theme.content }]}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    >
                        {/* Quick Stats */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Visão Rápida</Text>
                            <View style={styles.statsRow}>
                                <StatCard
                                    icon="calendar-outline"
                                    value={stats.reservations.today}
                                    label="Hoje"
                                    backgroundColor={theme.statCardBg}
                                    iconBackground={theme.statIconBg}
                                    iconColor={theme.statIconColor}
                                    valueColor={theme.statValue}
                                    labelColor={theme.statLabel}
                                />
                                <StatCard
                                    icon="checkmark-circle-outline"
                                    value={stats.reservations.confirmed}
                                    label="Confirmadas"
                                    backgroundColor={theme.statCardBg}
                                    iconBackground={theme.statIconBg}
                                    iconColor={theme.statIconColor}
                                    valueColor={theme.statValue}
                                    labelColor={theme.statLabel}
                                />
                                <StatCard
                                    icon="bed-outline"
                                    value={stats.rooms.available}
                                    label="Disponíveis"
                                    backgroundColor={theme.statCardBg}
                                    iconBackground={theme.statIconBg}
                                    iconColor={theme.statIconColor}
                                    valueColor={theme.statValue}
                                    labelColor={theme.statLabel}
                                />
                            </View>
                        </View>

                        <Separator marginTop={8} marginBottom={16} />

                        {/* Quick Actions */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Ações Rápidas</Text>
                            <View style={styles.actionsRow}>
                                <QuickActionButton
                                    icon="add-circle-outline"
                                    label="Nova Reserva"
                                    onPress={() => router.push('/screens/Reserva/CriacaoReserva')}
                                    variant="primary"
                                    surface={isDarkMode ? 'dark' : 'light'}
                                />
                                <QuickActionButton
                                    icon="person-add-outline"
                                    label="Novo Cliente"
                                    onPress={() => router.push('/screens/Cliente/CriacaoCliente')}
                                    variant="secondary"
                                    surface={isDarkMode ? 'dark' : 'light'}
                                />
                            </View>
                        </View>

                        <Separator marginTop={8} marginBottom={16} />

                        {/* Main Cards */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Gerenciamento</Text>

                            <DashboardCard
                                icon="calendar"
                                title="Reservas"
                                count={stats.reservations.total}
                                subtitle={`${stats.reservations.confirmed} confirmadas`}
                                color={isDarkMode ? '#60A5FA' : '#0162B3'}
                                onPress={() => router.push('/screens/Reserva/ListagemReserva')}
                                backgroundColor={theme.dashCardBg}
                                countColor={theme.dashCountColor}
                                titleColor={theme.dashTitleColor}
                                subtitleColor={theme.dashSubtitleColor}
                                chevronColor={theme.dashChevronColor}
                            />

                            <DashboardCard
                                icon="people"
                                title="Clientes"
                                count={stats.clients.total}
                                subtitle="Cadastrados no sistema"
                                color={isDarkMode ? '#34D399' : '#10B981'}
                                onPress={() => router.push('/screens/Cliente/ListagemCliente')}
                                backgroundColor={theme.dashCardBg}
                                countColor={theme.dashCountColor}
                                titleColor={theme.dashTitleColor}
                                subtitleColor={theme.dashSubtitleColor}
                                chevronColor={theme.dashChevronColor}
                            />

                            <DashboardCard
                                icon="bed"
                                title="Quartos"
                                count={stats.rooms.total}
                                subtitle={`${stats.rooms.available} disponíveis • ${stats.rooms.occupied} ocupados`}
                                color={isDarkMode ? '#FBBF24' : '#F59E0B'}
                                onPress={() => router.push('/screens/Quarto/ListagemQuarto')}
                                backgroundColor={theme.dashCardBg}
                                countColor={theme.dashCountColor}
                                titleColor={theme.dashTitleColor}
                                subtitleColor={theme.dashSubtitleColor}
                                chevronColor={theme.dashChevronColor}
                            />

                            <DashboardCard
                                icon="briefcase"
                                title="Funcionários"
                                count={stats.employees.total}
                                subtitle="Equipe registrada"
                                color={isDarkMode ? '#818CF8' : '#6366F1'}
                                onPress={() => router.push('/screens/Funcionario/ListagemFuncionario')}
                                backgroundColor={theme.dashCardBg}
                                countColor={theme.dashCountColor}
                                titleColor={theme.dashTitleColor}
                                subtitleColor={theme.dashSubtitleColor}
                                chevronColor={theme.dashChevronColor}
                            />

                            <DashboardCard
                                icon="fitness"
                                title="Atividades"
                                count={stats.activities.total}
                                subtitle={`${stats.activities.scheduled} agendadas`}
                                color={isDarkMode ? '#F472B6' : '#EC4899'}
                                onPress={() => router.push('/screens/Atividade/ListagemAtividade')}
                                backgroundColor={theme.dashCardBg}
                                countColor={theme.dashCountColor}
                                titleColor={theme.dashTitleColor}
                                subtitleColor={theme.dashSubtitleColor}
                                chevronColor={theme.dashChevronColor}
                            />

                            <DashboardCard
                                icon="analytics"
                                title="Predição de Cancelamento"
                                subtitle="Machine Learning - Análise de risco"
                                color={isDarkMode ? '#A78BFA' : '#8B5CF6'}
                                onPress={() => router.push('/screens/Predicao')}
                                backgroundColor={theme.dashCardBg}
                                countColor={theme.dashCountColor}
                                titleColor={theme.dashTitleColor}
                                subtitleColor={theme.dashSubtitleColor}
                                chevronColor={theme.dashChevronColor}
                            />

                            <DashboardCard
                                icon="location"
                                title="Localização"
                                subtitle="Ver localização do hotel no mapa"
                                color={isDarkMode ? '#5EEAD4' : '#14B8A6'}
                                onPress={() => router.push('/screens/Localizacao' as any)}
                                backgroundColor={theme.dashCardBg}
                                countColor={theme.dashCountColor}
                                titleColor={theme.dashTitleColor}
                                subtitleColor={theme.dashSubtitleColor}
                                chevronColor={theme.dashChevronColor}
                            />
                        </View>
                    </ScrollView>
                </View>

                <LogoutModal
                    visible={showLogoutModal}
                    onClose={() => setShowLogoutModal(false)}
                    onConfirm={confirmLogout}
                    isDarkMode={isDarkMode}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
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
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#FFE157',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
    },
    content: {
        flex: 1,
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
