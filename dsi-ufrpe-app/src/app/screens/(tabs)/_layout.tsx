import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: 'blue',
      headerShown: false
    }}>
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
          headerShown: false,
          tabBarIcon: ({ color }) => <Entypo name="map" size={24} color={color}/>,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="crud"
        options={{
          title: 'CRUD',
          headerShown: false,
          tabBarIcon: ({ color }) => <Entypo name="circle-with-plus" size={24} color={color}  />,
        }}
      />
    </Tabs>
  );
}
