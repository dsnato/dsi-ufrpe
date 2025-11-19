import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onGallery: () => void;
  onCamera: () => void;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  visible,
  onClose,
  onGallery,
  onCamera,
}) => {
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
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <View style={styles.header}>
              <Ionicons name="images" size={32} color="#0162B3" />
              <Text style={styles.title}>Selecionar Imagem</Text>
              <Text style={styles.subtitle}>Escolha de onde deseja adicionar a imagem</Text>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={styles.optionButton} 
                onPress={() => {
                  onClose();
                  onGallery();
                }}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="images-outline" size={28} color="#0162B3" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Galeria</Text>
                  <Text style={styles.optionDescription}>Escolher da galeria de fotos</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.optionButton} 
                onPress={() => {
                  onClose();
                  onCamera();
                }}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="camera-outline" size={28} color="#0162B3" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Câmera</Text>
                  <Text style={styles.optionDescription}>Tirar uma nova foto</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
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
}

export const RemoveImageModal: React.FC<RemoveImageModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
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
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <View style={styles.header}>
              <View style={styles.warningIconContainer}>
                <Ionicons name="warning" size={32} color="#DC2626" />
              </View>
              <Text style={styles.title}>Remover Imagem</Text>
              <Text style={styles.subtitle}>
                Tem certeza que deseja remover esta imagem? Esta ação não pode ser desfeita.
              </Text>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.secondaryButton]} 
                onPress={onClose}
              >
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.dangerButton]} 
                onPress={() => {
                  onClose();
                  onConfirm();
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#FFF" />
                <Text style={styles.dangerButtonText}>Remover</Text>
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
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
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
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <View style={styles.header}>
              <View style={[styles.warningIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="log-out-outline" size={32} color="#F59E0B" />
              </View>
              <Text style={styles.title}>Sair do Aplicativo</Text>
              <Text style={styles.subtitle}>
                Deseja realmente sair? Você precisará fazer login novamente para acessar o sistema.
              </Text>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.secondaryButton]} 
                onPress={onClose}
              >
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#F59E0B' }]} 
                onPress={() => {
                  onClose();
                  onConfirm();
                }}
              >
                <Ionicons name="log-out-outline" size={18} color="#FFF" />
                <Text style={styles.dangerButtonText}>Sair</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  warningIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#132F3B',
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#132F3B',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  secondaryButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  dangerButton: {
    backgroundColor: '#DC2626',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
