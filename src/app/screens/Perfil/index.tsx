import { supabase } from "@/lib/supabase";
import { FormSelect, SelectOption } from "@/src/components/FormSelect";
import { InfoHeader } from "@/src/components/InfoHeader";
import { useToast } from "@/src/components/ToastContext";
import { listarAtividades } from "@/src/services/atividadesService";
import { listarReservas } from "@/src/services/reservasService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const themeOptions: SelectOption[] = [
  { label: "Modo Claro", value: "light" },
  { label: "Modo Escuro", value: "dark" },
];

const palettes = {
  light: {
    background: "#132F3B",
    content: "#F8FAFC",
    card: "#FFFFFF",
    text: "#0F172A",
    muted: "#94A3B8",
    accent: "#0162B3",
    accentSoft: "#E0F2FE",
    highlight: "#E3F2FD",
    icon: "#0162B3",
    border: "#E2E8F0",
    shadow: "#00000025",
  },
  dark: {
    background: "#050C18",
    content: "#0B1624",
    card: "#152238",
    text: "#E2E8F0",
    muted: "#94A3B8",
    accent: "#4F9CF9",
    accentSoft: "#1E2C44",
    highlight: "#1B2A42",
    icon: "#FACC15",
    border: "#1F2B3C",
    shadow: "#00000070",
  },
} as const;

