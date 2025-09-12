import { Text, TextInput, StyleSheet, View, TextInputProps } from "react-native";

type Props = TextInputProps & {
    label: string;
};

export default function Input({ label, ...rest }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholderTextColor="rgba(10, 125, 125, 0.5)" {...rest} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        color: "#0a7d7d",
        fontWeight: "500",
    },
    inputContainer: {
        backgroundColor: "#e0f7f7",
        borderRadius: 8,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        color: "#0a7d7d",
    },
});