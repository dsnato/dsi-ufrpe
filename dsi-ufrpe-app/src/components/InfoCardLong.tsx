import React, { useState } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type InfoCardLongProps = {
    iconName: keyof typeof Ionicons.glyphMap;
    title: string;
    time: string;
    highlight?: boolean; // muda o estilo principal (ex: Música)
    onPress?: () => void;
};

export default function InfoCardLong({
    iconName,
    title,
    time,
    highlight = false,
    onPress,
}: InfoCardLongProps) {
    const [pressAnim] = useState(new Animated.Value(0));

    const handlePressIn = () => {
        Animated.timing(pressAnim, {
            toValue: 1,
            duration: 120,
            useNativeDriver: false,
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(pressAnim, {
            toValue: 0,
            duration: 120,
            useNativeDriver: false,
        }).start();
    };

    const backgroundColor = pressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: highlight ? ["#132F3B", "#0E222B"] : ["#FFFFFF", "#DDEAF2"],
    });

    const titleColor = pressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: highlight ? ["#ffe46cff", "#FFE157"] : ["#4BBAED", "#3399CC"],
    });

    const iconColor = pressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: highlight ? ["#fc6638ff", "#FF4F19"] : ["#4BBAED", "#1B7BAA"],
    });

    const timeColor = pressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: highlight ? ["#EFEFF0", "#FFF"] : ["#000", "#132F3B"],
    });

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            style={styles.touchable}
        >
            <Animated.View style={[styles.card, { backgroundColor }]}>
                <Animated.View>
                    <Ionicons
                        name={iconName}
                        size={24}
                        color={highlight ? "#FF4F19" : "#4BBAED"}
                        style={styles.icon}
                    />
                </Animated.View>

                <Animated.Text style={[styles.title, { color: titleColor }]}>
                    {title}
                </Animated.Text>

                <Animated.Text style={[styles.time, { color: timeColor }]}>
                    {time}
                </Animated.Text>
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    touchable: {
        width: "100%",
        borderRadius: 20,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    card: {
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        marginBottom: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    time: {
        fontSize: 14,
        marginTop: 2,
    },
});
