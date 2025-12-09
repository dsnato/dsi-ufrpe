import { Ionicons } from "@expo/vector-icons";
import * as ImagePickerExpo from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ImagePickerModal, RemoveImageModal } from "./ImagePickerModal";
import { useToast } from "./ToastContext";

type ImagePickerTone = "light" | "dark";

interface ImagePickerProps {
  imageUri?: string | null;
  onImageSelected: (uri: string) => void;
  onImageRemoved?: () => void;
  disabled?: boolean;
  tone?: ImagePickerTone;
  aspect?: [number, number];
}

const appearanceTokens: Record<
  ImagePickerTone,
  {
    container: string;
    placeholderBackground: string;
    placeholderBorder: string;
    icon: string;
    text: string;
    subtext: string;
    actionStrip: string;
    primary: string;
  }
> = {
  light: {
    container: "#F1F5F9",
    placeholderBackground: "#F8FAFC",
    placeholderBorder: "#E2E8F0",
    icon: "#94A3B8",
    text: "#475569",
    subtext: "#94A3B8",
    actionStrip: "rgba(0, 0, 0, 0.05)",
    primary: "#0162B3",
  },
  dark: {
    container: "#192338",
    placeholderBackground: "rgba(15, 23, 42, 0.7)",
    placeholderBorder: "#1E3A8A",
    icon: "#7DD3FC",
    text: "#E2E8F0",
    subtext: "#94A3B8",
    actionStrip: "rgba(8, 21, 38, 0.8)",
    primary: "#3B82F6",
  },
};

export const ImagePicker: React.FC<ImagePickerProps> = ({
  imageUri,
  onImageSelected,
  onImageRemoved,
  disabled = false,
  tone = "light",
  aspect = [16, 9],
}) => {
  const [loading, setLoading] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const { showError } = useToast();

  const palette = appearanceTokens[tone];

  console.log("🖼️ ImagePicker renderizado:", {
    imageUri,
    disabled,
    platform: Platform.OS,
  });

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePickerExpo.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showError("Precisamos de permissão para acessar suas fotos.");
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      setLoading(true);

      const result = await ImagePickerExpo.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: aspect,
        quality: 0.8,
      });

      console.log("📸 [ImagePicker] Resultado da seleção:", result);

      if (!result.canceled && result.assets[0]) {
        const selectedUri = result.assets[0].uri;
        console.log("✅ [ImagePicker] Imagem selecionada:", selectedUri);
        console.log(
          "✅ [ImagePicker] Chamando onImageSelected com:",
          selectedUri
        );
        onImageSelected(selectedUri);
      } else {
        console.log("⚠️ [ImagePicker] Seleção cancelada ou sem assets");
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      showError("Não foi possível selecionar a imagem.");
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePickerExpo.requestCameraPermissionsAsync();
      if (status !== "granted") {
        showError("Precisamos de permissão para acessar sua câmera.");
        return;
      }

      setLoading(true);

      const result = await ImagePickerExpo.launchCameraAsync({
        allowsEditing: true,
        aspect: aspect,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao tirar foto:", error);
      showError("Não foi possível tirar a foto.");
    } finally {
      setLoading(false);
    }
  };

  const showImageOptions = () => {
    if (Platform.OS === "web") {
      pickImage();
      return;
    }

    setShowPickerModal(true);
  };

  const handleRemoveImage = () => {
    if (Platform.OS === "web") {
      if (confirm("Tem certeza que deseja remover esta imagem?")) {
        onImageRemoved?.();
      }
      return;
    }

    setShowRemoveModal(true);
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: palette.container },
          ]}
        >
          <Image
            source={{ uri: imageUri }}
            style={[styles.image, (aspect = [1, 1]) ? { height: 330 } : null]}
            resizeMode="cover"
          />
          {!disabled && (
            <View
              style={[
                styles.imageActions,
                { backgroundColor: palette.actionStrip },
              ]}
            >
              <TouchableOpacity
                style={[styles.actionButton, styles.changeButton]}
                onPress={showImageOptions}
                disabled={loading}
              >
                <Ionicons name="camera" size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>Alterar</Text>
              </TouchableOpacity>
              {onImageRemoved && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.removeButton]}
                  onPress={handleRemoveImage}
                  disabled={loading}
                >
                  <Ionicons name="trash" size={20} color="#FFF" />
                  <Text style={styles.actionButtonText}>Remover</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.placeholder,
            {
              borderColor: palette.placeholderBorder,
              backgroundColor: palette.placeholderBackground,
            },
          ]}
          onPress={showImageOptions}
          disabled={disabled || loading}
        >
          {loading ? (
            <ActivityIndicator size="large" color={palette.primary} />
          ) : (
            <>
              <Ionicons name="image-outline" size={48} color={palette.icon} />
              <Text style={[styles.placeholderText, { color: palette.text }]}>
                Adicionar Imagem
              </Text>
              <Text
                style={[styles.placeholderSubtext, { color: palette.subtext }]}
              >
                Toque para selecionar da galeria ou tirar uma foto
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}

      <ImagePickerModal
        visible={showPickerModal}
        onClose={() => setShowPickerModal(false)}
        onGallery={pickImage}
        onCamera={takePhoto}
        isDarkMode={tone === "dark"}
      />

      <RemoveImageModal
        visible={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        onConfirm={() => onImageRemoved?.()}
        isDarkMode={tone === "dark"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  imageContainer: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
  },
  image: {
    width: "auto",
    height: 200,
  },
  imageActions: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  changeButton: {
    backgroundColor: "#0162B3",
  },
  removeButton: {
    backgroundColor: "#DC2626",
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  placeholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#475569",
  },
  placeholderSubtext: {
    marginTop: 4,
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
  },
});
