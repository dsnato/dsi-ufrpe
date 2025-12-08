import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

type TextInputRoundedProps = TextInputProps & {
    placeholder?: string;
    isDarkMode?: boolean;
}

export default function TextInputRounded({ placeholder, isDarkMode = false, ...rest }: TextInputRoundedProps) {
    const colors = isDarkMode
        ? {
            bg: 'rgba(21, 34, 56, 0.4)', // card com transparência
            border: 'rgba(31, 43, 60, 0.6)',
            icon: '#94A3B8',
            placeholder: '#64748B',
            text: '#E2E8F0',
        }
        : {
            bg: '#FFFFFF',
            border: '#E2E8F0',
            icon: '#64748B',
            placeholder: '#94A3B8',
            text: '#132F3B',
        };

    return (
        <View style={[styles.container, {
            backgroundColor: colors.bg,
            borderColor: colors.border
        }]}>
            <FontAwesome name="search" size={18} color={colors.icon} />
            <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={placeholder || "Pesquisar por nome..."}
                placeholderTextColor={colors.placeholder}
                {...rest}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontWeight: "500",
        paddingVertical: 0,
    },
});
