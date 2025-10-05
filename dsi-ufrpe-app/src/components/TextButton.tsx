import { StyleSheet, Text, View } from "react-native";
import InputText from "./input";

// Definindo as Props do componente
type Props = {
    labelText: string,
    placeholder: string,
    required?: boolean, // Faz com que adicione o asterisco vermelho se for true
}


// Componente
export default function InputWithText({ labelText, placeholder, required }: Props) {
    return <>
        <View style={styles.container}>
            <Text style={styles.text}>
                {labelText}
                {required && <Text style={{ color: '#DE3E3E', fontSize: 16, fontWeight: 'bold' }}> *</Text>}
            </Text>
            <InputText placeholder={placeholder} />
        </View>
    </>;
}


// Estilização
const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        width: '100%',
    },
    text: {
        fontSize: 16,
        marginBottom: 4,
        color: "#0162B3",
        fontWeight: "medium",
    },

})