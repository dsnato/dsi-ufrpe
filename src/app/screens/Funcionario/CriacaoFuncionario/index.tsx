import { supabase } from "@/lib/supabase";
import { ActionButton } from "@/src/components/ActionButton";
import { FormInput } from "@/src/components/FormInput";
import { FormSelect, SelectOption } from "@/src/components/FormSelect";
import { ImagePicker } from "@/src/components/ImagePicker";
import { InfoHeader } from "@/src/components/InfoHeader";
import { Separator } from "@/src/components/Separator";
import { useToast } from "@/src/components/ToastContext";
import "@/src/i18n";
import { criarFuncionario } from "@/src/services/funcionariosService";
import {
  getSuccessMessage,
  getValidationMessage,
} from "@/src/utils/errorMessages";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CriarFuncionario: React.FC = () => {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");
  const [salario, setSalario] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Paleta de cores
  const palettes = useMemo(
    () => ({
      light: {
        background: "#132F3B",
        content: "#F8FAFC",
        text: "#132F3B",
        textSecondary: "#64748B",
        breadcrumb: "#E0F2FE",
        accent: "#FFE157",
        backIcon: "#FFFFFF",
      },
      dark: {
        background: "#050C18",
        content: "#0B1624",
        text: "#F1F5F9",
        textSecondary: "#94A3B8",
        breadcrumb: "#94A3B8",
        accent: "#FDE047",
        backIcon: "#E2E8F0",
      },
    }),
    []
  );

  const theme = useMemo(
    () => palettes[isDarkMode ? "dark" : "light"],
    [isDarkMode, palettes]
  );

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
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
  };

  // Cargos disponíveis
  const cargosDisponiveis: SelectOption[] = useMemo(
    () => [
      { label: t("employees.positions.receptionist"), value: "Recepcionista" },
      { label: t("employees.positions.manager"), value: "Gerente" },
      { label: t("employees.positions.housekeeper"), value: "Camareira" },
      { label: t("employees.positions.maintenance"), value: "Manutenção" },
      { label: t("employees.positions.cook"), value: "Cozinheiro" },
      { label: t("employees.positions.waiter"), value: "Garçom" },
      { label: t("employees.positions.security"), value: "Segurança" },
    ],
    [t]
  );

  // Formata CPF (000.000.000-00)
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

  // Formata celular ((00) 00000-0000)
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

  // Formata data (DD/MM/AAAA)
  const handleDataChange = (text: string) => {
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

    setDataAdmissao(formatted);
  };

  // Formata salário (R$ 0.000,00)
  const handleSalarioChange = (text: string) => {
    const numbersOnly = text.replace(/\D/g, "");
    const numberValue = parseInt(numbersOnly) / 100;

    if (isNaN(numberValue)) {
      setSalario("");
      return;
    }

    const formatted = numberValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setSalario(formatted);
  };

  // Valida CPF
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

  // Valida data
  const validateDate = (dateString: string): Date | null => {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dateString)) return null;

    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day);

    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year
    ) {
      return null;
    }

    return date;
  };

  // Valida email
  const validateEmail = (emailString: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailString);
  };

  const handleSave = async () => {
    // Validações
    if (!nome.trim()) {
      showError(getValidationMessage("name", "required"));
      return;
    }

    if (nome.trim().length < 3) {
      showError("O nome deve ter pelo menos 3 caracteres.");
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

    if (!validateEmail(email)) {
      showError(getValidationMessage("email", "invalid"));
      return;
    }

    if (!cargo) {
      showError(t("validation.selectPosition"));
      return;
    }

    if (!dataAdmissao.trim()) {
      showError(t("validation.enterAdmissionDate"));
      return;
    }

    const dataAdmissaoDate = validateDate(dataAdmissao);
    if (!dataAdmissaoDate) {
      showError("Data de admissão inválida. Use o formato DD/MM/AAAA.");
      return;
    }

    if (!salario.trim()) {
      showError(t("validation.enterSalary"));
      return;
    }

    const salarioNumerico = parseFloat(
      salario.replace(/\./g, "").replace(",", ".")
    );
    if (salarioNumerico <= 0) {
      showError("O salário deve ser maior que zero.");
      return;
    }

    try {
      setLoading(true);

      // Converte data de DD/MM/AAAA para YYYY-MM-DD
      const [day, month, year] = dataAdmissao.split("/");
      const dataAdmissaoFormatada = `${year}-${month}-${day}`;

      const funcionarioData = {
        nome_completo: nome.trim(),
        cpf: cpf.replace(/\D/g, ""),
        telefone: celular.replace(/\D/g, ""),
        email: email.trim().toLowerCase(),
        cargo: cargo,
        data_admissao: dataAdmissaoFormatada,
        salario: salarioNumerico,
        status: ativo ? "ativo" : "inativo",
      };

      await criarFuncionario(funcionarioData);

      showSuccess(getSuccessMessage("create"));

      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      console.error("Erro ao criar funcionário:", error);
      showError("Ocorreu um erro ao criar o funcionário. Tente novamente.");
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
        entity={t("employees.title")}
        action={t("common.addition")}
        onBackPress={() =>
          router.push("/screens/Funcionario/ListagemFuncionario")
        }
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
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={isDarkMode ? "#60A5FA" : "#0162B3"}
            />
            <Text style={[styles.title, { color: theme.text }]}>
              {t("employees.newEmployee", "Novo Funcionário")}
            </Text>
          </View>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t(
              "employees.registerNewEmployee",
              "Cadastre um novo funcionário no sistema"
            )}
          </Text>

          <Separator marginTop={16} marginBottom={24} />

          {/* Foto do Funcionário */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              {t("employees.profilePhoto")}
            </Text>
            <ImagePicker
              imageUri={photoUri}
              onImageSelected={setPhotoUri}
              onImageRemoved={() => setPhotoUri(null)}
              disabled={loading}
              tone={isDarkMode ? "dark" : "light"}
            />
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("employees.fullName")} <Text style={styles.required}>*</Text>
              </Text>
              <FormInput
                icon="person-outline"
                placeholder={t("employees.employeeName")}
                value={nome}
                onChangeText={setNome}
                editable={!loading}
                maxLength={100}
                isDarkMode={isDarkMode}
              />
            </View>

            <View style={[styles.fieldGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("employees.cpf")} <Text style={styles.required}>*</Text>
              </Text>
              <FormInput
                icon="card-outline"
                placeholder="000.000.000-00"
                value={cpf}
                onChangeText={handleCpfChange}
                editable={!loading}
                keyboardType="numeric"
                maxLength={14}
                isDarkMode={isDarkMode}
              />
            </View>

            <View style={[styles.fieldGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("employees.phone")} <Text style={styles.required}>*</Text>
              </Text>
              <FormInput
                icon="call-outline"
                placeholder="(00) 00000-0000"
                value={celular}
                onChangeText={handleCelularChange}
                editable={!loading}
                keyboardType="phone-pad"
                maxLength={15}
                isDarkMode={isDarkMode}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("employees.email")} <Text style={styles.required}>*</Text>
              </Text>
              <FormInput
                icon="mail-outline"
                placeholder={t("employees.employeeEmail")}
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                keyboardType="email-address"
                autoCapitalize="none"
                maxLength={100}
                isDarkMode={isDarkMode}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("employees.position")} <Text style={styles.required}>*</Text>
              </Text>
              <FormSelect
                icon="briefcase-outline"
                placeholder={t("employees.selectPosition")}
                value={cargo}
                options={cargosDisponiveis}
                onSelect={setCargo}
                disabled={loading}
                isDarkMode={isDarkMode}
              />
            </View>

            <View style={[styles.fieldGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("employees.admissionDate")}{" "}
                <Text style={styles.required}>*</Text>
              </Text>
              <FormInput
                icon="calendar-outline"
                placeholder="DD/MM/AAAA"
                value={dataAdmissao}
                onChangeText={handleDataChange}
                editable={!loading}
                keyboardType="numeric"
                maxLength={10}
                helperText={t("employees.hireDate")}
                isDarkMode={isDarkMode}
              />
            </View>

            <View style={[styles.fieldGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("employees.salary")} <Text style={styles.required}>*</Text>
              </Text>
              <FormInput
                icon="cash-outline"
                placeholder="0.000,00"
                value={salario}
                onChangeText={handleSalarioChange}
                editable={!loading}
                keyboardType="numeric"
                helperText={t("employees.monthlySalary")}
                isDarkMode={isDarkMode}
              />
            </View>

            {/* Status do Funcionário */}
            <View
              style={[
                styles.switchContainer,
                {
                  backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                  borderColor: isDarkMode ? "#334155" : "#E2E8F0",
                },
              ]}
            >
              <View style={styles.switchLabel}>
                <Ionicons
                  name={ativo ? "checkmark-circle" : "close-circle"}
                  size={24}
                  color={ativo ? "#10B981" : "#EF4444"}
                />
                <View style={styles.switchTextContainer}>
                  <Text style={[styles.switchTitle, { color: theme.text }]}>
                    {ativo ? "Funcionário Ativo" : "Funcionário Inativo"}
                  </Text>
                  <Text
                    style={[
                      styles.switchDescription,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {ativo
                      ? t("employees.workingNormally")
                      : t("employees.awayOrDismissed")}
                  </Text>
                </View>
              </View>
              <Switch
                value={ativo}
                onValueChange={setAtivo}
                trackColor={{ false: "#EF4444", true: "#10B981" }}
                thumbColor="#FFFFFF"
                disabled={loading}
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
              {loading
                ? t("common.creating", "Criando...")
                : t("employees.createEmployee", "Criar Funcionário")}
            </ActionButton>

            <ActionButton
              variant="secondary"
              icon="close-circle-outline"
              onPress={() =>
                router.push("/screens/Funcionario/ListagemFuncionario")
              }
              disabled={loading}
              tone={isDarkMode ? "dark" : "light"}
            >
              {t("common.cancel", "Cancelar")}
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
    flexGrow: 1,
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
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
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

export default CriarFuncionario;