export default function Perfil() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const [displayName, setDisplayName] = useState("Gerente do Hotel");
  const [email, setEmail] = useState("gerente@hotel.com");
  const [role, setRole] = useState("Gerente");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [preferredTheme, setPreferredTheme] = useState<"light" | "dark">(
    "light"
  );
  const [hotelName, setHotelName] = useState("Hotel Atlântico");
  const [updatingTheme, setUpdatingTheme] = useState(false);
  const [highlightLoading, setHighlightLoading] = useState(true);
  const [highlightMetrics, setHighlightMetrics] = useState({
    confirmedReservations: 0,
    upcomingActivities: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Erro ao buscar sessão:", error);
        return;
      }

      if (!data.session?.user) {
        router.replace("/screens/Login");
        return;
      }

      const currentSession = data.session;

      const metadata = currentSession.user.user_metadata || {};
      const name =
        metadata.display_name ||
        currentSession.user.email?.split("@")[0] ||
        "Usuário";
      const userRole = metadata.profile_role || metadata.role || "Colaborador";
      const savedTheme = metadata.preferred_theme === "dark" ? "dark" : "light";
      const savedHotel =
        metadata.hotel_name ||
        metadata.nome_hotel ||
        metadata.hotel ||
        "Hotel Atlântico";

      setDisplayName(name);
      setEmail(currentSession.user.email || "usuario@hotel.com");
      setRole(userRole);
      setPreferredTheme(savedTheme);
      setHotelName(savedHotel);
      setAvatarUrl(metadata.avatar_url || null);
    };

    fetchProfile();

    // Listener para atualizar avatar em tempo real
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.user_metadata?.avatar_url !== undefined) {
        setAvatarUrl(session.user.user_metadata.avatar_url || null);
      }
      if (session?.user?.user_metadata?.preferred_theme) {
        setPreferredTheme(
          session.user.user_metadata.preferred_theme === "dark"
            ? "dark"
            : "light"
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    const loadHighlightMetrics = async () => {
      try {
        const [reservas, atividades] = await Promise.all([
          listarReservas(),
          listarAtividades(),
        ]);

        const confirmedReservations = reservas.filter((reserva) => {
          const status = (reserva.status || "").toLowerCase();
          return status === "confirmada";
        }).length;

        const now = new Date();
        const upcomingActivities = atividades.filter((atividade) => {
          if (atividade.status !== "ativa" || !atividade.data_hora)
            return false;
          const activityDate = new Date(atividade.data_hora);
          return activityDate > now;
        }).length;

        setHighlightMetrics({ confirmedReservations, upcomingActivities });
      } catch (error) {
        console.error("Erro ao carregar destaques do perfil:", error);
      } finally {
        setHighlightLoading(false);
      }
    };

    loadHighlightMetrics();
  }, []);

  const initials = useMemo(() => {
    const parts = displayName.split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [displayName]);

  const theme = useMemo(() => palettes[preferredTheme], [preferredTheme]);

  const handleEditProfile = () => {
    router.push({
      pathname: "/screens/Perfil/EdicaoPerfil",
      params: { theme: preferredTheme, hotelName },
    });
  };

  const handleThemeChange = async (value: string) => {
    const normalized: "light" | "dark" = value === "dark" ? "dark" : "light";
    if (normalized === preferredTheme || updatingTheme) return;

    setUpdatingTheme(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { preferred_theme: normalized },
      });

      if (error) {
        throw error;
      }

      setPreferredTheme(normalized);
      showSuccess(
        normalized === "dark"
          ? "Modo escuro aplicado em todas as telas compatíveis."
          : "Modo claro aplicado em todas as telas compatíveis."
      );
    } catch (err) {
      console.error("Erro ao atualizar preferência de tema:", err);
      showError(
        "Não foi possível atualizar o tema. Tente novamente em instantes."
      );
    } finally {
      setUpdatingTheme(false);
    }
  };

  const highlightCards = useMemo(
    () => [
      {
        icon: "calendar-outline" as const,
        label: "Reservas confirmadas",
        value: highlightLoading
          ? "..."
          : `${highlightMetrics.confirmedReservations.toLocaleString("pt-BR")}`,
      },
      {
        icon: "sparkles-outline" as const,
        label: "Atividades futuras",
        value: highlightLoading
          ? "..."
          : `${highlightMetrics.upcomingActivities.toLocaleString("pt-BR")}`,
      },
    ],
    [highlightLoading, highlightMetrics]
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <InfoHeader
        entity="Perfil"
        action="Gerente"
        onBackPress={() => router.push("/screens/home")}
        colors={{ background: theme.background }}
      />
      <View style={[styles.content, { backgroundColor: theme.content }]}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.profileCard,
              { backgroundColor: theme.card, shadowColor: theme.shadow },
            ]}
          >
            <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
            <Text style={[styles.displayName, { color: theme.text }]}>
              {displayName}
            </Text>
            <View
              style={[styles.rolePill, { backgroundColor: theme.highlight }]}
            >
              <Ionicons name="star" size={16} color={theme.icon} />
              <Text style={[styles.roleText, { color: theme.text }]}>
                {role}
              </Text>
            </View>
            <Text style={[styles.email, { color: theme.muted }]}>{email}</Text>

            <View
              style={[
                styles.hotelTag,
                {
                  backgroundColor: theme.accentSoft,
                  borderColor: theme.accent,
                },
              ]}
            >
              <Ionicons name="business-outline" size={20} color={theme.icon} />
              <View style={styles.hotelInfo}>
                <Text style={[styles.hotelLabel, { color: theme.muted }]}>
                  Hotel
                </Text>
                <Text
                  style={[styles.hotelName, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {hotelName}
                </Text>
              </View>
            </View>

            <View style={styles.metricsContainer}>
              <Text style={[styles.metricsTitle, { color: theme.text }]}>
                Destaques
              </Text>
              <View style={styles.metricsGrid}>
                {highlightCards.map((item) => (
                  <View
                    key={item.label}
                    style={[
                      styles.metricCard,
                      {
                        backgroundColor: theme.accentSoft,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.metricIconCircle,
                        { backgroundColor: theme.accent },
                      ]}
                    >
                      <Ionicons name={item.icon} size={18} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.metricValue, { color: theme.text }]}>
                      {item.value}
                    </Text>
                    <Text
                      style={[styles.metricLabel, { color: theme.muted }]}
                      numberOfLines={2}
                    >
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View
            style={[
              styles.section,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Preferências do gerente
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.muted }]}>
              Ajustes essenciais para quem toma decisões rápidas.
            </Text>

            <View style={styles.preferenceCard}>
              <View style={styles.preferenceHeader}>
                <Ionicons
                  name="contrast-outline"
                  size={20}
                  color={theme.icon}
                />
                <View>
                  <Text style={[styles.preferenceLabel, { color: theme.text }]}>
                    Tema do aplicativo
                  </Text>
                  <Text
                    style={[styles.preferenceHelper, { color: theme.muted }]}
                  >
                    Defina a paleta ideal para liderar o hotel.
                  </Text>
                </View>
              </View>
              <FormSelect
                icon="color-palette"
                placeholder="Selecionar modo"
                value={preferredTheme}
                options={themeOptions}
                onSelect={handleThemeChange}
                helperText={
                  updatingTheme
                    ? "Aplicando tema em todo o painel..."
                    : "Sua escolha será refletida em todo o painel."
                }
                disabled={updatingTheme}
                isDarkMode={preferredTheme === "dark"}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.accent }]}
              onPress={handleEditProfile}
              activeOpacity={0.85}
            >
              <Ionicons name="create-outline" size={18} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>
                Editar informações básicas
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  container: {
    padding: 20,
    gap: 20,
  },
  profileCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  avatarText: {
    fontSize: 30,
    fontWeight: "700",
  },
  displayName: {
    fontSize: 24,
    fontWeight: "700",
  },
  email: {
    fontSize: 14,
    marginTop: 8,
  },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#E3F2FD",
  },
  roleText: {
    color: "#0F172A",
    fontWeight: "600",
  },
  hotelTag: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  hotelInfo: {
    flex: 1,
  },
  hotelLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  hotelName: {
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 22,
  },
  metricsContainer: {
    width: "100%",
    marginTop: 24,
    gap: 12,
  },
  metricsTitle: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 8,
  },
  metricIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "700",
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  preferenceCard: {
    marginTop: 20,
    gap: 12,
  },
  preferenceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  preferenceHelper: {
    fontSize: 13,
  },
  primaryButton: {
    marginTop: 24,
    backgroundColor: "#0162B3",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
