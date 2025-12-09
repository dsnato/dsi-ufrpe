import { supabase } from "@/lib/supabase";
import { ActionButton } from "@/src/components/ActionButton";
import { ErrorState } from "@/src/components/ErrorState";
import { InfoHeader } from "@/src/components/InfoHeader";
import { InfoRow } from "@/src/components/InfoRow";
import { Loading } from "@/src/components/Loading";
import { ProfileSection } from "@/src/components/ProfileSection";
import { Separator } from "@/src/components/Separator";
import { useToast } from "@/src/components/ToastContext";
import "@/src/i18n";
import {
  buscarClientePorId,
  Cliente,
  excluirCliente,
} from "@/src/services/clientesService";
import {
  formatCPF,
  formatPhone,
  withPlaceholder,
} from "@/src/utils/formatters";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const palettes = {
  light: {
    background: "#132F3B",
    content: "#F8FAFC",
    text: "#132F3B",
    textSecondary: "#64748B",
    accent: "#0162B3",
    breadcrumb: "#94A3B8",
    backIcon: "#FFFFFF",
    icon: "#0162B3",
  },
  dark: {
    background: "#050C18",
    content: "#0B1624",
    text: "#E2E8F0",
    textSecondary: "#CBD5E1",
    accent: "#4F9CF9",
    breadcrumb: "#94A3B8",
    backIcon: "#FACC15",
    icon: "#FACC15",
  },
} as const;

