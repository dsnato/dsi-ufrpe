import { supabase } from "@/lib/supabase";
import { ActionButton } from "@/src/components/ActionButton";
import { FormInput } from "@/src/components/FormInput";
import { FormSelect, SelectOption } from "@/src/components/FormSelect";
import { InfoHeader } from "@/src/components/InfoHeader";
import { Separator } from "@/src/components/Separator";
import { useToast } from "@/src/components/ToastContext";
import "@/src/i18n";
import { listarClientes } from "@/src/services/clientesService";
import { listarQuartos } from "@/src/services/quartosService";
import {
  atualizarReserva,
  buscarReservaPorId,
} from "@/src/services/reservasService";
import { getSuccessMessage } from "@/src/utils/errorMessages";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditarReserva: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dataCheckin, setDataCheckin] = useState("");
  const [dataCheckout, setDataCheckout] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [quartoId, setQuartoId] = useState("");
  const [clienteNome, setClienteNome] = useState("");
  const [quartoNumero, setQuartoNumero] = useState("");
  const [precoDiario, setPrecoDiario] = useState(0);
  const [valorTotal, setValorTotal] = useState("");
  const [status, setStatus] = useState("confirmada");
  const [ativa, setAtiva] = useState(true);
  const [quartosDisponiveis, setQuartosDisponiveis] = useState<SelectOption[]>(
    []
  );
  const [clientesDisponiveis, setClientesDisponiveis] = useState<
    SelectOption[]
  >([]);
  const [quartosData, setQuartosData] = useState<any[]>([]);
  const [clientesData, setClientesData] = useState<any[]>([]);
  const [loadingQuartos, setLoadingQuartos] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(false);

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

  // Formata a data automaticamente para DD/MM/AAAA
  const handleDateChange = (text: string, setter: (value: string) => void) => {
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

    setter(formatted);
  };

  // Calcula o valor total baseado nas datas e preço diário
  const calcularValorTotal = useCallback(() => {
    if (!dataCheckin || !dataCheckout || !precoDiario) {
      return;
    }

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dataCheckin) || !dateRegex.test(dataCheckout)) {
      return;
    }

    const [dayIn, monthIn, yearIn] = dataCheckin.split("/").map(Number);
    const [dayOut, monthOut, yearOut] = dataCheckout.split("/").map(Number);

    const checkin = new Date(yearIn, monthIn - 1, dayIn);
    const checkout = new Date(yearOut, monthOut - 1, dayOut);

    if (checkout > checkin) {
      const diferencaDias = Math.ceil(
        (checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24)
      );
      const total = diferencaDias * precoDiario;

      // Validação de overflow
      if (total > 999999.99) {
        showError("O valor total excede o limite máximo permitido.");
        return;
      }

      setValorTotal(total.toFixed(2).replace(".", ","));
    }
  }, [dataCheckin, dataCheckout, precoDiario, showError]);

  // Recalcula o valor quando as datas mudarem
  React.useEffect(() => {
    calcularValorTotal();
  }, [calcularValorTotal]);

  // Carrega quartos disponíveis do banco de dados
  const carregarQuartosDisponiveis = useCallback(async () => {
    try {
      setLoadingQuartos(true);
      const quartos = await listarQuartos();

      // Filtra apenas quartos com status "disponível" + inclui o quarto atual da reserva
      const quartosDisponiveisLista = quartos.filter(
        (q) => q.status?.toLowerCase() === "disponível" || q.id === quartoId
      );

      // Salva os dados completos dos quartos
      setQuartosData(quartosDisponiveisLista);

      // Mapeia para o formato do SelectOption
      const options: SelectOption[] = quartosDisponiveisLista.map((q) => ({
        label: `${t("reservations.room")} ${q.numero_quarto} - ${
          q.tipo
        } (R$ ${q.preco_diario?.toFixed(2).replace(".", ",")}/${t(
          "reservations.perDay"
        )})`,
        value: q.id || "",
      }));

      setQuartosDisponiveis(options);

      if (options.length === 0) {
        showError(t("validation.noAvailableRooms"));
      }
    } catch (error) {
      console.error("Erro ao carregar quartos:", error);
      showError(t("messages.loadRoomsError"));
    } finally {
      setLoadingQuartos(false);
    }
  }, [quartoId, showError]);

  // Carrega clientes registrados do banco de dados
  const carregarClientesDisponiveis = useCallback(async () => {
    try {
      setLoadingClientes(true);
      const clientes = await listarClientes();

      // Salva os dados completos dos clientes
      setClientesData(clientes);

      // Mapeia para o formato do SelectOption
      const options: SelectOption[] = clientes.map((c) => ({
        label: `${(c as any).nome_completo} - CPF: ${c.cpf?.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/,
          "$1.$2.$3-$4"
        )}`,
        value: c.id || "",
      }));

      setClientesDisponiveis(options);

      if (options.length === 0) {
        showError(t("validation.noClientsRegistered"));
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      showError(t("messages.loadClientsError"));
    } finally {
      setLoadingClientes(false);
    }
  }, [showError]);

  // Carrega os dados da reserva
  const loadReserva = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await buscarReservaPorId(id as string);

      if (!data) {
        showError(t("messages.noData"));
        return;
      }

      // Converte as datas de YYYY-MM-DD para DD/MM/YYYY
      // Usa Date com parsing local para evitar problema de timezone
      if (data.data_checkin) {
        const dateCheckin = new Date(data.data_checkin + "T00:00:00");
        const dia = String(dateCheckin.getDate()).padStart(2, "0");
        const mes = String(dateCheckin.getMonth() + 1).padStart(2, "0");
        const ano = dateCheckin.getFullYear();
        setDataCheckin(`${dia}/${mes}/${ano}`);
      }
      if (data.data_checkout) {
        const dateCheckout = new Date(data.data_checkout + "T00:00:00");
        const dia = String(dateCheckout.getDate()).padStart(2, "0");
        const mes = String(dateCheckout.getMonth() + 1).padStart(2, "0");
        const ano = dateCheckout.getFullYear();
        setDataCheckout(`${dia}/${mes}/${ano}`);
      }

      setClienteId(data.id_cliente || "");
      setQuartoId(data.id_quarto || "");

      // Define nomes legíveis para exibição
      if (data.clientes) {
        setClienteNome(
          data.clientes.nome_completo || "Cliente não identificado"
        );
      } else {
        setClienteNome("Cliente não encontrado");
      }

      if (data.quartos) {
        const quartoInfo = `Quarto ${data.quartos.numero_quarto} - ${data.quartos.tipo}`;
        setQuartoNumero(quartoInfo);
        setPrecoDiario(data.quartos.preco_diario || 0);
      } else {
        setQuartoNumero("Quarto não encontrado");
        setPrecoDiario(0);
      }

      setValorTotal(data.valor_total?.toFixed(2).replace(".", ",") || "");
      setStatus(data.status || "confirmada");

      // Define ativa baseado no status
      setAtiva(data.status !== "Cancelada" && data.status !== "cancelada");
    } catch (error) {
      console.error("Erro ao carregar reserva:", error);
      showError(t("messages.loadError"));
    } finally {
      setLoading(false);
    }
  }, [id, showError]);

  useFocusEffect(
    useCallback(() => {
      loadThemePreference();
      loadReserva();
      carregarQuartosDisponiveis();
      carregarClientesDisponiveis();
    }, [
      loadReserva,
      loadThemePreference,
      carregarQuartosDisponiveis,
      carregarClientesDisponiveis,
    ])
  );

  const handleSave = async () => {
    // Validações
    if (!dataCheckin.trim()) {
      showError(t("validation.required"));
      return;
    }

    if (!dataCheckout.trim()) {
      showError(t("validation.required"));
      return;
    }

    // Valida formato das datas
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dataCheckin)) {
      showError(t("validation.invalidCheckInDate"));
      return;
    }

    if (!dateRegex.test(dataCheckout)) {
      showError(t("validation.invalidCheckOutDate"));
      return;
    }

    // Valida se são datas válidas
    const [dayIn, monthIn, yearIn] = dataCheckin.split("/").map(Number);
    const dateIn = new Date(yearIn, monthIn - 1, dayIn);
    if (
      dateIn.getDate() !== dayIn ||
      dateIn.getMonth() !== monthIn - 1 ||
      dateIn.getFullYear() !== yearIn
    ) {
      showError(t("validation.invalidCheckInDate"));
      return;
    }

    const [dayOut, monthOut, yearOut] = dataCheckout.split("/").map(Number);
    const dateOut = new Date(yearOut, monthOut - 1, dayOut);
    if (
      dateOut.getDate() !== dayOut ||
      dateOut.getMonth() !== monthOut - 1 ||
      dateOut.getFullYear() !== yearOut
    ) {
      showError(t("validation.invalidCheckOutDate"));
      return;
    }

    // Valida se check-out é posterior ao check-in
    if (dateOut <= dateIn) {
      showError(t("validation.checkOutBeforeCheckIn"));
      return;
    }

    if (!valorTotal.trim()) {
      showError(t("validation.required"));
      return;
    }

    const valorNum = parseFloat(
      valorTotal.replace(/\./g, "").replace(",", ".")
    );
    if (valorNum <= 0) {
      showError(t("validation.required"));
      return;
    }

    try {
      setLoading(true);

      // Converte as datas de DD/MM/YYYY para YYYY-MM-DD
      const [diaIn, mesIn, anoIn] = dataCheckin.split("/");
      const dataCheckinFormatada = `${anoIn}-${mesIn}-${diaIn}`;
      const [diaOut, mesOut, anoOut] = dataCheckout.split("/");
      const dataCheckoutFormatada = `${anoOut}-${mesOut}-${diaOut}`;

      const reservaData = {
        data_checkin: dataCheckinFormatada,
        data_checkout: dataCheckoutFormatada,
        valor_total: parseFloat(
          valorTotal.replace(/\./g, "").replace(",", ".")
        ),
        status: ativa
          ? status === "Cancelada" || status === "cancelada"
            ? "Confirmada"
            : status
          : "Cancelada",
      };

      await atualizarReserva(id as string, reservaData);

      showSuccess(getSuccessMessage("update"));

      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar reserva:", error);
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
        entity={t("navigation.reservations")}
        action={t("common.editing")}
        onBackPress={() => router.push("/screens/Reserva/ListagemReserva")}
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
              name="create-outline"
              size={24}
              color={isDarkMode ? "#60A5FA" : "#0162B3"}
            />
            <Text style={[styles.title, { color: theme.text }]}>
              {t("reservations.editReservation")}
            </Text>
          </View>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t("reservations.fillDataNewReservation")}
          </Text>

          <Separator marginTop={16} marginBottom={24} />

          {/* Formulário */}
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("reservations.client")}{" "}
                <Text style={styles.required}>*</Text>
              </Text>
              <FormSelect
                icon="person-outline"
                placeholder={
                  loadingClientes
                    ? t("common.loading")
                    : t("reservations.selectClient")
                }
                value={clienteId}
                options={clientesDisponiveis}
                onSelect={setClienteId}
                disabled={loading || loadingClientes}
                helperText={t("reservations.registeredClientsCount", {
                  count: clientesDisponiveis.length,
                })}
                isDarkMode={isDarkMode}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("reservations.room")} <Text style={styles.required}>*</Text>
              </Text>
              <FormSelect
                icon="home-outline"
                placeholder={
                  loadingQuartos
                    ? t("common.loading")
                    : t("reservations.selectAvailableRoom")
                }
                value={quartoId}
                options={quartosDisponiveis}
                onSelect={(value) => {
                  setQuartoId(value);
                  // Atualiza preço diário quando o quarto muda
                  const quartoSelecionado = quartosData.find(
                    (q) => q.id === value
                  );
                  if (quartoSelecionado) {
                    setPrecoDiario(quartoSelecionado.preco_diario || 0);
                  }
                }}
                disabled={loading || loadingQuartos}
                helperText={t("reservations.availableRoomsCount", {
                  count: quartosDisponiveis.length,
                })}
                isDarkMode={isDarkMode}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("reservations.checkInDate")}{" "}
                <Text style={styles.required}>*</Text>
              </Text>
              <FormInput
                icon="calendar-outline"
                placeholder="DD/MM/AAAA"
                value={dataCheckin}
                onChangeText={(text) => handleDateChange(text, setDataCheckin)}
                editable={!loading}
                keyboardType="numeric"
                maxLength={10}
                helperText={t("reservations.checkInDate")}
                isDarkMode={isDarkMode}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("reservations.checkOutDate")}{" "}
                <Text style={styles.required}>*</Text>
              </Text>
              <FormInput
                icon="calendar-outline"
                placeholder="DD/MM/AAAA"
                value={dataCheckout}
                onChangeText={(text) => handleDateChange(text, setDataCheckout)}
                editable={!loading}
                keyboardType="numeric"
                maxLength={10}
                helperText={t("reservations.checkOutDate")}
                isDarkMode={isDarkMode}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t("reservations.totalValue")}{" "}
                <Text style={styles.required}>*</Text>
              </Text>
              <FormInput
                icon="cash-outline"
                placeholder="0,00"
                value={valorTotal}
                onChangeText={() => {}}
                editable={false}
                keyboardType="numeric"
                helperText={t("reservations.calculatedAutomatically")}
                isDarkMode={isDarkMode}
              />
            </View>

            {/* Status da Reserva */}
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
                  name={ativa ? "checkmark-circle" : "close-circle"}
                  size={24}
                  color={ativa ? "#10B981" : "#6B7280"}
                />
                <View style={styles.switchTextContainer}>
                  <Text style={[styles.switchTitle, { color: theme.text }]}>
                    {ativa
                      ? t("reservations.confirmedReservation")
                      : t("reservations.pendingReservation")}
                  </Text>
                  <Text
                    style={[
                      styles.switchDescription,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {ativa
                      ? t("reservations.clientConfirmed")
                      : t("reservations.awaitingConfirmation")}
                  </Text>
                </View>
              </View>
              <Switch
                value={ativa}
                onValueChange={setAtiva}
                trackColor={{ false: "#D1D5DB", true: "#10B981" }}
                thumbColor={ativa ? "#FFFFFF" : "#F3F4F6"}
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
              {loading ? t("profile.saving") : t("common.save")}
            </ActionButton>

            <ActionButton
              variant="secondary"
              icon="close-circle-outline"
              onPress={() => router.push("/screens/Reserva/ListagemReserva")}
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

export default EditarReserva;
