import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
    label?: string;
    leftIcon?: React.ReactNode; // Permite passa um ícone
};

// Com o leftIcon, poderá ser passado de maneira livre o ícone a partir das tags necessárias (seja por Ionicons ou Image)

export default function InputText({ label, leftIcon, ...rest }: Props) {
    return (
        <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
                {leftIcon}
                <TextInput
                    placeholder={label}
                    style={styles.input}
                    placeholderTextColor="#a0a0a0"
                    {...rest}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: "#EFEFF0", // fundo cinza claro
        borderColor: "#c4c4c4",
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        justifyContent: "space-between",
        height: 45, // mesma altura para todos
        marginVertical: 10,
        width: '100%'
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        height: '100%',
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: "#000", // cor do texto digitado
    },
});
