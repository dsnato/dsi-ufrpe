import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false
      }}
    >
      <Stack.Screen 
        name="screens/Login/index" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="screens/register/index" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false
        }} 
      />
    </Stack>
  );
}
