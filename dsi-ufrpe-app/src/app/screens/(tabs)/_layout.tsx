import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: "#FF4F19",
      headerShown: false,
      tabBarStyle: {
        height: 50
      }
    }}>
      <Tabs.Screen
        name="map"
        options={{
          title: 'Reservas',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
              <Ionicons name="calendar" size={24} color={color}  />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          headerShown: false,
          tabBarIcon: ({ color, focused }) =>
                <Ionicons name="home" size={24} color={color}  />
        }}
      />
      <Tabs.Screen
        name="crud"
        options={{
          title: 'Clientes',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color}  />,
        }}
      />
    </Tabs>
  );
}
