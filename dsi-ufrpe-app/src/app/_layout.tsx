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
      <Stack.Screen
        name="screens/clientes/index"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="screens/Atividade/CriacaoAtividade/index"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="screens/Atividade/EdicaoAtividade/index"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="screens/Atividade/InfoAtividade/index"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="screens/Atividade/ListagemAtividade/index"
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="screens/Quarto/CriacaoQuarto/index"
        options={{
          headerShown: false
        }}
      />
    </Stack>
    
  );
}
