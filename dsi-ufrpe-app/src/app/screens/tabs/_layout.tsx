import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#718FE9",
          borderTopWidth: 0,
          height: 70,
        },
        tabBarActiveTintColor: "#4169E1",
        tabBarInactiveTintColor: "#fff",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Mapa",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="map"
              size={26}
              color={focused ? "#4169E1" : "#fff"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="home"
              size={26}
              color={focused ? "#4169E1" : "#fff"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cruds"
        options={{
          title: "Cruds",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="edit"
              size={26}
              color={focused ? "#4169E1" : "#fff"}
            />
          ),
        }}
      />
    </Tabs>
  );
}