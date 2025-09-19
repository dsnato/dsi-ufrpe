import { Image } from "expo-image";
import { StyleSheet, View, Text } from "react-native";

type Props = {
    title: string;
    non_image?: boolean;
}

export default function Header ({ title,non_image }: Props) {
    return (
        <View style={styles.header}>
            {non_image && <Image
                source={require('@/assets/images/hotel1.png')}
                style={styles.iconSmall}
            />}
            <Text style={styles.appName}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        width: "100%",
        height: 60,
        // backgroundColor: "#000"
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2176ff',
    },
    iconSmall: {
        width: 40,
        height: 40,
        marginRight: 8,
    }
})