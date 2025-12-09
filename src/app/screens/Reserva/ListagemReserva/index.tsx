import { supabase } from "@/lib/supabase";
import { ActionButton } from "@/src/components/ActionButton";
import { Separator } from "@/src/components/Separator";
import TextInputRounded from "@/src/components/TextInputRounded";
import { useToast } from "@/src/components/ToastContext";
import "@/src/i18n";
import { listarReservas, Reserva } from "@/src/services/reservasService";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ListagemReserva: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { showError } = useToast();
  const [items, setItems] = useState<Reserva[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Paleta de cores
  const palettes = useMemo(
    () => ({
      light: {
        background: "#132F3B",
        content: "#F8FAFC",
        text: "#132F3B",
        textSecondary: "#64748B",
        icon: "#0162B3",
        cardBg: "#FFFFFF",
        cardBorder: "#E2E8F0",
      },
      dark: {
        background: "#050C18",
        content: "#0B1624",
        text: "#F1F5F9",
        textSecondary: "#94A3B8",
        icon: "#60A5FA",
        cardBg: "#1E293B",
        cardBorder: "#334155",
      },
    }),
    []
  );

  const theme = useMemo(
    () => palettes[isDarkMode ? "dark" : "light"],
    [isDarkMode, palettes]
  );

  const loadThemePreference = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const preferredTheme = user.user_metadata?.preferred_theme;
      setIsDarkMode(preferredTheme === "dark");
    } catch (error) {
      console.error("Erro ao carregar tema:", error);
    }
  }, []);

  // Filtra reservas por status ou datas
  const filteredItems = items.filter(
    (i) =>
      i.status?.toLowerCase().includes(search.toLowerCase()) ||
      i.data_checkin?.includes(search) ||
      i.data_checkout?.includes(search)
  );

  // Carrega a lista de reservas
  const loadReservas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listarReservas();
      setItems(data);
    } catch (error) {
      console.error("Erro ao carregar reservas:", error);
      showError("Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadThemePreference();
      loadReservas();
    }, [loadReservas, loadThemePreference])
  );

  // Traduz o status da reserva
  const translateStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      CONFIRMADA: t("reservations.statusConfirmed"),
      CANCELADA: t("reservations.statusCanceled"),
      ATIVA: t("reservations.statusActive"),
      FINALIZADA: t("reservations.statusCompleted"),
      PENDENTE: t("reservations.statusPending"),
    };
    return statusMap[status?.toUpperCase()] || status;
  };

  // Navega para tela de informações da reserva
  const handleReservaPress = (id: string) => {
    router.push({
      pathname: "/screens/Reserva/InfoReserva",
      params: { id },
    });
  };

  // Navega para tela de criação de reserva
  const handleAddReserva = () => {
    router.push("/screens/Reserva/CriacaoReserva");
  };

  // Renderiza cada card de reserva
  const renderReservaCard = ({ item }: { item: Reserva }) => (
    <TouchableOpacity
      style={[
        styles.reservaCard,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
        },
      ]}
      onPress={() => handleReservaPress(item.id!)}
      activeOpacity={0.7}
    >
      <View style={styles.cardIcon}>
        <Ionicons name="bed" size={32} color={theme.icon} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardLabel, { color: theme.text }]}>
          {t("reservations.title2")} #{item.id?.substring(0, 8)}
        </Text>
        {item.status && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {translateStatus(item.status)}
            </Text>
          </View>
        )}
        <View style={styles.cardFooter}>
          <Ionicons
            name="calendar-outline"
            size={14}
            color={theme.textSecondary}
          />
          <Text
            style={[styles.cardDate, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {item.data_checkin} - {item.data_checkout}
          </Text>
        </View>
        {item.valor_total && (
          <Text style={[styles.cardValor, { color: theme.text }]}>
            R$ {item.valor_total.toFixed(2)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      {/* Header customizado para listagem */}
      <View style={[styles.topHeader, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          onPress={() => router.push("/screens/home")}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("reservations.title")}</Text>
      </View>

      <View style={[styles.content, { backgroundColor: theme.content }]}>
        {/* Header com título e botão */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons name="calendar" size={24} color={theme.icon} />
            <Text style={[styles.title, { color: theme.text }]}>
              {t("reservations.title")}
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {filteredItems.length}{" "}
            {filteredItems.length === 1
              ? t("reservations.confirmed").slice(0, -1)
              : t("reservations.confirmed")}
          </Text>
        </View>

        <Separator marginTop={16} marginBottom={20} />

        {/* Botão de adicionar */}
        <View style={styles.actionContainer}>
          <ActionButton
            variant="primary"
            icon="add-circle-outline"
            onPress={handleAddReserva}
            tone={isDarkMode ? "dark" : "light"}
          >
            {t("reservations.newReservation")}
          </ActionButton>
        </View>

        {/* Campo de busca */}
        <View style={styles.searchContainer}>
          <TextInputRounded
            value={search}
            onChangeText={setSearch}
            placeholder={t("common.search")}
            isDarkMode={isDarkMode}
          />
        </View>

        {/* Lista de reservas */}
        {filteredItems.length > 0 ? (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id!}
            renderItem={renderReservaCard}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="search-outline"
              size={64}
              color={isDarkMode ? "#475569" : "#CBD5E1"}
            />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {t("messages.noData")}
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: theme.textSecondary }]}
            >
              {search ? t("common.search") : t("reservations.newReservation")}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ListagemReserva;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    flex: 1,
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    gap: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
  },
  actionContainer: {
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  reservaCard: {
    flex: 1,
    maxWidth: "48%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    gap: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  cardContent: {
    gap: 8,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  statusBadge: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0162B3",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  cardStatus: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cardValor: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10B981",
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  cardDate: {
    fontSize: 12,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