export default function InfoCliente() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  // Estados
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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

  /**
   * ✅ REQUISITO 1: Carregamento dos dados usando ID da URL
   * ✅ REQUISITO 6: Atualização automática após retornar da edição (useFocusEffect)
   */
  const loadCliente = useCallback(async () => {
    if (!id) {
      setError("ID do cliente não fornecido");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const data = await buscarClientePorId(id as string);

    if (!data) {
      setError("Cliente não encontrado");
      setLoading(false);
      return;
    }

    console.log(
      "📋 [InfoCliente] Dados do cliente recebidos:",
      JSON.stringify(data, null, 2)
    );
    console.log("🖼️ [InfoCliente] URL da imagem do cliente:", data.imagem_url);

    setCliente(data);
    setLoading(false);
  }, [id]);

  // Recarrega os dados sempre que a tela receber foco
  useFocusEffect(
    useCallback(() => {
      loadCliente();
      loadThemePreference();
    }, [loadCliente, loadThemePreference])
  );

  /**
   * ✅ REQUISITO 5: Modal de confirmação antes de excluir
   */
  const handleDelete = () => {
    console.log("🟡 [InfoCliente] handleDelete chamado!");
    console.log("🟡 [InfoCliente] Cliente ID:", id);
    console.log("🟡 [InfoCliente] Cliente objeto:", cliente);

    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      console.log("🔴 [InfoCliente] Iniciando exclusão, ID:", id);
      setShowDeleteConfirm(false);
      setLoading(true);

      await excluirCliente(id as string);

      console.log("✅ [InfoCliente] Exclusão concluída com sucesso");
      showSuccess("Cliente excluído com sucesso!");

      setTimeout(() => {
        router.push("/screens/Cliente/ListagemCliente");
      }, 1500);
    } catch (error: any) {
      console.error("🔴 [InfoCliente] Erro ao excluir:", error);
      console.error("🔴 [InfoCliente] Mensagem:", error?.message);
      console.error("🔴 [InfoCliente] Stack:", error?.stack);
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
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <InfoHeader
          entity={t("clients.title")}
          onBackPress={() => router.back()}
          colors={{
            background: theme.background,
            breadcrumb: theme.breadcrumb,
            accent: theme.accent,
            backIcon: theme.backIcon,
          }}
        />
        <View style={[styles.subContainer, { backgroundColor: theme.content }]}>
          <Loading message={t("common.loading")} isDarkMode={isDarkMode} />
        </View>
      </View>
    );
  }

  /**
   * ✅ REQUISITO 3: Mensagem de erro amigável se não encontrado
   */
  if (error || !cliente) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <InfoHeader
          entity={t("clients.title")}
          onBackPress={() => router.push("/screens/Cliente/ListagemCliente")}
          colors={{
            background: theme.background,
            breadcrumb: theme.breadcrumb,
            accent: theme.accent,
            backIcon: theme.backIcon,
          }}
        />
        <View style={[styles.subContainer, { backgroundColor: theme.content }]}>
          <ErrorState
            message={error || "Cliente não encontrado"}
            onRetry={loadCliente}
            onGoBack={() => router.push("/screens/Cliente/ListagemCliente")}
          />
        </View>
      </View>
    );
  }

  // Log para debug da imagem
  console.log(
    "🎨 [InfoCliente] Renderizando com imagem_url:",
    cliente.imagem_url
  );
  console.log(
    "🎨 [InfoCliente] ImageSource será:",
    cliente.imagem_url
      ? { uri: cliente.imagem_url }
      : "undefined (imagem padrão)"
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      {/* ✅ REQUISITO 9: Breadcrumb/indicador de navegação */}
      <InfoHeader
        entity={t("clients.title")}
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
        name={withPlaceholder(cliente.nome_completo, "Nome não informado")}
        subtitle={t("clients.client")}
        imageSource={
          cliente.imagem_url ? { uri: cliente.imagem_url } : undefined
        }
        backgroundColor={theme.background}
        nameColor={isDarkMode ? "#FDE047" : "#FFE157"}
        subtitleColor={theme.textSecondary}
      />

      {/* Container branco com informações */}
      <View style={[styles.subContainer, { backgroundColor: theme.content }]}>
        <View style={styles.clientTitleContainer}>
          <Text style={[styles.clientTitle, { color: theme.text }]}>
            {t("clients.personalInfo")}
          </Text>
        </View>
        <Separator />
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ✅ REQUISITO 7 e 8: Dados formatados com placeholders */}
          <InfoRow
            icon="person-outline"
            label="CPF"
            value={formatCPF(cliente.cpf)}
            iconColor={theme.icon}
            labelColor={theme.textSecondary}
            valueColor={theme.text}
          />

          <InfoRow
            icon="location-outline"
            label={t("clients.address").toUpperCase()}
            value={
              cliente.endereco
                ? `${cliente.endereco}, ${cliente.cidade} - ${
                    cliente.estado
                  }, ${cliente.pais || ""}`
                : "Endereço não informado"
            }
            iconColor={theme.icon}
            labelColor={theme.textSecondary}
            valueColor={theme.text}
          />

          <InfoRow
            icon="call-outline"
            label={t("clients.phone").toUpperCase()}
            value={formatPhone(cliente.telefone)}
            iconColor={theme.icon}
            labelColor={theme.textSecondary}
            valueColor={theme.text}
          />

          <InfoRow
            icon="mail-outline"
            label={t("clients.email").toUpperCase()}
            value={withPlaceholder(cliente.email, "Email não informado")}
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
                pathname: "/screens/Cliente/EdicaoCliente",
                params: { id: cliente.id },
              })
            }
            tone={isDarkMode ? "dark" : "light"}
          >
            {t("clients.editClient")}
          </ActionButton>

          {/* ✅ REQUISITO 5: Modal de confirmação implementado */}
          <ActionButton
            variant="danger"
            icon="trash-outline"
            onPress={handleDelete}
            tone={isDarkMode ? "dark" : "light"}
          >
            {t("common.delete")}
          </ActionButton>
        </View>
      </View>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("common.confirmDeletion")}</Text>
            <Text style={styles.modalMessage}>
              {t("clients.confirmDeleteMessage")}
            </Text>
            <View style={styles.modalButtons}>
              <ActionButton
                variant="secondary"
                onPress={cancelDelete}
                style={styles.modalButton}
              >
                {t("common.cancel")}
              </ActionButton>
              <ActionButton
                variant="danger"
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  clientTitleContainer: {
    marginBottom: 16,
  },
  clientTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  clientSubtitle: {
    fontSize: 16,
    textTransform: "uppercase",
  },
  options: {
    width: "100%",
    gap: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
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
    color: "#64748B",
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
