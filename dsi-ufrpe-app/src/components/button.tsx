import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";



type Props = TouchableOpacityProps & {
  label: string;
  loading?: boolean;
}

export default function ButtonPoint({ label, loading = false, ...rest }: Props) {
  return (
    <TouchableOpacity 
      style={[styles.button, loading && styles.buttonDisabled]} 
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#0162B3" size="small" />
          <Text style={[styles.buttonText, styles.loadingText]}>Carregando...</Text>
        </View>
      ) : (
        <Text style={styles.buttonText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#fafafa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 45,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0162B3',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    marginLeft: 8,
  },
});