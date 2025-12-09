import { supabase } from "@/lib/supabase";
import { ActionButton } from "@/src/components/ActionButton";
import { Separator } from "@/src/components/Separator";
import TextInputRounded from "@/src/components/TextInputRounded";
import { useToast } from "@/src/components/ToastContext";
import "@/src/i18n";
import { listarQuartos, Quarto } from "@/src/services/quartosService";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const palettes = {
  light: {
    background: "#132F3B",
    content: "#F8FAFC",
    card: "#FFFFFF",
    text: "#132F3B",
    textSecondary: "#64748B",
    muted: "#94A3B8",
    accent: "#0162B3",
    accentSoft: "#EFF6FF",
    border: "#E2E8F0",
    shadow: "#000",
    icon: "#0162B3",
  },
  dark: {
    background: "#050C18",
    content: "#0B1624",
    card: "#152238",
    text: "#E2E8F0",
    textSecondary: "#CBD5E1",
    muted: "#94A3B8",
    accent: "#4F9CF9",
    accentSoft: "#1E2C44",
    border: "#1F2B3C",
    shadow: "#000",
    icon: "#FACC15",
  },
} as const;

const ListagemQuarto: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { showError } = useToast();
  const [items, setItems] = useState<Quarto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = useMemo(
    () => palettes[isDarkMode ? "dark" : "light"],
    [isDarkMode]
  );

  // Carrega a preferência de tema do Supabase
  const loadThemePreference = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.preferred_theme) {
        setIsDarkMode(session.user.user_metadata.preferred_theme === "dark");
      }
    } catch (error) {
      console.error("Erro ao carregar tema:", error);
    }
  }, []);

  // Carrega tema ao montar componente
  useEffect(() => {
    loadThemePreference();

    // Listener para mudanças no tema
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.user_metadata?.preferred_theme) {
        setIsDarkMode(session.user.user_metadata.preferred_theme === "dark");
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

  // Filtra quartos por número ou tipo
  const filteredItems = items.filter(
    (i) =>
      i.numero_quarto?.toLowerCase().includes(search.toLowerCase()) ||
      i.tipo?.toLowerCase().includes(search.toLowerCase()) ||
      i.status?.toLowerCase().includes(search.toLowerCase())
  );

  // Carrega a lista de quartos
  const loadQuartos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listarQuartos();
      setItems(data);
    } catch (error) {
      console.error("Erro ao carregar quartos:", error);
      showError("Erro ao carregar quartos");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadQuartos();
    }, [loadQuartos])
  );

  // Navega para tela de informações do quarto
  const handleQuartoPress = (id: string) => {
    router.push({
      pathname: "/screens/Quarto/InfoQuarto",
      params: { id },
    });
  };

  // Navega para tela de criação de quarto
  const handleAddQuarto = () => {
    router.push("/screens/Quarto/CriacaoQuarto");
  };

  // Renderiza cada card de quarto
  const renderQuartoCard = ({ item }: { item: Quarto }) => (
    <TouchableOpacity
      style={[styles.quartoCard, { backgroundColor: theme.card }]}
      onPress={() => handleQuartoPress(item.id!)}
      activeOpacity={0.7}
    >
      <View style={[styles.cardIcon, { backgroundColor: theme.accentSoft }]}>
        <Ionicons name="bed" size={32} color={theme.icon} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardNumber, { color: theme.text }]}>
          Quarto {item.numero_quarto}
        </Text>
        <View style={styles.cardFooter}>
          <Ionicons name="bed-outline" size={14} color={theme.textSecondary} />
          <Text style={[styles.cardType, { color: theme.textSecondary }]}>
            {item.tipo}
          </Text>
        </View>
        {item.status && (
          <Text style={[styles.cardStatus, { color: theme.accent }]}>
            {item.status}
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
        <Text style={styles.headerTitle}>{t("rooms.title")}</Text>
      </View>

      <View style={[styles.content, { backgroundColor: theme.content }]}>
        {/* Header com título e botão */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons name="home" size={24} color={theme.icon} />
            <Text style={[styles.title, { color: theme.text }]}>
              {t("rooms.title")}
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? (t("rooms.title2")) : t("rooms.title")}
          </Text>
        </View>

        <Separator marginTop={16} marginBottom={20} />

        {/* Botão de adicionar */}
        <View style={styles.actionContainer}>
          <ActionButton
            variant="primary"
            icon="add-circle-outline"
            onPress={handleAddQuarto}
            tone={isDarkMode ? "dark" : "light"}
          >
            {t("rooms.newRoom")}
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

        {/* Lista de quartos */}
        {filteredItems.length > 0 ? (
          <FlatList
            data={filteredItems}
            keyExtractor={(item, index) => item.id ?? String(index)}
            renderItem={renderQuartoCard}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={theme.muted} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {t("messages.noData")}
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: theme.textSecondary }]}
            >
              {search ? t("common.search") : t("rooms.newRoom")}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ListagemQuarto;

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
  quartoCard: {
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
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  cardContent: {
    gap: 8,
    alignItems: "center",
  },
  cardNumber: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "monospace",
    textAlign: "center",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  cardType: {
    fontSize: 14,
    fontWeight: "500",
  },
  cardStatus: {
    fontSize: 12,
    fontWeight: "600",
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
