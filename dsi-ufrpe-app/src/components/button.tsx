import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { Feather } from '@expo/vector-icons';

export type ButtonVariant = 'default' | 'check-in' | 'check-out';

export type ButtonStatus = 'idle' | 'loading' | 'success' | 'error';

type Props = TouchableOpacityProps & {
  label: string;
  loading?: boolean;
  variant?: ButtonVariant;
  status?: ButtonStatus;
  disabled?: boolean;
  disabledMessage?: string;
  icon?: keyof typeof Feather.glyphMap;
};

const VARIANT_COLORS = {
  default: {
    background: '#fafafa',
    text: '#0162B3',
  },
  'check-in': {
    background: '#4CAF50',
    text: '#ffffff',
  },
  'check-out': {
    background: '#2196F3',
    text: '#ffffff',
  },
};

export default function ButtonPoint({ 
  label, 
  variant = 'default',
  status = 'idle',
  disabled = false,
  disabledMessage,
  icon,
  style,
  ...rest 
}: Props) {
  const colors = VARIANT_COLORS[variant];
  const isDisabled = disabled || status === 'loading';
  const showSuccess = status === 'success';
  const showError = status === 'error';
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.button,
          { backgroundColor: colors.background },
          isDisabled && styles.buttonDisabled,
          showSuccess && styles.buttonSuccess,
          showError && styles.buttonError,
          style
        ]} 
        disabled={isDisabled}
        {...rest}
      >
        <View style={styles.contentContainer}>
          {status === 'loading' ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.text} size="small" />
              <Text style={[styles.buttonText, { color: colors.text }]}>Carregando...</Text>
            </View>
          ) : showSuccess ? (
            <View style={styles.loadingContainer}>
              <Feather name="check-circle" size={20} color="#ffffff" />
              <Text style={[styles.buttonText, { color: '#ffffff' }]}>Concluído</Text>
            </View>
          ) : showError ? (
            <View style={styles.loadingContainer}>
              <Feather name="alert-circle" size={20} color="#ffffff" />
              <Text style={[styles.buttonText, { color: '#ffffff' }]}>Erro</Text>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              {icon && <Feather name={icon} size={20} color={colors.text} style={styles.icon} />}
              <Text style={[styles.buttonText, { color: colors.text }]}>{label}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      {disabled && disabledMessage && (
        <Text style={styles.disabledMessage}>{disabledMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    padding: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 45,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonSuccess: {
    backgroundColor: '#4CAF50',
  },
  buttonError: {
    backgroundColor: '#DE3E3E',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    marginRight: 8,
  },
  disabledMessage: {
    color: '#DE3E3E',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});