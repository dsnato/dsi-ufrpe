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
    borderRadius: 12,
    backgroundColor: '#1cad54ff',
    alignItems: 'center',
    width: '100%',  
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});