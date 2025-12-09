import { supabase } from "@/lib/supabase";
import { ActionButton } from "@/src/components/ActionButton";
import { Separator } from "@/src/components/Separator";
import TextInputRounded from "@/src/components/TextInputRounded";
import { useToast } from "@/src/components/ToastContext";
import "@/src/i18n";
import {
  AtividadeRecreativa,
  listarAtividades,
} from "@/src/services/atividadesService";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
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

type Atividade = AtividadeRecreativa;

const ListagemAtividade: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { showError } = useToast();
  const [items, setItems] = useState<Atividade[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Paleta de cores dark/light
  const palettes = useMemo(
    () => ({
      light: {
        background: "#132F3B",
        content: "#F8FAFC",
        text: "#132F3B",
        textSecondary: "#64748B",
        icon: "#0162B3",
        headerText: "#FFFFFF",
        backIcon: "#FFFFFF",
        cardBg: "#FFFFFF",
        cardBorder: "#E2E8F0",
        cardIcon: "#EFF6FF",
        emptyIcon: "#CBD5E1",
        emptyText: "#475569",
        emptySubtext: "#94A3B8",
      },
      dark: {
        background: "#050C18",
        content: "#0B1624",
        text: "#F1F5F9",
        textSecondary: "#94A3B8",
        icon: "#60A5FA",
        headerText: "#F1F5F9",
        backIcon: "#E2E8F0",
        cardBg: "#1E293B",
        cardBorder: "#334155",
        cardIcon: "#1E3A8A",
        emptyIcon: "#475569",
        emptyText: "#E2E8F0",
        emptySubtext: "#64748B",
      },
    }),
    []
  );

  const theme = useMemo(() => {
    return isDarkMode ? palettes.dark : palettes.light;
  }, [isDarkMode, palettes]);

  // Carrega preferência de tema
  const loadThemePreference = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const preferredTheme = user.user_metadata?.preferred_theme;
        setIsDarkMode(preferredTheme === "dark");
      }
    } catch (error) {
      console.error("Erro ao carregar preferência de tema:", error);
    }
  }, []);

  // Filtra atividades por nome, local ou status
  const filteredItems = items.filter(
    (i) =>
      i.nome?.toLowerCase().includes(search.toLowerCase()) ||
      i.local?.toLowerCase().includes(search.toLowerCase()) ||
      i.descricao?.toLowerCase().includes(search.toLowerCase())
  );

  // Carrega a lista de atividades
  const loadAtividades = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listarAtividades();
      console.log("📋 [ListagemAtividade] Atividades carregadas:", data.length);
      console.log("📋 [ListagemAtividade] Primeira atividade:", data[0]);
      console.log(
        "📋 [ListagemAtividade] URLs das imagens:",
        data.map((a) => ({
          nome: a.nome,
          imagem_url: a.imagem_url,
        }))
      );
      setItems(data);
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
      showError("Erro ao carregar atividades");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadThemePreference();
      loadAtividades();
    }, [loadAtividades, loadThemePreference])
  );

  // Navega para tela de informações da atividade
  const handleAtividadePress = (id: string) => {
    router.push({
      pathname: "/screens/Atividade/InfoAtividade",
      params: { id },
    });
  };

  // Navega para tela de criação de atividade
  const handleAddAtividade = () => {
    router.push("/screens/Atividade/CriacaoAtividade");
  };

  // Renderiza cada card de atividade
  const renderAtividadeCard = ({ item }: { item: Atividade }) => {
    // Debug: Log da URL da imagem
    if (item.imagem_url) {
      console.log("🖼️ [Card] Renderizando imagem:", {
        nome: item.nome,
        url: item.imagem_url,
        urlLength: item.imagem_url.length,
      });
    }

    return (
      <TouchableOpacity
        style={[
          styles.atividadeCard,
          {
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
          },
        ]}
        onPress={() => handleAtividadePress(item.id!)}
        activeOpacity={0.7}
      >
        {/* Imagem de thumbnail */}
        {item.imagem_url ? (
          <Image
            source={item.imagem_url}
            style={styles.cardImage}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
            placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
            onError={(error) => {
              console.error("❌ [Card] Erro ao carregar imagem:", {
                nome: item.nome,
                url: item.imagem_url,
                error,
              });
            }}
            onLoad={() => {
              console.log("✅ [Card] Imagem carregada com sucesso:", item.nome);
            }}
          />
        ) : (
          <View
            style={[
              styles.cardImagePlaceholder,
              { backgroundColor: isDarkMode ? "#0F172A" : "#F8FAFC" },
            ]}
          >
            <Ionicons
              name="image-outline"
              size={32}
              color={isDarkMode ? "#475569" : "#CBD5E1"}
            />
          </View>
        )}

        <View style={styles.cardHeader}>
          <View style={[styles.cardIcon, { backgroundColor: theme.cardIcon }]}>
            <Ionicons name="calendar" size={24} color={theme.icon} />
          </View>
          <View
            style={[
              styles.statusBadge,
              item.status === "ativa"
                ? styles.statusActive
                : styles.statusInactive,
            ]}
          >
            <Text style={[styles.statusText, { color: theme.text }]}>
              {item.status || "Inativa"}
            </Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text
            style={[styles.cardTitle, { color: theme.text }]}
            numberOfLines={1}
          >
            {item.nome}
          </Text>
          <View style={styles.cardInfo}>
            <Ionicons
              name="location-outline"
              size={14}
              color={theme.textSecondary}
            />
            <Text
              style={[styles.cardLocation, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {item.local}
            </Text>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.cardInfoItem}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={theme.textSecondary}
              />
              <Text
                style={[styles.cardInfoText, { color: theme.textSecondary }]}
              >
                {item.data_hora
                  ? new Date(item.data_hora).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })
                  : "Data não disponível"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
          <Ionicons name="chevron-back" size={24} color={theme.backIcon} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.headerText }]}>
          {t("activities.title")}
        </Text>
      </View>

      <View style={[styles.content, { backgroundColor: theme.content }]}>
        {/* Header com título e botão */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons name="calendar" size={24} color={theme.icon} />
            <Text style={[styles.title, { color: theme.text }]}>
              {t("activities.title")}
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? (t("activities.title2")) : t("activities.title")}
          </Text>
        </View>

        <Separator marginTop={16} marginBottom={20} />

        {/* Botão de adicionar */}
        <View style={styles.actionContainer}>
          <ActionButton
            variant="primary"
            icon="add-circle-outline"
            tone={isDarkMode ? "dark" : "light"}
            onPress={handleAddAtividade}
          >
            {t("activities.newActivity")}
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

        {/* Lista de atividades */}
        {filteredItems.length > 0 ? (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id || ""}
            renderItem={renderAtividadeCard}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={theme.emptyIcon} />
            <Text style={[styles.emptyTitle, { color: theme.emptyText }]}>
              {t("messages.noData")}
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.emptySubtext }]}>
              {search ? t("common.search") : t("activities.newActivity")}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ListagemAtividade;

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
  atividadeCard: {
    flex: 1,
    maxWidth: "48%",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#F1F5F9",
  },
  cardImagePlaceholder: {
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusActive: {
    backgroundColor: "#D1FAE5",
  },
  statusInactive: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardLocation: {
    fontSize: 13,
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  cardInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardInfoText: {
    fontSize: 12,
    fontFamily: "monospace",
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
