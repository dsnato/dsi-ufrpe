import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native";

type InfoCardProps = TouchableOpacityProps & {
  iconName?: keyof typeof Ionicons.glyphMap; // typing mais seguro
  title: string;
  subtitle?: string;
  elevate?: boolean;
  textColor?: string;
  variant?: "primary" | "outline" | "danger";
  // permitir sobrescrever a cor do ícone para casos específicos (ex: azul no botão editar)
  iconTint?: string;

}

export default function InfoCard({ title, subtitle, iconName, elevate, textColor, variant = "primary", iconTint, ...rest }: InfoCardProps) {
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

  // cores por variante para melhorar contraste e legibilidade
  const variantMap = {
    primary: {
      bg: ['#0162B3', '#132F3B'],
      title: ['#FFFFFF', '#FFE157'],
      icon: ['#FFFFFF', '#FF4F19'],
      subtitle: ['#E0F2FE', '#EFEFF0'],
      border: '#0162B3'
    },
    danger: {
      bg: ['#FFFFFF', '#EF4444'],
      title: ['#EF4444', '#FFFFFF'],
      icon: ['#EF4444', '#FFFFFF'],
      subtitle: ['#DC2626', '#FFFFFF'],
      border: '#EF4444'
    },
    outline: {
      bg: ['#F1F5F9', '#E6F0F6'],
      title: ['#0F172A', '#0162B3'],
      icon: ['#0F172A', '#0162B3'],
      subtitle: ['#64748B', '#132F3B'],
      border: '#CBD5E1'
    }
  };

  const colors = variantMap[variant];

  const backgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: colors.bg,
  });

  const titleColor = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: colors.title,
  });

  const iconColor = iconAnim.interpolate({
    inputRange: [0, 1],
    outputRange: colors.icon,
  });

  const subtitleColor = subtitleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: colors.subtitle,
  });

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
      accessibilityRole="button"
      activeOpacity={0.85}
      style={[
        styles.touchable,
        variant === 'outline' ? styles.outlineTouchable : null,
        elevate === false ? { elevation: 0 } : null
      ]}
    >
      <Animated.View style={[
        styles.card,
        variant === 'outline' ? styles.outlineCard : null,
        { backgroundColor }
      ]}>

        {iconName ? (
          // se `iconTint` for passado, renderizamos o ícone com cor estática
          iconTint ? (
            <Ionicons name={iconName} size={22} color={iconTint} style={styles.icon} />
          ) : (
            <Animated.Text style={{ color: iconColor }}>
              <Ionicons name={iconName} size={22} style={styles.icon} />
            </Animated.Text>
          )
        ) : null}

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
    width: 160,
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
  outlineTouchable: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    elevation: 0,
  },
  outlineCard: {
    borderWidth: 1,
    borderColor: '#132F3B',
    paddingVertical: 12,
    paddingHorizontal: 12,
  }
});