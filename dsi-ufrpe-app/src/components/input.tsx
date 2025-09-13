import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
    label: string;
};

export default function Input({ label, ...rest }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholderTextColor="rgba(157, 163, 163)" {...rest} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
        width: '100%', // Ajusta a largura do container
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        color: "#0162B3",
        fontWeight: "500",
    },
    inputContainer: {
        borderBlockColor: "#737a7aff",
        backgroundColor: "#e0f7f7",
        borderRadius: 4,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        width: '100%', // Ajusta a largura do input container
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        color: "#7b8888ff",
        width: '100%', // Garante que o input ocupe toda a largura
    },
});