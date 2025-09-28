import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, Animated } from "react-native";

interface InfoCardProps {
  title: string;
  subtitle: string;
}

export default function RoomInfoCard({ title, subtitle }: InfoCardProps) {
  const [backgroundAnim] = useState(new Animated.Value(0));
  const [titleAnim] = useState(new Animated.Value(0));
  const [subtitleAnim] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(backgroundAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(backgroundAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(titleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(subtitleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const backgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FAFAFA", "#132F3B"],
  });

  const titleColor = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#4BBAED", "#FFE157"],
  });

  const subtitleColor = subtitleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#132F3B", "#EFEFF0"],
  });

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.touchable}
    >
      <Animated.View style={[styles.card, { backgroundColor }]}>
        <Animated.Text style={[styles.title, { color: titleColor }]}>
          {title}
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, { color: subtitleColor }]}>
          {subtitle}
        </Animated.Text>
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
    elevation: 5,
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
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
  },
});