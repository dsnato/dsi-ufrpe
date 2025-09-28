import { StyleSheet, View, Text, Image, TouchableOpacity, Animated } from "react-native";
import React, { useState } from "react";

type HeaderNameProps = {
nomeUsuario: string;
onLogout?: () => void;
};

export default function HeaderName({ nomeUsuario, onLogout }: HeaderNameProps) {
const [iconAnim] = useState(new Animated.Value(0));

const handlePressIn = () => {
Animated.timing(iconAnim, {
toValue: 1,
duration: 200,
useNativeDriver: false,
}).start();
};

const handlePressOut = () => {
Animated.timing(iconAnim, {
toValue: 0,
duration: 200,
useNativeDriver: false,
}).start(() => {
if (onLogout) onLogout();
});
};

const iconColor = iconAnim.interpolate({
inputRange: [0, 1],
outputRange: ["#132F3B", "#FF4F19"],
});

return ( <View style={styles.header}> <View style={styles.iconName}>
<Image
source={require("../../assets/images/person.png")}
style={{ width: 30, height: 30, tintColor: "#132F3B" }}
/> <Text style={styles.text}>{nomeUsuario}</Text> </View>

  <TouchableOpacity
    onPressIn={handlePressIn}
    onPressOut={handlePressOut}
    activeOpacity={1}
  >
    <Animated.Image
      source={require("../../assets/images/ic_round-log-out.png")}
      style={{
        width: 26,
        height: 26,
        resizeMode: "contain",
        tintColor: iconColor as any,
      }}
    />
  </TouchableOpacity>
</View>

);
}

const styles = StyleSheet.create({
header: {
backgroundColor: "#EFEFF0",
width: "100%",
height: 60,
paddingHorizontal: 25,
flexDirection: "row",
alignItems: "center",
justifyContent: "space-between",
shadowColor: "#000",
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.15,
shadowRadius: 4,
elevation: 6,
},
text: {
fontSize: 16,
color: "#39AADE",
fontWeight: "bold",
},
iconName: {
flexDirection: "row",
height: 30,
alignItems: "center",
columnGap: 10,
},
});
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Animated } from "react-native";

interface InfoCardProps {
  title: string;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap; // typing mais seguro
}

export default function InfoCard({ iconName, title, subtitle }: InfoCardProps) {
  const [backgroundAnim] = useState(new Animated.Value(0));
  const [titleAnim] = useState(new Animated.Value(0));
  const [iconAnim] = useState(new Animated.Value(0));
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
      Animated.timing(iconAnim, {
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
      Animated.timing(iconAnim, {
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
      style={styles.touchable}
    >
      <Animated.View style={[styles.card, { backgroundColor }]}>
        <Animated.Text style={{ color: iconColor }}>
          <Ionicons 
            name={iconName} 
            size={25} 
            color={iconColor as any} 
            style={styles.icon} 
          />
        </Animated.Text>

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
  },
  
  subtitle: {
    fontSize: 14,
    fontWeight: "600"
  },
});