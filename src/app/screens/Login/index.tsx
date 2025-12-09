import { supabase } from "@/lib/supabase";
import { ActionButton } from "@/src/components/ActionButton";
import { FormInput } from "@/src/components/FormInput";
import { Separator } from "@/src/components/Separator";
import { useToast } from "@/src/components/ToastContext";
import "@/src/i18n";
import {
  getSuccessMessage,
  getValidationMessage,
  translateAuthError,
} from "@/src/utils/errorMessages";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AppState,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  async function signInWithEmail() {
    // Validações antes de enviar
    if (!email || !password) {
      showError(getValidationMessage(email ? "password" : "email", "required"));
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      showError(translateAuthError(error.message));
    } else {
      showSuccess(getSuccessMessage("login"));
      setTimeout(() => {
        router.replace("/screens/home");
      }, 3000);
    }

    setLoading(false);
  }

  const registerTransition = () => {
    router.navigate("/screens/register");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header com Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBorder}>
            <Image
              source={require("@/assets/images/hotel1.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.logoText}>Hostify</Text>
          <Text style={styles.subtitle}>{t("auth.login")}</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Card de Login */}
        <View style={styles.loginCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="log-in-outline" size={24} color="#0162B3" />
            <Text style={styles.cardTitle}>{t("auth.login")}</Text>
          </View>

          <Separator marginTop={16} marginBottom={20} />

          <View style={styles.inputGroup}>
            <FormInput
              icon="mail-outline"
              placeholder={`${t("auth.email")} *`}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />

            <FormInput
              icon="key-outline"
              placeholder={`${t("auth.password")} *`}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.actions}>
          <ActionButton
            variant="primary"
            icon="log-in-outline"
            onPress={signInWithEmail}
            disabled={loading}
          >
            {loading ? t("common.loading") : t("auth.login")}
          </ActionButton>

          <ActionButton
            variant="secondary"
            icon="person-add-outline"
            onPress={registerTransition}
            disabled={loading}
          >
            {t("auth.register")}
          </ActionButton>
        </View>

        <Separator marginTop={24} marginBottom={20} />

        {/* Link Esqueceu a Senha */}
        <View style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>
            {t("auth.forgotPassword")}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#132F3B",
  },
  header: {
    backgroundColor: "#132F3B",
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    gap: 8,
  },
  logoBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#0162B3",
  },
  logo: {
    width: 70,
    height: 70,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
    marginTop: 4,
  },
  content: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loginCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E293B",
  },
  inputGroup: {
    gap: 16,
  },
  forgotPasswordContainer: {
    alignItems: "center",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#0162B3",
    fontWeight: "600",
  },
  actions: {
    gap: 12,
    marginTop: 20,
  },
});

export default LoginScreen;
