import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps;

export default function InputText({ ...rest }: Props) {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholderTextColor="#a0a0a0"
                {...rest}
            />
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
        justifyContent: "center",
        height: 45, // mesma altura para todos
        marginVertical: 20,
        width: '100%'
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: "#000", // cor do texto digitado
    },
});
