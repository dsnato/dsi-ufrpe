import { supabase } from "@/lib/supabase";
import { ButtonSelector } from "@/src/components/ButtonSelector";
import { FormInput } from "@/src/components/FormInput";
import { InfoHeader } from "@/src/components/InfoHeader";
import { RiskCard } from "@/src/components/RiskCard";
import { Separator } from "@/src/components/Separator";
import { useToast } from "@/src/components/ToastContext";
import "@/src/i18n";
import {
  getRiskProfileInfo,
  predictCancellationRisk,
  type PredictionResult,
} from "@/src/services/bookingPredictor";
import { convertUserInputToFeatures } from "@/src/utils/bookingFeatureMapping";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PredicaoScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const { showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
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

  useFocusEffect(
    useCallback(() => {
      loadThemePreference();
    }, [loadThemePreference])
  );

  const [formData, setFormData] = useState({
    hotel: "",
    lead_time: "",
    adr: "",
    previous_cancellations: "",
    deposit_type: "",
    total_of_special_requests: "",
    is_repeated_guest: "",
    market_segment: "",
    adults: "",
    children: "",
    stays_in_weekend_nights: "",
    stays_in_week_nights: "",
  });

  // Funções de formatação
  const formatLeadTime = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers ? `${numbers} dias` : "";
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    const amount = parseFloat(numbers) / 100;
    return `R$ ${amount.toFixed(2).replace(".", ",")}`;
  };

  const parseLeadTime = (formatted: string): string => {
    return formatted.replace(/\D/g, "");
  };

  const parseCurrency = (formatted: string): string => {
    const numbers = formatted.replace(/\D/g, "");
    if (!numbers) return "";
    return (parseFloat(numbers) / 100).toFixed(2);
  };

  const handlePredict = async () => {
    const leadTimeValue = parseLeadTime(formData.lead_time);
    const adrValue = parseCurrency(formData.adr);

    if (
      !formData.hotel ||
      !leadTimeValue ||
      !adrValue ||
      !formData.deposit_type ||
      !formData.market_segment
    ) {
      showError(t("validation.fillRequiredFields"));
      return;
    }

    setLoading(true);
    try {
      const numericFeatures = convertUserInputToFeatures({
        hotel: formData.hotel,
        lead_time: parseInt(leadTimeValue),
        adr: parseFloat(adrValue),
        previous_cancellations: parseInt(
          formData.previous_cancellations || "0"
        ),
        deposit_type: formData.deposit_type,
        total_of_special_requests: parseInt(
          formData.total_of_special_requests || "0"
        ),
        is_repeated_guest: parseInt(formData.is_repeated_guest || "0"),
        market_segment: formData.market_segment,
        adults: parseInt(formData.adults),
        children: parseInt(formData.children),
        babies: 0,
        stays_in_weekend_nights: parseInt(formData.stays_in_weekend_nights),
        stays_in_week_nights: parseInt(formData.stays_in_week_nights),
        arrival_date_month: "January",
        distribution_channel: "TA/TO",
        reserved_room_type: "A",
        assigned_room_type: "A",
        booking_changes: 0,
      });

      numericFeatures.total_guests =
        numericFeatures.adults + numericFeatures.children;
      numericFeatures.total_nights =
        numericFeatures.stays_in_weekend_nights +
        numericFeatures.stays_in_week_nights;
      numericFeatures.has_special_request =
        numericFeatures.total_of_special_requests > 0 ? 1 : 0;
      numericFeatures.is_family =
        numericFeatures.adults > 0 && numericFeatures.children > 0 ? 1 : 0;

      const result = predictCancellationRisk(numericFeatures);
      setPredictionResult(result);
      setShowResults(true);

      // Scroll para o topo após mostrar resultados
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);
    } catch (error) {
      console.error("Erro:", error);
      showError(t("validation.predictionError"));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setPredictionResult(null);
    setFormData({
      hotel: "",
      lead_time: "",
      adr: "",
      previous_cancellations: "",
      deposit_type: "",
      total_of_special_requests: "",
      is_repeated_guest: "",
      market_segment: "",
      adults: "2",
      children: "0",
      stays_in_weekend_nights: "0",
      stays_in_week_nights: "3",
    });
  };

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
        entity="Predição de Cancelamento"
        action={showResults ? t("prediction.result") : t("prediction.analysis")}
        onBackPress={() => router.push("/screens/home")}
      />

      <View style={[styles.content, { backgroundColor: theme.content }]}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!showResults ? (
            <View>
              {/* Título da seção */}
              <View style={styles.titleContainer}>
                <Ionicons
                  name="analytics-outline"
                  size={24}
                  color={theme.icon}
                />
                <Text style={[styles.title, { color: theme.text }]}>
                  {t("prediction.riskAnalysis")}
                </Text>
              </View>

              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {t("prediction.fillDataToPredict")}
              </Text>

              <Separator marginTop={16} marginBottom={24} />

              {/* Seção 1: Tipo de Hotel */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t("prediction.hotelInfo")}
                </Text>
                <ButtonSelector
                  isDarkMode={isDarkMode}
                  label={t("prediction.hotelType")}
                  helperText={t("prediction.selectEstablishmentType")}
                  value={formData.hotel}
                  options={[
                    {
                      label: t("prediction.resort"),
                      value: "Resort Hotel",
                      icon: "business",
                    },
                    {
                      label: t("prediction.cityHotel"),
                      value: "City Hotel",
                      icon: "business-outline",
                    },
                  ]}
                  onSelect={(value) =>
                    setFormData({ ...formData, hotel: value })
                  }
                />
              </View>

              <Separator marginTop={8} marginBottom={8} />

              {/* Seção 2: Dados da Reserva */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t("prediction.reservationData")}
                </Text>

                <View style={styles.fieldContainer}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>
                    {t("prediction.leadTime")}
                  </Text>
                  <Text
                    style={[styles.fieldHelper, { color: theme.textSecondary }]}
                  >
                    {t("prediction.leadTimeHelper")}
                  </Text>
                  <FormInput
                    icon="calendar"
                    placeholder={t("prediction.leadTimePlaceholder")}
                    value={formData.lead_time.replace(" dias", "")}
                    onChangeText={(value) => {
                      const numbers = value.replace(/\D/g, "");
                      setFormData({
                        ...formData,
                        lead_time: numbers ? `${numbers} dias` : "",
                      });
                    }}
                    keyboardType="numeric"
                    isDarkMode={isDarkMode}
                  />
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>
                    {t("prediction.averageDailyRate")}
                  </Text>
                  <Text
                    style={[styles.fieldHelper, { color: theme.textSecondary }]}
                  >
                    {t("prediction.averageDailyRateHelper")}
                  </Text>
                  <FormInput
                    icon="cash"
                    placeholder={t("prediction.averageDailyRatePlaceholder")}
                    value={formData.adr}
                    onChangeText={(value) => {
                      const numbers = value.replace(/\D/g, "");
                      setFormData({
                        ...formData,
                        adr: formatCurrency(numbers),
                      });
                    }}
                    keyboardType="numeric"
                    isDarkMode={isDarkMode}
                  />
                </View>
              </View>

              <Separator marginTop={8} marginBottom={8} />

              {/* Seção 3: Tipo de Depósito */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t("prediction.payment")}
                </Text>
                <ButtonSelector
                  isDarkMode={isDarkMode}
                  label={t("prediction.depositType")}
                  helperText={t("prediction.depositTypeHelper")}
                  value={formData.deposit_type}
                  options={[
                    {
                      label: t("prediction.noDeposit"),
                      value: "No Deposit",
                      icon: "close-circle",
                    },
                    {
                      label: t("prediction.refundable"),
                      value: "Refundable",
                      icon: "checkmark-circle",
                    },
                    {
                      label: t("prediction.nonRefundable"),
                      value: "Non Refund",
                      icon: "lock-closed",
                    },
                  ]}
                  onSelect={(value) =>
                    setFormData({ ...formData, deposit_type: value })
                  }
                />
              </View>

              <Separator marginTop={8} marginBottom={8} />

              {/* Seção 4: Segmento de Mercado */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t("prediction.salesChannel")}
                </Text>
                <ButtonSelector
                  isDarkMode={isDarkMode}
                  label={t("prediction.marketSegment")}
                  helperText={t("prediction.marketSegmentHelper")}
                  value={formData.market_segment}
                  options={[
                    {
                      label: t("prediction.online"),
                      value: "Online TA",
                      icon: "globe",
                    },
                    {
                      label: t("prediction.agency"),
                      value: "Offline TA/TO",
                      icon: "briefcase",
                    },
                    {
                      label: t("prediction.direct"),
                      value: "Direct",
                      icon: "call",
                    },
                    {
                      label: t("prediction.corporate"),
                      value: "Corporate",
                      icon: "business",
                    },
                    {
                      label: t("prediction.groups"),
                      value: "Groups",
                      icon: "people",
                    },
                  ]}
                  onSelect={(value) =>
                    setFormData({ ...formData, market_segment: value })
                  }
                />
              </View>

              <Separator marginTop={8} marginBottom={8} />

              {/* Seção 5: Histórico do Cliente */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t("prediction.clientProfile")}
                </Text>

                <ButtonSelector
                  isDarkMode={isDarkMode}
                  label={t("prediction.repeatedGuest")}
                  helperText={t("prediction.repeatedGuestHelper")}
                  value={formData.is_repeated_guest}
                  options={[
                    { label: t("common.no"), value: "0", icon: "close" },
                    { label: t("common.yes"), value: "1", icon: "checkmark" },
                  ]}
                  onSelect={(value) =>
                    setFormData({ ...formData, is_repeated_guest: value })
                  }
                />

                <View style={styles.fieldContainer}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>
                    {t("prediction.previousCancellations")}
                  </Text>
                  <Text
                    style={[styles.fieldHelper, { color: theme.textSecondary }]}
                  >
                    {t("prediction.previousCancellationsHelper")}
                  </Text>
                  <FormInput
                    icon="close-circle"
                    placeholder={t(
                      "prediction.previousCancellationsPlaceholder"
                    )}
                    value={formData.previous_cancellations}
                    onChangeText={(value) =>
                      setFormData({
                        ...formData,
                        previous_cancellations: value,
                      })
                    }
                    keyboardType="numeric"
                    isDarkMode={isDarkMode}
                  />
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>
                    {t("prediction.specialRequests")}
                  </Text>
                  <Text
                    style={[styles.fieldHelper, { color: theme.textSecondary }]}
                  >
                    {t("prediction.specialRequestsHelper")}
                  </Text>
                  <FormInput
                    icon="star"
                    placeholder={t("prediction.specialRequestsPlaceholder")}
                    value={formData.total_of_special_requests}
                    onChangeText={(value) =>
                      setFormData({
                        ...formData,
                        total_of_special_requests: value,
                      })
                    }
                    keyboardType="numeric"
                    isDarkMode={isDarkMode}
                  />
                </View>
              </View>

              <Separator marginTop={8} marginBottom={8} />

              {/* Seção 6: Composição da Reserva */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t("prediction.guestsAndStay")}
                </Text>

                <View style={styles.fieldContainer}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>
                    {t("prediction.adults")}
                  </Text>
                  <Text
                    style={[styles.fieldHelper, { color: theme.textSecondary }]}
                  >
                    {t("prediction.adultsHelper")}
                  </Text>
                  <FormInput
                    icon="people"
                    placeholder={t("prediction.adultsPlaceholder")}
                    value={formData.adults}
                    onChangeText={(value) =>
                      setFormData({ ...formData, adults: value })
                    }
                    keyboardType="numeric"
                    isDarkMode={isDarkMode}
                  />
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>
                    {t("prediction.children")}
                  </Text>
                  <Text
                    style={[styles.fieldHelper, { color: theme.textSecondary }]}
                  >
                    {t("prediction.childrenHelper")}
                  </Text>
                  <FormInput
                    icon="person"
                    placeholder={t("prediction.childrenPlaceholder")}
                    value={formData.children}
                    onChangeText={(value) =>
                      setFormData({ ...formData, children: value })
                    }
                    keyboardType="numeric"
                    isDarkMode={isDarkMode}
                  />
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>
                    {t("prediction.weekendNights")}
                  </Text>
                  <Text
                    style={[styles.fieldHelper, { color: theme.textSecondary }]}
                  >
                    {t("prediction.weekendNightsHelper")}
                  </Text>
                  <FormInput
                    icon="moon"
                    placeholder={t("prediction.weekendNightsPlaceholder")}
                    value={formData.stays_in_weekend_nights}
                    onChangeText={(value) =>
                      setFormData({
                        ...formData,
                        stays_in_weekend_nights: value,
                      })
                    }
                    keyboardType="numeric"
                    isDarkMode={isDarkMode}
                  />
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>
                    {t("prediction.weekNights")}
                  </Text>
                  <Text
                    style={[styles.fieldHelper, { color: theme.textSecondary }]}
                  >
                    {t("prediction.weekNightsHelper")}
                  </Text>
                  <FormInput
                    icon="sunny"
                    placeholder={t("prediction.weekNightsPlaceholder")}
                    value={formData.stays_in_week_nights}
                    onChangeText={(value) =>
                      setFormData({ ...formData, stays_in_week_nights: value })
                    }
                    keyboardType="numeric"
                    isDarkMode={isDarkMode}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.predictButton,
                    { backgroundColor: theme.icon },
                    loading && styles.predictButtonDisabled,
                  ]}
                  onPress={handlePredict}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons
                        name="analytics-outline"
                        size={24}
                        color="#FFFFFF"
                      />
                      <Text style={styles.predictButtonText}>
                        {t("prediction.analyzeRisk")}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.resultsContainer}>
              {predictionResult &&
                (() => {
                  const profileInfo = getRiskProfileInfo(
                    predictionResult.riskLevel
                  );
                  if (!profileInfo) return null;

                  return (
                    <>
                      {/* Card Principal de Risco - Expandido */}
                      <View
                        style={[
                          styles.mainRiskCard,
                          {
                            backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                            shadowColor: isDarkMode ? "#000000" : "#000",
                          },
                        ]}
                      >
                        <RiskCard
                          riskLevel={predictionResult.riskLevel}
                          probability={predictionResult.probability}
                          confidence={predictionResult.confidence}
                          color={profileInfo.color}
                          icon={profileInfo.icon}
                          name={profileInfo.name}
                          isDarkMode={isDarkMode}
                        />

                        {/* Estatísticas da Simulação */}
                        {predictionResult.statistics && (
                          <View style={styles.statsGrid}>
                            <View
                              style={[
                                styles.statBox,
                                {
                                  backgroundColor: isDarkMode
                                    ? "#0F172A"
                                    : "#F8FAFC",
                                },
                              ]}
                            >
                              <Ionicons
                                name="bar-chart"
                                size={24}
                                color={theme.icon}
                              />
                              <Text
                                style={[
                                  styles.statValue,
                                  { color: theme.text },
                                ]}
                              >
                                {predictionResult.statistics.totalFeatures}
                              </Text>
                              <Text
                                style={[
                                  styles.statLabel,
                                  { color: theme.textSecondary },
                                ]}
                              >
                                {t("prediction.featuresAnalyzed")}
                              </Text>
                            </View>
                            <View
                              style={[
                                styles.statBox,
                                {
                                  backgroundColor: isDarkMode
                                    ? "#0F172A"
                                    : "#F8FAFC",
                                },
                              ]}
                            >
                              <Ionicons
                                name="alert-circle"
                                size={24}
                                color="#F59E0B"
                              />
                              <Text
                                style={[
                                  styles.statValue,
                                  { color: theme.text },
                                ]}
                              >
                                {predictionResult.statistics.criticalFactors}
                              </Text>
                              <Text
                                style={[
                                  styles.statLabel,
                                  { color: theme.textSecondary },
                                ]}
                              >
                                {t("prediction.criticalFactors")}
                              </Text>
                            </View>
                            <View
                              style={[
                                styles.statBox,
                                {
                                  backgroundColor: isDarkMode
                                    ? "#0F172A"
                                    : "#F8FAFC",
                                },
                              ]}
                            >
                              <Ionicons
                                name="speedometer"
                                size={24}
                                color="#10B981"
                              />
                              <Text
                                style={[
                                  styles.statValue,
                                  { color: theme.text },
                                ]}
                              >
                                {predictionResult.statistics.adjustmentApplied >
                                0
                                  ? "+"
                                  : ""}
                                {predictionResult.statistics.adjustmentApplied}%
                              </Text>
                              <Text
                                style={[
                                  styles.statLabel,
                                  { color: theme.textSecondary },
                                ]}
                              >
                                {t("prediction.adjustmentApplied")}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>

                      {/* Similaridade com Perfis */}
                      {predictionResult.profileDistances && (
                        <View
                          style={[
                            styles.similarityCard,
                            {
                              backgroundColor: isDarkMode
                                ? "#1E293B"
                                : "#FFFFFF",
                              shadowColor: isDarkMode ? "#000000" : "#000",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.similarityTitle,
                              { color: theme.text },
                            ]}
                          >
                            {t("prediction.similarityWithProfiles")}
                          </Text>
                          <Text
                            style={[
                              styles.similaritySubtitle,
                              { color: theme.textSecondary },
                            ]}
                          >
                            {t("prediction.normalizedEuclideanDistance")}
                          </Text>
                          {predictionResult.profileDistances.map(
                            (dist, idx) => {
                              const profileNames: Record<string, string> = {
                                low_risk: t("prediction.lowRisk"),
                                medium_risk: t("prediction.mediumRisk"),
                                high_risk: t("prediction.highRisk"),
                              };
                              const colors: Record<string, string> = {
                                low_risk: "#10B981",
                                medium_risk: "#F59E0B",
                                high_risk: "#EF4444",
                              };
                              return (
                                <View key={idx} style={styles.similarityBar}>
                                  <View style={styles.similarityBarHeader}>
                                    <Text
                                      style={[
                                        styles.similarityBarLabel,
                                        { color: theme.text },
                                      ]}
                                    >
                                      {profileNames[dist.profile]}
                                    </Text>
                                    <Text
                                      style={[
                                        styles.similarityBarValue,
                                        { color: colors[dist.profile] },
                                      ]}
                                    >
                                      {dist.similarity.toFixed(1)}%
                                    </Text>
                                  </View>
                                  <View
                                    style={[
                                      styles.progressBarContainer,
                                      {
                                        backgroundColor: isDarkMode
                                          ? "#334155"
                                          : "#E2E8F0",
                                      },
                                    ]}
                                  >
                                    <View
                                      style={[
                                        styles.progressBarFill,
                                        {
                                          width: `${dist.similarity}%`,
                                          backgroundColor: colors[dist.profile],
                                        },
                                      ]}
                                    />
                                  </View>
                                </View>
                              );
                            }
                          )}
                          <View
                            style={[
                              styles.explainerBox,
                              {
                                backgroundColor: isDarkMode
                                  ? "#0F172A"
                                  : "#F1F5F9",
                              },
                            ]}
                          >
                            <Ionicons
                              name="information-circle"
                              size={18}
                              color={theme.textSecondary}
                            />
                            <Text
                              style={[
                                styles.explainerText,
                                { color: theme.textSecondary },
                              ]}
                            >
                              {t("prediction.similarityDescription")}
                            </Text>
                          </View>
                        </View>
                      )}

                      <View
                        style={[
                          styles.recommendationCard,
                          {
                            backgroundColor: isDarkMode ? "#451A03" : "#FEF3C7",
                            borderLeftColor: "#F59E0B",
                          },
                        ]}
                      >
                        <View style={styles.recommendationHeader}>
                          <Ionicons name="bulb" size={28} color="#F59E0B" />
                          <Text
                            style={[
                              styles.recommendationTitle,
                              { color: isDarkMode ? "#FDE047" : "#92400E" },
                            ]}
                          >
                            {t("prediction.strategicRecommendations")}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.recommendationText,
                            { color: isDarkMode ? "#FEF3C7" : "#78350F" },
                          ]}
                        >
                          {predictionResult.recommendation}
                        </Text>
                      </View>

                      {predictionResult.factors.length > 0 && (
                        <View style={styles.factorsSection}>
                          <Text
                            style={[styles.factorsTitle, { color: theme.text }]}
                          >
                            {t("prediction.identifiedCriticalFactors")}
                          </Text>
                          <Text
                            style={[
                              styles.factorsSubtitle,
                              { color: theme.textSecondary },
                            ]}
                          >
                            {t("prediction.factorsInfluence")}
                          </Text>
                          {predictionResult.factors.map((factor, index) => (
                            <View
                              key={index}
                              style={[
                                styles.factorCard,
                                {
                                  backgroundColor: isDarkMode
                                    ? "#1E293B"
                                    : "#FFFFFF",
                                  borderLeftColor:
                                    factor.impact === "positive"
                                      ? "#10B981"
                                      : "#EF4444",
                                  shadowColor: isDarkMode ? "#000000" : "#000",
                                },
                              ]}
                            >
                              <View style={styles.factorHeader}>
                                <View
                                  style={[
                                    styles.factorIconContainer,
                                    {
                                      backgroundColor:
                                        factor.impact === "positive"
                                          ? "#D1FAE5"
                                          : "#FEE2E2",
                                    },
                                  ]}
                                >
                                  <Ionicons
                                    name={
                                      factor.impact === "positive"
                                        ? "checkmark-circle"
                                        : "close-circle"
                                    }
                                    size={24}
                                    color={
                                      factor.impact === "positive"
                                        ? "#10B981"
                                        : "#EF4444"
                                    }
                                  />
                                </View>
                                <View style={styles.factorContent}>
                                  <Text
                                    style={[
                                      styles.factorDescription,
                                      { color: theme.text },
                                    ]}
                                  >
                                    {factor.description}
                                  </Text>
                                  <View style={styles.factorMeta}>
                                    <View
                                      style={[
                                        styles.importanceBar,
                                        {
                                          backgroundColor: isDarkMode
                                            ? "#334155"
                                            : "#E2E8F0",
                                        },
                                      ]}
                                    >
                                      <View
                                        style={[
                                          styles.importanceBarFill,
                                          {
                                            width: `${
                                              factor.importance * 100
                                            }%`,
                                            backgroundColor: theme.icon,
                                          },
                                        ]}
                                      />
                                    </View>
                                    <Text
                                      style={[
                                        styles.importanceText,
                                        { color: theme.textSecondary },
                                      ]}
                                    >
                                      {(factor.importance * 100).toFixed(0)}%
                                      importância
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}

                      <TouchableOpacity
                        style={[
                          styles.newAnalysisButton,
                          {
                            backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                            borderColor: theme.icon,
                          },
                        ]}
                        onPress={handleReset}
                      >
                        <Ionicons
                          name="add-circle-outline"
                          size={24}
                          color={theme.icon}
                        />
                        <Text
                          style={[
                            styles.newAnalysisButtonText,
                            { color: theme.icon },
                          ]}
                        >
                          {t("prediction.newAnalysis")}
                        </Text>
                      </TouchableOpacity>
                    </>
                  );
                })()}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  fieldHelper: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
  },
  halfInput: {
    flex: 1,
  },
  predictButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  predictButtonDisabled: {
    opacity: 0.6,
  },
  predictButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  resultsContainer: {
    padding: 16,
    gap: 20,
    paddingBottom: 32,
  },
  mainRiskCard: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 11,
    textAlign: "center",
  },
  similarityCard: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  similarityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  similaritySubtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  similarityBar: {
    marginBottom: 16,
  },
  similarityBarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  similarityBarLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  similarityBarValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  progressBarContainer: {
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  explainerBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  explainerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  recommendationCard: {
    padding: 20,
    minHeight: 120,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  recommendationText: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
  factorsSection: {
    gap: 12,
  },
  factorsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  factorsSubtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  factorCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  factorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  factorIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  factorContent: {
    flex: 1,
  },
  factorDescription: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  factorMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  importanceBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  importanceBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  importanceText: {
    fontSize: 12,
    fontWeight: "500",
  },
  newAnalysisButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    marginTop: 8,
  },
  newAnalysisButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
