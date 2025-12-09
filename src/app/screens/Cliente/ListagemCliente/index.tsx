import { supabase } from "@/lib/supabase";
import { ActionButton } from "@/src/components/ActionButton";
import { Separator } from "@/src/components/Separator";
import TextInputRounded from "@/src/components/TextInputRounded";
import { useToast } from "@/src/components/ToastContext";
import "@/src/i18n";
import { Cliente, listarClientes } from "@/src/services/clientesService";
import { formatCPF } from "@/src/utils/formatters";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
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
    icon: "#FACC15",
  },
} as const;

type Client = Cliente;

const ListagemCliente: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { showError } = useToast();
  const [items, setItems] = useState<Cliente[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = useMemo(
    () => (isDarkMode ? palettes.dark : palettes.light),
    [isDarkMode]
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
      console.error("Erro ao carregar preferência de tema:", error);
    }
  }, []);

  useEffect(() => {
    loadThemePreference();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      loadThemePreference();
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [loadThemePreference]);

  useFocusEffect(
    useCallback(() => {
      loadThemePreference();
    }, [loadThemePreference])
  );

  // Filtra clientes por nome ou CPF
  const filteredItems = items.filter(
    (i) =>
      i.nome_completo?.toLowerCase().includes(search.toLowerCase()) ||
      i.cpf?.includes(search) ||
      i.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Carrega a lista de clientes
  const loadClientes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listarClientes();
      setItems(data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      showError("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadClientes();
    }, [loadClientes])
  );

  // Navega para tela de informações do cliente
  const handleClientePress = (id: string) => {
    router.push({
      pathname: "/screens/Cliente/InfoCliente",
      params: { id },
    });
  };

  // Navega para tela de criação de cliente
  const handleAddCliente = () => {
    router.push("/screens/Cliente/CriacaoCliente");
  };

  // Renderiza cada card de cliente
  const renderClienteCard = ({ item }: { item: Client }) => (
    <TouchableOpacity
      style={[
        styles.clienteCard,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
      onPress={() => handleClientePress(item.id!)}
      activeOpacity={0.7}
    >
      {/* Imagem do cliente ou padrão */}
      <View style={styles.cardImageContainer}>
        {item.imagem_url ? (
          <Image
            source={{ uri: item.imagem_url }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[styles.cardIcon, { backgroundColor: theme.accentSoft }]}
          >
            <Ionicons name="person" size={32} color={theme.accent} />
          </View>
        )}
      </View>

      {/* Conteúdo do card */}
      <View style={styles.cardContent}>
        <Text
          style={[styles.cardTitle, { color: theme.text }]}
          numberOfLines={2}
        >
          {item.nome_completo}
        </Text>
        <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
          {formatCPF(item.cpf)}
        </Text>
        <View style={styles.cardFooter}>
          <Ionicons name="location-outline" size={14} color={theme.muted} />
          <Text
            style={[styles.cardLocation, { color: theme.muted }]}
            numberOfLines={1}
          >
            {item.cidade}/{item.estado}
          </Text>
        </View>
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
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {t("clients.title")}
        </Text>
      </View>

      <View style={[styles.content, { backgroundColor: theme.content }]}>
        {/* Header com título e botão */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons name="people" size={24} color={theme.icon} />
            <Text style={[styles.title, { color: theme.text }]}>
              {t("clients.title")}
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? t("clients.client") : t("clients.title")}
          </Text>
        </View>

        <Separator marginTop={16} marginBottom={20} />

        {/* Botão de adicionar */}
        <View style={styles.actionContainer}>
          <ActionButton
            variant="primary"
            icon="add-circle-outline"
            onPress={handleAddCliente}
            tone={isDarkMode ? "dark" : "light"}
          >
            {t("clients.newClient")}
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

        {/* Lista de clientes */}
        {filteredItems.length > 0 ? (
          <FlatList
            data={filteredItems}
            keyExtractor={(item, index) => item.id ?? index.toString()}
            renderItem={renderClienteCard}
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
              {search ? t("common.search") : t("clients.newClient")}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ListagemCliente;

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
  clienteCard: {
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
  cardImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    alignSelf: "center",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 13,
    textAlign: "center",
    fontFamily: "monospace",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 4,
  },
  cardLocation: {
    fontSize: 12,
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
