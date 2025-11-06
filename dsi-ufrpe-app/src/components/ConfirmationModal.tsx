import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import ButtonPoint from './button';

interface ConfirmationModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export function ConfirmationModal({
  isVisible,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
}: ConfirmationModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>
          
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <ButtonPoint
                label={cancelText}
                onPress={onCancel}
                disabled={loading}
              />
            </View>
            <View style={styles.button}>
              <ButtonPoint
                label={confirmText}
                variant="check-in"
                status={loading ? 'loading' : 'idle'}
                onPress={onConfirm}
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#132F3B',
  },
  modalText: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});