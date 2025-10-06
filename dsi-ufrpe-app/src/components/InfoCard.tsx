import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

type InfoCardProps = {
  iconName?: keyof typeof Ionicons.glyphMap; // typing mais seguro
  title: string;
  subtitle?: string;
  elevate?: boolean;
  textColor?: string;
}

export default function InfoCard({ title, subtitle, iconName, elevate, textColor }: InfoCardProps) {
  const [backgroundAnim] = useState(new Animated.Value(0));
  const [titleAnim] = useState(new Animated.Value(0));
  const [iconAnim] = useState(new Animated.Value(0));
  const [subtitleAnim] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(backgroundAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(iconAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(backgroundAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(titleAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(iconAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(subtitleAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const backgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FAFAFA', '#132F3B'],
  });

  const titleColor = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#4BBAED', '#FFE157'],
  });

  const iconColor = iconAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#FF4F19'],
  });

  const subtitleColor = subtitleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#132F3B', '#EFEFF0'],
  });

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[styles.touchable, elevate === false ? { elevation: 0 } : null]}
    >
      <Animated.View style={[styles.card, { backgroundColor }]}>
        {iconName ? (<Animated.Text style={{ color: iconColor }}>
          <Ionicons name={iconName} size={25} style={styles.icon} />
        </Animated.Text>) : null}

        <Animated.Text style={[styles.title, { color: titleColor }, textColor ? { color: textColor } : null]}>
          {title}
        </Animated.Text>

        {subtitle ? <Animated.Text style={[styles.subtitle, { color: subtitleColor }]}>
          {subtitle}
        </Animated.Text> : null}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Para Android
  },

  card: {
    borderRadius: 20,
    padding: 8,
    width: 160,
    minHeight: 90,
    justifyContent: "center",
    alignItems: "center",
    rowGap: 3,
  },

  icon: {
    marginBottom: 4,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});