import "@/src/i18n";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onGallery: () => void;
  onCamera: () => void;
  isDarkMode?: boolean;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  visible,
  onClose,
  onGallery,
  onCamera,
  isDarkMode = false,
}) => {
  const { t } = useTranslation();
  const colors = isDarkMode
    ? {
        modalBg: "#1A2942",
        title: "#F1F5F9",
        subtitle: "#94A3B8",
        iconBg: "#1E3A8A",
        iconColor: "#60A5FA",
        optionTitle: "#E2E8F0",
        optionDescription: "#94A3B8",
        divider: "#334155",
        chevron: "#64748B",
        cancelBg: "#0F172A",
        cancelBorder: "#334155",
        cancelText: "#94A3B8",
      }
    : {
        modalBg: "#FFFFFF",
        title: "#132F3B",
        subtitle: "#64748B",
        iconBg: "#EFF6FF",
        iconColor: "#0162B3",
        optionTitle: "#132F3B",
        optionDescription: "#64748B",
        divider: "#E2E8F0",
        chevron: "#94A3B8",
        cancelBg: "#F8FAFC",
        cancelBorder: "#E2E8F0",
        cancelText: "#64748B",
      };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.modalContent, { backgroundColor: colors.modalBg }]}
          >
            <View style={styles.header}>
              <Ionicons name="images" size={32} color={colors.iconColor} />
              <Text style={[styles.title, { color: colors.title }]}>
                {t("imagePicker.selectImage")}
              </Text>
              <Text style={[styles.subtitle, { color: colors.subtitle }]}>
                {t("imagePicker.selectImageDescription")}
              </Text>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  onClose();
                  onGallery();
                }}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.iconBg },
                  ]}
                >
                  <Ionicons
                    name="images-outline"
                    size={28}
                    color={colors.iconColor}
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[styles.optionTitle, { color: colors.optionTitle }]}
                  >
                    {t("imagePicker.gallery")}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      { color: colors.optionDescription },
                    ]}
                  >
                    {t("imagePicker.galleryDescription")}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.chevron}
                />
              </TouchableOpacity>

              <View
                style={[styles.divider, { backgroundColor: colors.divider }]}
              />

              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  onClose();
                  onCamera();
                }}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.iconBg },
                  ]}
                >
                  <Ionicons
                    name="camera-outline"
                    size={28}
                    color={colors.iconColor}
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[styles.optionTitle, { color: colors.optionTitle }]}
                  >
                    {t("imagePicker.camera")}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      { color: colors.optionDescription },
                    ]}
                  >
                    {t("imagePicker.cameraDescription")}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.chevron}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  backgroundColor: colors.cancelBg,
                  borderColor: colors.cancelBorder,
                },
              ]}
              onPress={onClose}
            >
              <Text
                style={[styles.cancelButtonText, { color: colors.cancelText }]}
              >
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

interface RemoveImageModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDarkMode?: boolean;
}

export const RemoveImageModal: React.FC<RemoveImageModalProps> = ({
  visible,
  onClose,
  onConfirm,
  isDarkMode = false,
}) => {
  const { t } = useTranslation();
  const colors = isDarkMode
    ? {
        modalBg: "#1A2942",
        title: "#F1F5F9",
        subtitle: "#94A3B8",
        iconBg: "#7F1D1D",
        iconColor: "#FCA5A5",
        secondaryBg: "#0F172A",
        secondaryBorder: "#334155",
        secondaryText: "#94A3B8",
        dangerBg: "#DC2626",
      }
    : {
        modalBg: "#FFFFFF",
        title: "#132F3B",
        subtitle: "#64748B",
        iconBg: "#FEE2E2",
        iconColor: "#DC2626",
        secondaryBg: "#F8FAFC",
        secondaryBorder: "#E2E8F0",
        secondaryText: "#64748B",
        dangerBg: "#DC2626",
      };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.modalContent, { backgroundColor: colors.modalBg }]}
          >
            <View style={styles.header}>
              <View
                style={[
                  styles.warningIconContainer,
                  { backgroundColor: colors.iconBg },
                ]}
              >
                <Ionicons name="warning" size={32} color={colors.iconColor} />
              </View>
              <Text style={[styles.title, { color: colors.title }]}>
                {t("imagePicker.removeImage")}
              </Text>
              <Text style={[styles.subtitle, { color: colors.subtitle }]}>
                {t("imagePicker.removeImageDescription")}
              </Text>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.secondaryButton,
                  {
                    backgroundColor: colors.secondaryBg,
                    borderColor: colors.secondaryBorder,
                  },
                ]}
                onPress={onClose}
              >
                <Text
                  style={[
                    styles.secondaryButtonText,
                    { color: colors.secondaryText },
                  ]}
                >
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.dangerBg },
                ]}
                onPress={() => {
                  onClose();
                  onConfirm();
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#FFF" />
                <Text style={styles.dangerButtonText}>
                  {t("imagePicker.remove")}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDarkMode?: boolean;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onClose,
  onConfirm,
  isDarkMode = false,
}) => {
  const { t } = useTranslation();
  const colors = isDarkMode
    ? {
        modalBg: "#1A2942",
        title: "#F1F5F9",
        subtitle: "#94A3B8",
        iconBg: "#422006",
        iconColor: "#FBBF24",
        secondaryBg: "#0F172A",
        secondaryBorder: "#334155",
        secondaryText: "#94A3B8",
        confirmBg: "#B45309",
      }
    : {
        modalBg: "#FFFFFF",
        title: "#132F3B",
        subtitle: "#64748B",
        iconBg: "#FEF3C7",
        iconColor: "#F59E0B",
        secondaryBg: "#F8FAFC",
        secondaryBorder: "#E2E8F0",
        secondaryText: "#64748B",
        confirmBg: "#F59E0B",
      };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.modalContent, { backgroundColor: colors.modalBg }]}
          >
            <View style={styles.header}>
              <View
                style={[
                  styles.warningIconContainer,
                  { backgroundColor: colors.iconBg },
                ]}
              >
                <Ionicons
                  name="log-out-outline"
                  size={32}
                  color={colors.iconColor}
                />
              </View>
              <Text style={[styles.title, { color: colors.title }]}>
                {t("auth.logout")}
              </Text>
              <Text style={[styles.subtitle, { color: colors.subtitle }]}>
                {t("messages.confirmLogout")}
              </Text>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.secondaryButton,
                  {
                    backgroundColor: colors.secondaryBg,
                    borderColor: colors.secondaryBorder,
                  },
                ]}
                onPress={onClose}
              >
                <Text
                  style={[
                    styles.secondaryButtonText,
                    { color: colors.secondaryText },
                  ]}
                >
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.confirmBg },
                ]}
                onPress={() => {
                  onClose();
                  onConfirm();
                }}
              >
                <Ionicons name="log-out-outline" size={18} color="#FFF" />
                <Text style={styles.dangerButtonText}>{t("common.exit")}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  warningIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#132F3B",
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#132F3B",
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
    color: "#64748B",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 12,
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  secondaryButton: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
  },
  dangerButton: {
    backgroundColor: "#DC2626",
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});
