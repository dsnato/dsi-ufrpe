import { supabase } from "@/lib/supabase";
import { ActionButton } from "@/src/components/ActionButton";
import { FormInput } from "@/src/components/FormInput";
import { ImagePicker } from "@/src/components/ImagePicker";
import { InfoHeader } from "@/src/components/InfoHeader";
import { Separator } from "@/src/components/Separator";
import { useToast } from "@/src/components/ToastContext";
import "@/src/i18n";
import {
  atualizarCliente,
  buscarClientePorId,
  Cliente,
  removerImagemCliente,
  uploadImagemCliente,
} from "@/src/services/clientesService";
import {
  getSuccessMessage,
  getValidationMessage,
} from "@/src/utils/errorMessages";
import { Ionicons } from "@expo/vector-icons";
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
  },
  dark: {
    background: "#050C18",
    content: "#0B1624",
    text: "#E2E8F0",
    textSecondary: "#CBD5E1",
    accent: "#4F9CF9",
    breadcrumb: "#94A3B8",
    backIcon: "#FACC15",
  },
} as const;

const EditarCliente: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [endereco, setEndereco] = useState("");
  const [imagemUri, setImagemUri] = useState<string | null>(null);
  const [imagemOriginal, setImagemOriginal] = useState<string | null>(null);

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

  // Handler para mudança de imagem com log
  const handleImagemSelecionada = (uri: string) => {
    console.log("🎯 [EdicaoCliente] handleImagemSelecionada chamado");
    console.log("🎯 [EdicaoCliente] Nova URI recebida:", uri);
    console.log("🎯 [EdicaoCliente] URI original era:", imagemOriginal);
    setImagemUri(uri);
    console.log("🎯 [EdicaoCliente] Estado imagemUri atualizado para:", uri);
  };

  const handleImagemRemovida = () => {
    console.log("🗑️ [EdicaoCliente] handleImagemRemovida chamado");
    console.log(
      "🗑️ [EdicaoCliente] Removendo imagem. Original era:",
      imagemOriginal
    );
    setImagemUri(null);
    console.log("🗑️ [EdicaoCliente] Estado imagemUri atualizado para: null");
  };

  // Formata CPF automaticamente (000.000.000-00)
  const handleCpfChange = (text: string) => {
    const numbersOnly = text.replace(/\D/g, "");
    const limited = numbersOnly.slice(0, 11);

    let formatted = limited;
    if (limited.length >= 4) {
      formatted = `${limited.slice(0, 3)}.${limited.slice(3)}`;
    }
    if (limited.length >= 7) {
      formatted = `${limited.slice(0, 3)}.${limited.slice(
        3,
        6
      )}.${limited.slice(6)}`;
    }
    if (limited.length >= 10) {
      formatted = `${limited.slice(0, 3)}.${limited.slice(
        3,
        6
      )}.${limited.slice(6, 9)}-${limited.slice(9)}`;
    }

    setCpf(formatted);
  };

  // Formata celular automaticamente (00) 00000-0000
  const handleCelularChange = (text: string) => {
    const numbersOnly = text.replace(/\D/g, "");
    const limited = numbersOnly.slice(0, 11);

    let formatted = limited;
    if (limited.length >= 3) {
      formatted = `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    }
    if (limited.length >= 8) {
      formatted = `(${limited.slice(0, 2)}) ${limited.slice(
        2,
        7
      )}-${limited.slice(7)}`;
    }

    setCelular(formatted);
  };

  // Formata a data automaticamente para DD/MM/AAAA
  const handleDateChange = (text: string) => {
    const numbersOnly = text.replace(/\D/g, "");
    const limited = numbersOnly.slice(0, 8);

    // Valida e corrige o mês (1-12)
    let processedValue = limited;
    if (limited.length >= 4) {
      const month = parseInt(limited.slice(2, 4));
      let correctedMonth = limited.slice(2, 4);

      if (month > 12) {
        correctedMonth = "12";
      } else if (month === 0 && limited.length >= 4) {
        correctedMonth = "01";
      }

      processedValue = limited.slice(0, 2) + correctedMonth + limited.slice(4);
    }

    // Valida e corrige o ano (1900-2100)
    if (processedValue.length === 8) {
      const year = parseInt(processedValue.slice(4, 8));
      let correctedYear = processedValue.slice(4, 8);

      if (year < 1900) {
        correctedYear = "1900";
      } else if (year > 2100) {
        correctedYear = "2100";
      }

      processedValue = processedValue.slice(0, 4) + correctedYear;
    }

    let formatted = processedValue;
    if (processedValue.length >= 3) {
      formatted = `${processedValue.slice(0, 2)}/${processedValue.slice(2)}`;
    }
    if (processedValue.length >= 5) {
      formatted = `${processedValue.slice(0, 2)}/${processedValue.slice(
        2,
        4
      )}/${processedValue.slice(4)}`;
    }

    setDataNascimento(formatted);
  };

  // Valida CPF usando algoritmo de dígitos verificadores
  const validateCpf = (cpfString: string): boolean => {
    const cpfNumbers = cpfString.replace(/\D/g, "");

    if (cpfNumbers.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpfNumbers)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpfNumbers.charAt(i)) * (10 - i);
    }
    let firstDigit = 11 - (sum % 11);
    if (firstDigit >= 10) firstDigit = 0;

    if (firstDigit !== parseInt(cpfNumbers.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpfNumbers.charAt(i)) * (11 - i);
    }
    let secondDigit = 11 - (sum % 11);
    if (secondDigit >= 10) secondDigit = 0;

    if (secondDigit !== parseInt(cpfNumbers.charAt(10))) return false;

    return true;
  };

  // Formata CPF para exibição (adiciona pontos e hífen)
  const formatCpfForDisplay = (cpf: string): string => {
    if (!cpf) return "";
    const numbersOnly = cpf.replace(/\D/g, "");

    if (numbersOnly.length !== 11) return cpf; // Retorna como está se não tiver 11 dígitos

    return `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(
      3,
      6
    )}.${numbersOnly.slice(6, 9)}-${numbersOnly.slice(9)}`;
  };

  // Formata telefone para exibição
  const formatPhoneForDisplay = (phone: string): string => {
    if (!phone) return "";
    const numbersOnly = phone.replace(/\D/g, "");

    if (numbersOnly.length !== 11) return phone; // Retorna como está se não tiver 11 dígitos

    return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(
      2,
      7
    )}-${numbersOnly.slice(7)}`;
  };

  // Carrega os dados do cliente
  const loadCliente = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await buscarClientePorId(id as string);

      if (!data) {
        showError(t("messages.noData"));
        return;
      }

      console.log("📋 [EdicaoCliente] Dados brutos do banco:", data);
      console.log("📋 [EdicaoCliente] CPF do banco:", data.cpf);
      console.log("📋 [EdicaoCliente] Telefone do banco:", data.telefone);

      setNome(data.nome_completo || "");
      setCpf(formatCpfForDisplay(data.cpf || ""));
      setCelular(formatPhoneForDisplay(data.telefone || ""));
      setEmail(data.email || "");
      setDataNascimento(data.data_nascimento || "");
      setEndereco(data.endereco || "");
      setImagemUri(data.imagem_url || null);
      setImagemOriginal(data.imagem_url || null);

      console.log(
        "✅ [EdicaoCliente] CPF formatado:",
        formatCpfForDisplay(data.cpf || "")
      );
      console.log(
        "✅ [EdicaoCliente] Telefone formatado:",
        formatPhoneForDisplay(data.telefone || "")
      );
    } catch (error) {
      console.error("Erro ao carregar cliente:", error);
      showError(t("messages.loadError"));
    } finally {
      setLoading(false);
    }
  }, [id, showError, t]);

  useFocusEffect(
    useCallback(() => {
      loadCliente();
      loadThemePreference();
    }, [loadCliente, loadThemePreference])
  );

  const handleSave = async () => {
    // Validações
    if (!nome.trim()) {
      showError(getValidationMessage("name", "required"));
      return;
    }

    if (!cpf.trim()) {
      showError(getValidationMessage("cpf", "required"));
      return;
    }

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      showError(getValidationMessage("cpf_format", "invalid"));
      return;
    }

    if (!validateCpf(cpf)) {
      showError(getValidationMessage("cpf_digits", "invalid"));
      return;
    }

    if (!celular.trim()) {
      showError(getValidationMessage("celular", "required"));
      return;
    }

    const celularRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!celularRegex.test(celular)) {
      showError(getValidationMessage("celular", "invalid"));
      return;
    }

    if (!email.trim()) {
      showError(getValidationMessage("email", "required"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError(getValidationMessage("email", "invalid"));
      return;
    }

    // Valida data de nascimento (opcional, mas se preenchida deve ser válida)
    if (dataNascimento.trim()) {
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(dataNascimento)) {
        showError(t("validation.invalidDate"));
        return;
      }

      const [day, month, year] = dataNascimento.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      if (
        date.getDate() !== day ||
        date.getMonth() !== month - 1 ||
        date.getFullYear() !== year
      ) {
        showError(t("validation.invalidDate"));
        return;
      }

      // Valida se a data não é futura
      if (date > new Date()) {
        showError(t("validation.invalidDate"));
        return;
      }
    }

    try {
      setLoading(true);

      const clienteData: Partial<Cliente> = {
        nome_completo: nome.trim(),
        cpf: cpf.replace(/\D/g, ""),
        telefone: celular.replace(/\D/g, ""),
        email: email.trim().toLowerCase(),
        data_nascimento: dataNascimento.trim() || undefined,
        endereco: endereco.trim() || undefined,
      };

      await atualizarCliente(id as string, clienteData);

      // Gerenciar imagem
      console.log("🖼️ [EdicaoCliente] Verificando mudanças na imagem...");
      console.log("🖼️ [EdicaoCliente] imagemUri:", imagemUri);
      console.log("🖼️ [EdicaoCliente] imagemOriginal:", imagemOriginal);
      console.log(
        "🖼️ [EdicaoCliente] São diferentes?",
        imagemUri !== imagemOriginal
      );

      // Verifica se é uma nova imagem local (começa com file://)
      const isNewLocalImage = imagemUri && imagemUri.startsWith("file://");
      const imagemFoiAlterada = imagemUri !== imagemOriginal;

      console.log("🖼️ [EdicaoCliente] É imagem local?", isNewLocalImage);
      console.log("🖼️ [EdicaoCliente] Imagem foi alterada?", imagemFoiAlterada);

      if (isNewLocalImage && imagemFoiAlterada) {
        // Nova imagem selecionada - fazer upload
        try {
          console.log("🖼️ [EdicaoCliente] Upload de nova imagem...");
          await uploadImagemCliente(id as string, imagemUri);
          console.log("✅ [EdicaoCliente] Imagem atualizada com sucesso!");
        } catch (error) {
          console.error("❌ [EdicaoCliente] Erro ao atualizar imagem:", error);
          showError(t("messages.saveError"));
        }
      } else if (!imagemUri && imagemOriginal) {
        // Imagem foi removida
        try {
          console.log("🗑️ [EdicaoCliente] Removendo imagem...");
          await removerImagemCliente(id as string);
          console.log("✅ [EdicaoCliente] Imagem removida com sucesso!");
        } catch (error) {
          console.error("❌ [EdicaoCliente] Erro ao remover imagem:", error);
          // Não mostra erro ao usuário pois o cliente já foi atualizado
        }
      }

      showSuccess(getSuccessMessage("update"));

      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      showError(t("messages.saveError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <InfoHeader
        entity={t("navigation.clients")}
        action={t("common.editing")}
        onBackPress={() => router.push("/screens/Cliente/ListagemCliente")}
        colors={{
          background: theme.background,
          breadcrumb: theme.breadcrumb,
          accent: theme.accent,
          backIcon: theme.backIcon,
        }}
      />

      <View style={[styles.content, { backgroundColor: theme.content }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Título da seção */}
          <View style={styles.titleContainer}>
            <Ionicons name="create-outline" size={24} color={theme.accent} />
            <Text style={[styles.title, { color: theme.text }]}>
              {t("clients.editClient")}
            </Text>
          </View>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t("clients.registerNewClient")}
          </Text>

          <Separator marginTop={16} marginBottom={24} />

          {/* Imagem do Cliente */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              {t("clients.clientPhoto")}
            </Text>
            <ImagePicker
              imageUri={imagemUri}
              onImageSelected={handleImagemSelecionada}
              onImageRemoved={handleImagemRemovida}
              disabled={loading}
              tone={isDarkMode ? "dark" : "light"}
              aspect={[1, 1]}
            />
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("clients.name")} <Text style={styles.required}>*</Text>
              </Text>
              <FormInput
                icon="person-outline"
                placeholder={t("clients.fullName")}
                value={nome}
                onChangeText={setNome}
                editable={!loading}
                isDarkMode={isDarkMode}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("clients.cpf")} <Text style={styles.required}>*</Text>
              </Text>
              <FormInput
                icon="card-outline"
                placeholder="000.000.000-00"
                value={cpf}
                onChangeText={handleCpfChange}
                editable={!loading}
                keyboardType="numeric"
                maxLength={14}
                helperText={t("clients.cpfFormat")}
                isDarkMode={isDarkMode}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("clients.phone")} <Text style={styles.required}>*</Text>
              </Text>
              <FormInput
                icon="call-outline"
                placeholder="(00) 00000-0000"
                value={celular}
                onChangeText={handleCelularChange}
                editable={!loading}
                keyboardType="numeric"
                maxLength={15}
                helperText={t("clients.phoneFormat")}
                isDarkMode={isDarkMode}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("clients.email")} <Text style={styles.required}>*</Text>
              </Text>
              <FormInput
                icon="mail-outline"
                placeholder={t("clients.emailPlaceholder")}
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                keyboardType="email-address"
                autoCapitalize="none"
                isDarkMode={isDarkMode}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("clients.birthDate")}
              </Text>
              <FormInput
                icon="calendar-outline"
                placeholder="DD/MM/AAAA"
                value={dataNascimento}
                onChangeText={handleDateChange}
                editable={!loading}
                keyboardType="numeric"
                maxLength={10}
                helperText={t("activities.dateFormat")}
                isDarkMode={isDarkMode}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("clients.address")}
              </Text>
              <FormInput
                icon="location-outline"
                placeholder={t("clients.street")}
                value={endereco}
                onChangeText={setEndereco}
                editable={!loading}
                multiline
                numberOfLines={2}
                isDarkMode={isDarkMode}
              />
            </View>
          </View>

          <Separator marginTop={24} marginBottom={16} />

          {/* Botões de ação */}
          <View style={styles.actions}>
            <ActionButton
              variant="primary"
              icon="checkmark-circle-outline"
              onPress={handleSave}
              disabled={loading}
              tone={isDarkMode ? "dark" : "light"}
            >
              {loading ? t("profile.saving") : t("common.save")}
            </ActionButton>

            <ActionButton
              variant="secondary"
              icon="close-circle-outline"
              onPress={() => router.push("/screens/Cliente/ListagemCliente")}
              disabled={loading}
              tone={isDarkMode ? "dark" : "light"}
            >
              {t("common.cancel")}
            </ActionButton>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 0,
    padding: 20,
    paddingBottom: 40,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  form: {
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  required: {
    color: "#EF4444",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  switchLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  switchTextContainer: {
    flex: 1,
    gap: 4,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  switchDescription: {
    fontSize: 12,
  },
  actions: {
    gap: 12,
  },
});

export default EditarCliente;
