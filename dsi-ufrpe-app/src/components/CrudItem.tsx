import { Text, View, StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
    label: string;
    children: React.ReactNode;
    long?: boolean;
}

export default function CrudItem({ label, children, long, ...rest }: Props) {
    return (
        <TouchableOpacity style={[styles.gridItem, long ? { width: '100%' } : null]} {...rest}>
            {children}
            <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  gridItem: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#718FE9',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '50%',
    height: 160,
  },
  text: {
    fontSize: 24,
    color: "#718FE9",
    fontWeight: "bold",
    textAlign: 'center'
  }
})