import { TouchableOpacity, TouchableOpacityProps, StyleSheet, Text } from "react-native";



type Props = TouchableOpacityProps & {
  label: string;
}

export default function ButtonPoint({ label, ...rest }: Props) {
  return (
    <TouchableOpacity style={styles.button}{...rest}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#fafafa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 45,
  },
  buttonText: {
    color: '#0162B3',
    fontWeight: 'bold',
    fontSize: 16,
  },
});