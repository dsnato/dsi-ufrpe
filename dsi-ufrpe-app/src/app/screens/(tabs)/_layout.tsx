import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Layout() {
  const insets = useSafeAreaInsets();
  const screenOptions = {
    tabBarActiveTintColor: "#FF4F19",
    tabBarInactiveTintColor: "#132F3B",
    headerShown: false,
    tabBarStyle: {
      height: 50 + insets.bottom,
      paddingBottom: insets.bottom,
    }
  };
  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Reservas',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 name="concierge-bell" size={24} color={focused ? color: "#132F3B"}  />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          headerShown: false,
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name="home" size={24} color={focused ? color: "#132F3B"}  />
        }}
      />
      <Tabs.Screen
        name="crud"
        options={{
          title: 'Clientes',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <Ionicons name="person" size={24} color={focused ? color: "#132F3B"}  />,
        }}
      />
    </Tabs>
  );
}
