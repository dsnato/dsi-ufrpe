import { StyleSheet, Text, View, KeyboardTypeOptions } from "react-native";
import InputText from "./input";

// Definindo as Props do componente
type Props = {
    labelText: string,
    placeholder: string,
    required?: boolean,
    value?: string,
    onChangeText?: (text: string) => void,
    keyboardType?: KeyboardTypeOptions,
}


// Componente
export default function InputWithText({ labelText, placeholder, required, value, onChangeText, keyboardType }: Props) {
    return <>
        <View style={styles.container}>
            <Text style={styles.text}>
                {labelText}
                {required && <Text style={{ color: '#DE3E3E', fontSize: 16, fontWeight: 'bold' }}> *</Text>}
            </Text>
            <InputText 
                placeholder={placeholder} 
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
            />
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