import { supabase } from "@/lib/supabase";
import { ActionButton } from "@/src/components/ActionButton";
import { ErrorState } from "@/src/components/ErrorState";
import { InfoHeader } from "@/src/components/InfoHeader";
import { InfoRow } from "@/src/components/InfoRow";
import { Loading } from "@/src/components/Loading";
import { Separator } from "@/src/components/Separator";
import { StatusBadge } from "@/src/components/StatusBadge";
import { TitleSection } from "@/src/components/TitleSection";
import { useToast } from "@/src/components/ToastContext";
import {
  AtividadeRecreativa,
  buscarAtividadePorId,
  excluirAtividade,
} from "@/src/services/atividadesService";
import { formatDate, withPlaceholder } from "@/src/utils/formatters";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const InfoAtividade: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  // Estados
  const [atividade, setAtividade] = useState<AtividadeRecreativa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
        breadcrumb: "#E0F2FE",
        accent: "#FFE157",
        backIcon: "#FFFFFF",
        modalOverlay: "rgba(0, 0, 0, 0.5)",
        modalBg: "#FFFFFF",
        modalText: "#132F3B",
      },
      dark: {
        background: "#050C18",
        content: "#0B1624",
        text: "#F1F5F9",
        textSecondary: "#94A3B8",
        icon: "#60A5FA",
        breadcrumb: "#94A3B8",
        accent: "#FDE047",
        backIcon: "#E2E8F0",
        modalOverlay: "rgba(0, 0, 0, 0.7)",
        modalBg: "#1E293B",
        modalText: "#F1F5F9",
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

  /**
   * ✅ REQUISITO 1: Carregamento dos dados usando ID da URL
   * ✅ REQUISITO 6: Atualização automática após retornar da edição (useFocusEffect)
   */
  const loadAtividade = useCallback(async () => {
    if (!id) {
      setError("ID da atividade não fornecido");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const data = await buscarAtividadePorId(id as string);

    if (!data) {
      setError("Atividade não encontrada");
      setLoading(false);
      return;
    }

    setAtividade(data);
    setLoading(false);
  }, [id]);

  // Recarrega os dados sempre que a tela receber foco
  useFocusEffect(
    useCallback(() => {
      loadThemePreference();
      loadAtividade();
    }, [loadAtividade, loadThemePreference])
  );

  /**
   * ✅ REQUISITO 5: Modal de confirmação antes de excluir
   */
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setShowDeleteConfirm(false);
      setLoading(true);

      await excluirAtividade(id as string);

      showSuccess("Atividade excluída com sucesso!");

      setTimeout(() => {
        router.push("/screens/Atividade/ListagemAtividade");
      }, 1500);
    } catch (error: any) {
      showError(`Erro ao excluir: ${error?.message || "Erro desconhecido"}`);
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  /**
   * ✅ REQUISITO 2: Exibição de loading durante busca
   */
  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={["top"]}
      >
        <InfoHeader
          colors={{
            background: theme.background,
            breadcrumb: theme.breadcrumb,
            accent: theme.accent,
            backIcon: theme.backIcon,
          }}
          entity="Atividades"
          onBackPress={() => router.back()}
        />
        <View style={[styles.subContainer, { backgroundColor: theme.content }]}>
          <Loading
            message={t("common.loadingActivity")}
            isDarkMode={isDarkMode}
          />
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ✅ REQUISITO 3: Mensagem de erro amigável se não encontrada
   */
  if (error || !atividade) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={["top"]}
      >
        <InfoHeader
          colors={{
            background: theme.background,
            breadcrumb: theme.breadcrumb,
            accent: theme.accent,
            backIcon: theme.backIcon,
          }}
          entity="Atividades"
          onBackPress={() => router.back()}
        />
        <View style={[styles.subContainer, { backgroundColor: theme.content }]}>
          <ErrorState
            message={error || t("activities.activityNotFound")}
            onRetry={loadAtividade}
            onGoBack={() => router.push("/screens/Atividade/ListagemAtividade")}
            isDarkMode={isDarkMode}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      {/* ✅ REQUISITO 9: Breadcrumb/indicador de navegação */}
      <InfoHeader
        colors={{
          background: theme.background,
          breadcrumb: theme.breadcrumb,
          accent: theme.accent,
          backIcon: theme.backIcon,
        }}
        entity={t("activities.title")}
        onBackPress={() => router.back()}
      />

      {/* Container branco com informações */}
      <View style={[styles.subContainer, { backgroundColor: theme.content }]}>
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Imagem da atividade (se existir) */}
          {atividade.imagem_url && (
            <View style={styles.imageContainer}>
              <Image
                source={atividade.imagem_url}
                style={styles.activityImage}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            </View>
          )}

          {/* Título da atividade com badge de status */}
          <TitleSection
            title={withPlaceholder(atividade.nome, t("activities.noName"))}
            subtitle={t("activities.recreationalActivity")}
            titleColor={theme.text}
            subtitleColor={theme.textSecondary}
            badge={
              <StatusBadge
                text={atividade.status || t("common.active")}
                color={
                  atividade.status?.toLowerCase() === "ativo"
                    ? "#10B981"
                    : "#6B7280"
                }
              />
            }
          />

          {/* ✅ REQUISITO 7 e 8: Informações formatadas com placeholders */}
          <InfoRow
            icon="document-text-outline"
            label={t("activities.descriptionLabel")}
            value={withPlaceholder(
              atividade.descricao,
              t("activities.noDescription")
            )}
            iconColor={theme.icon}
            labelColor={theme.textSecondary}
            valueColor={theme.text}
          />

          <InfoRow
            icon="calendar-outline"
            label={t("activities.dateAndTimeLabel")}
            value={
              atividade.data_hora
                ? formatDate(atividade.data_hora)
                : t("activities.notInformed")
            }
            iconColor={theme.icon}
            labelColor={theme.textSecondary}
            valueColor={theme.text}
          />

          <InfoRow
            icon="location-outline"
            label={t("activities.locationLabel")}
            value={withPlaceholder(
              atividade.local,
              t("activities.locationNotInformed")
            )}
            iconColor={theme.icon}
            labelColor={theme.textSecondary}
            valueColor={theme.text}
          />

          <InfoRow
            icon="people-outline"
            label={t("activities.maxCapacityLabel")}
            value={`${atividade.capacidade_maxima || 0} ${
              atividade.capacidade_maxima === 1
                ? t("rooms.person")
                : t("rooms.people")
            }`}
            iconColor={theme.icon}
            labelColor={theme.textSecondary}
            valueColor={theme.text}
          />

          {atividade.preco !== undefined && (
            <InfoRow
              icon="cash-outline"
              label={t("activities.priceLabel")}
              value={`R$ ${atividade.preco.toFixed(2).replace(".", ",")}`}
              iconColor={theme.icon}
              labelColor={theme.textSecondary}
              valueColor={theme.text}
            />
          )}
        </ScrollView>

        {/* Botões de ação */}
        <View style={styles.options}>
          {/* Linha divisória */}
          <Separator />

          {/* ✅ REQUISITO 4: Botão editar com ID correto */}
          <ActionButton
            variant="primary"
            icon="create-outline"
            tone={isDarkMode ? "dark" : "light"}
            onPress={() =>
              router.push({
                pathname: "/screens/Atividade/EdicaoAtividade",
                params: { id: atividade.id },
              })
            }
          >
            {t("activities.editActivity")}
          </ActionButton>

          {/* ✅ REQUISITO 5: Modal de confirmação implementado */}
          <ActionButton
            variant="danger"
            icon="trash-outline"
            tone={isDarkMode ? "dark" : "light"}
            onPress={handleDelete}
          >
            {t("activities.deleteActivity")}
          </ActionButton>
        </View>
      </View>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <View
          style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}
        >
          <View
            style={[styles.modalContent, { backgroundColor: theme.modalBg }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {t("activities.confirmDelete")}
            </Text>
            <Text style={[styles.modalMessage, { color: theme.modalText }]}>
              {t("activities.confirmDeleteMessage")}
            </Text>
            <View style={styles.modalButtons}>
              <ActionButton
                variant="secondary"
                tone={isDarkMode ? "dark" : "light"}
                onPress={cancelDelete}
                style={styles.modalButton}
              >
                {t("common.cancel")}
              </ActionButton>
              <ActionButton
                variant="danger"
                tone={isDarkMode ? "dark" : "light"}
                onPress={confirmDelete}
                style={styles.modalButton}
              >
                {t("common.delete")}
              </ActionButton>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  breadcrumbText: {
    fontSize: 14,
    opacity: 0.7,
  },
  breadcrumbTextActive: {
    fontSize: 14,
    fontWeight: "600",
  },
  subContainer: {
    flex: 1,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 20,
  },
  scrollContent: {
    flexGrow: 0,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingVertical: 8,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 24,
  },
  options: {
    width: "100%",
    gap: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  buttonPrimary: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  buttonPrimaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDanger: {
    width: "100%",
    height: 48,
    backgroundColor: "transparent",
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDangerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: 8,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    borderRadius: 12,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F1F5F9",
  },
});

export default InfoAtividade;
