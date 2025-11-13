import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

type TextInputRoundedProps = TextInputProps & {
    placeholder?: string;
}

export default function TextInputRounded({ placeholder, ...rest }: TextInputRoundedProps) {
    return (
        <View style={styles.container}>
            <FontAwesome name="search" size={18} color="#64748B" />
            <TextInput
                style={styles.input}
                placeholder={placeholder || "Pesquisar por nome..."}
                placeholderTextColor="#94A3B8"
                {...rest}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
        borderWidth: 1.5,
        borderColor: "#E2E8F0",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    input: {
        flex: 1,
        color: "#132F3B",
        fontSize: 15,
        fontWeight: "500",
        paddingVertical: 0,
    },
});