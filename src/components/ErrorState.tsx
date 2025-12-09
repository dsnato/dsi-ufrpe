import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  isDarkMode?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  onGoBack,
  isDarkMode = false,
}) => {
  const { t } = useTranslation();
  const colors = isDarkMode
    ? {
        background: "#0B1624",
        title: "#F1F5F9",
        message: "#94A3B8",
        icon: "#EF4444",
        primaryButton: "#3B82F6",
        primaryText: "#FFFFFF",
        secondaryButton: "transparent",
        secondaryBorder: "#60A5FA",
        secondaryText: "#60A5FA",
      }
    : {
        background: "#FFFFFF",
        title: "#1E293B",
        message: "#64748B",
        icon: "#EF4444",
        primaryButton: "#0162B3",
        primaryText: "#FFFFFF",
        secondaryButton: "transparent",
        secondaryBorder: "#0162B3",
        secondaryText: "#0162B3",
      };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Ionicons name="alert-circle-outline" size={64} color={colors.icon} />
      <Text style={[styles.title, { color: colors.title }]}>
        {t("common.oops")}
      </Text>
      <Text style={[styles.message, { color: colors.message }]}>{message}</Text>

      <View style={styles.buttonContainer}>
        {onRetry && (
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: colors.primaryButton },
            ]}
            onPress={onRetry}
          >
            <Ionicons
              name="refresh-outline"
              size={20}
              color={colors.primaryText}
            />
            <Text
              style={[styles.retryButtonText, { color: colors.primaryText }]}
            >
              {t("common.tryAgain")}
            </Text>
          </TouchableOpacity>
        )}

        {onGoBack && (
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                backgroundColor: colors.secondaryButton,
                borderColor: colors.secondaryBorder,
              },
            ]}
            onPress={onGoBack}
          >
            <Ionicons
              name="arrow-back-outline"
              size={20}
              color={colors.secondaryText}
            />
            <Text
              style={[styles.backButtonText, { color: colors.secondaryText }]}
            >
              {t("common.back")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
