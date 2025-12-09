import { supabase } from "@/lib/supabase";
import { ActionButton } from "@/src/components/ActionButton";
import { ErrorState } from "@/src/components/ErrorState";
import { InfoHeader } from "@/src/components/InfoHeader";
import { InfoRow } from "@/src/components/InfoRow";
import { Loading } from "@/src/components/Loading";
import { ProfileSection } from "@/src/components/ProfileSection";
import { Separator } from "@/src/components/Separator";
import { useToast } from "@/src/components/ToastContext";
import {
  buscarFuncionarioPorId,
  excluirFuncionario,
  Funcionario,
} from "@/src/services/funcionariosService";
import {
  formatCPF,
  formatPhone,
  withPlaceholder,
} from "@/src/utils/formatters";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const InfoFuncionario: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  // Estados
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
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
        icon: "#2176ff",
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
        modalBg: "#0B1624",
        modalText: "#F1F5F9",
      },
    }),
    []
  );

  const theme = useMemo(
    () => palettes[isDarkMode ? "dark" : "light"],
    [isDarkMode, palettes]
  );

  /**
   * Carrega preferência de tema do usuário
   */
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
  const loadFuncionario = useCallback(async () => {
    if (!id) {
      setError(t("employees.employeeIdNotProvided"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const data = await buscarFuncionarioPorId(id as string);

    if (!data) {
      setError(t("employees.employeeNotFound"));
      setLoading(false);
      return;
    }

    setFuncionario(data);
    setLoading(false);
  }, [id, t]);

  // Recarrega os dados sempre que a tela receber foco
  useFocusEffect(
    useCallback(() => {
      loadThemePreference();
      loadFuncionario();
    }, [loadThemePreference, loadFuncionario])
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

      await excluirFuncionario(id as string);

      showSuccess(t("employees.deleteSuccess"));

      setTimeout(() => {
        router.push("/screens/Funcionario/ListagemFuncionario");
      }, 1500);
    } catch (error: any) {
      showError(
        `${t("employees.deleteError")}: ${error?.message || t("common.error")}`
      );
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
          entity="Funcionários"
          onBackPress={() => router.back()}
          colors={{
            background: theme.background,
            breadcrumb: theme.breadcrumb,
            accent: theme.accent,
            backIcon: theme.backIcon,
          }}
        />
        <View style={[styles.subContainer, { backgroundColor: theme.content }]}>
          <Loading
            message={t("common.loadingEmployee")}
            isDarkMode={isDarkMode}
          />
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ✅ REQUISITO 3: Mensagem de erro amigável se não encontrado
   */
  if (error || !funcionario) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={["top"]}
      >
        <InfoHeader
          entity={t("employees.title")}
          onBackPress={() => router.back()}
          colors={{
            background: theme.background,
            breadcrumb: theme.breadcrumb,
            accent: theme.accent,
            backIcon: theme.backIcon,
          }}
        />
        <View style={[styles.subContainer, { backgroundColor: theme.content }]}>
          <ErrorState
            message={error || t("employees.employeeNotFound")}
            onRetry={loadFuncionario}
            onGoBack={() =>
              router.push("/screens/Funcionario/ListagemFuncionario")
            }
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
        entity={t("employees.title")}
        onBackPress={() => router.back()}
        colors={{
          background: theme.background,
          breadcrumb: theme.breadcrumb,
          accent: theme.accent,
          backIcon: theme.backIcon,
        }}
      />

      {/* Seção de foto e nome no fundo azul */}
      <ProfileSection
        name={withPlaceholder(
          funcionario.nome_completo,
          t("employees.nameNotInformed")
        )}
        subtitle={withPlaceholder(
          funcionario.cargo,
          t("employees.positionNotInformed")
        )}
        backgroundColor={theme.background}
        nameColor={isDarkMode ? "#FDE047" : "#FFE157"}
        subtitleColor={theme.textSecondary}
      />

      {/* Container branco com informações */}
      <View style={[styles.subContainer, { backgroundColor: theme.content }]}>
        <View style={styles.funcionarioTitleContainer}>
          <Text style={[styles.funcionarioTitle, { color: theme.text }]}>
            {t("employees.personalInfo")}
          </Text>
        </View>
        <Separator />
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ✅ REQUISITO 7 e 8: Informações formatadas com placeholders */}
          <InfoRow
            icon="card-outline"
            label={t("employees.cpfLabel")}
            value={formatCPF(funcionario.cpf)}
            iconColor={theme.icon}
            labelColor={theme.textSecondary}
            valueColor={theme.text}
          />

          <InfoRow
            icon="call-outline"
            label={t("employees.phoneLabel")}
            value={formatPhone(funcionario.telefone)}
            iconColor={theme.icon}
            labelColor={theme.textSecondary}
            valueColor={theme.text}
          />

          <InfoRow
            icon="mail-outline"
            label={t("employees.emailLabel")}
            value={withPlaceholder(
              funcionario.email,
              t("employees.emailNotInformed")
            )}
            iconColor={theme.icon}
            labelColor={theme.textSecondary}
            valueColor={theme.text}
          />
        </ScrollView>

        {/* Linha divisória */}
        <Separator />

        {/* Botões de ação */}
        <View style={styles.options}>
          {/* ✅ REQUISITO 4: Botão editar com ID correto */}
          <ActionButton
            variant="primary"
            icon="create-outline"
            onPress={() =>
              router.push({
                pathname: "/screens/Funcionario/EdicaoFuncionario",
                params: { id: funcionario.id },
              })
            }
            tone={isDarkMode ? "dark" : "light"}
          >
            {t("employees.editEmployee")}
          </ActionButton>

          {/* ✅ REQUISITO 5: Modal de confirmação implementado */}
          <ActionButton
            variant="danger"
            icon="trash-outline"
            onPress={handleDelete}
            tone={isDarkMode ? "dark" : "light"}
          >
            {t("employees.deleteEmployee")}
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
            <Text style={[styles.modalTitle, { color: theme.modalText }]}>
              {t("employees.confirmDelete")}
            </Text>
            <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>
              {t("employees.confirmDeleteMessage")}
            </Text>
            <View style={styles.modalButtons}>
              <ActionButton
                variant="secondary"
                onPress={cancelDelete}
                style={styles.modalButton}
                tone={isDarkMode ? "dark" : "light"}
              >
                {t("common.cancel")}
              </ActionButton>
              <ActionButton
                variant="danger"
                onPress={confirmDelete}
                style={styles.modalButton}
                tone={isDarkMode ? "dark" : "light"}
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
  funcionarioTitleContainer: {
    marginBottom: 16,
  },
  funcionarioTitle: {
    fontSize: 20,
    fontWeight: "bold",
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
    color: "#DC2626",
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
});

export default InfoFuncionario;
