import { View, Text, StyleSheet } from "react-native";


type Props = {
    title: string,
    text: string,
}

export default function TitleWithText({ title, text }: Props) {
    return <>
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{text}</Text>
        </View>
    </>
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    title: {
        fontSize: 20,
        color: "#0162B3",
        fontWeight: "bold",
    },
    text: {
        fontSize: 14,
        color: "#666666",
        marginTop: 2,
        fontWeight: "medium"
    },
})