import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
type TextInputRoundedProps = TextInputProps & {
    placeholder?: string;
}
export default function TextInputRounded({ placeholder, ...rest }: TextInputRoundedProps) {
    return (
        <View style={styles.container}>
            <FontAwesome name="search" size={20} color="#132F3B" />
            <TextInput
                style={{
                    color: "#132F3B",
                    fontSize: 18,
                    fontWeight: "bold",
                    borderColor: "#ccc",
                    width: "100%",
                }}
                placeholder="Pesquisar por nome..."
                placeholderTextColor="#c4c4c4"
                {...rest}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white", 
        borderRadius: 20, 
        overflow: "hidden", 
        marginHorizontal: 50, 
        flexDirection: "row", 
        alignItems: "center", 
        paddingHorizontal: 10, 
        gap: 10, 
        marginBottom: 20, 
        marginTop: 10,
    },
});