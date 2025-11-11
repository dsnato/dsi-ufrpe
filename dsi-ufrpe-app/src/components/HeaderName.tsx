import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/src/components/ToastContext";


interface InfoCardProps {
  title?: string;
  subtitle?: string;
  iconNameLeft: keyof typeof Ionicons.glyphMap; // typing mais seguro
  iconNameRight: keyof typeof Ionicons.glyphMap; // typing mais seguro
}

export default function HeaderName({ iconNameLeft, iconNameRight, title, subtitle }: InfoCardProps) {
  const [backgroundAnim] = useState(new Animated.Value(0));
  const [titleAnim] = useState(new Animated.Value(0));
  const [iconAnim] = useState(new Animated.Value(0));
  const [subtitleAnim] = useState(new Animated.Value(0));
  const { showError } = useToast();

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

  async function logoutAccount() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        showError('Erro ao fazer logout: ' + error.message);
      } else {
        // Redirecionar para tela de login após logout bem-sucedido
        router.replace("/screens/Login");
      }
    } catch (err) {
      showError('Ocorreu um erro ao tentar fazer logout');
    }
  }

  const iconColor = iconAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#FF4F19'],
  });

  return (
    // <TouchableOpacity
    //   onPressIn={handlePressIn}
    //   onPressOut={handlePressOut}
    //   activeOpacity={1}
    //   style={styles.touchable}
    // >
    //   <Animated.View style={[styles.card, { backgroundColor }]}>
    //     <Animated.Text style={{ color: iconColor }}>
    //       <Ionicons 
    //         name={iconName} 
    //         size={25}
    //         style={styles.icon} 
    //       />
    //     </Animated.Text>

    //     <Animated.Text style={[styles.title, { color: titleColor }]}>
    //       {title}
    //     </Animated.Text>

    //     <Animated.Text style={[styles.subtitle, { color: subtitleColor }]}>
    //       {subtitle}
    //     </Animated.Text>
    //   </Animated.View>
    // </TouchableOpacity>
    <View style={styles.mainContainer}>
      <View style={{alignItems: "center", flexDirection: "row"}}>
        <Ionicons name={iconNameLeft} size={50} style={[styles.icon, { color:"#132F3B"}]} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={() => [handlePressOut(), logoutAccount()]}
      activeOpacity={1}>
        <Animated.Text style={{ color: iconColor }}>
          <Ionicons name={iconNameRight} size={25} style={[styles.icon, { marginTop: 5}]} />
        </Animated.Text>
    </TouchableOpacity>
  </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EFEFF0",
    height: 80,
    paddingHorizontal: 20,
  },
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#39AADE",
  },
  
  subtitle: {
    fontSize: 14,
    fontWeight: "600"
  },
});