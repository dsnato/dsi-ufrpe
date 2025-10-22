import { ToastProvider } from '@/src/components/ToastContext';
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <ToastProvider>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      >
      <Stack.Screen name="screens/Login/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/register/index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Atividade */}
      <Stack.Screen name="screens/Atividade/CriacaoAtividade/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/Atividade/EdicaoAtividade/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/Atividade/InfoAtividade/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/Atividade/ListagemAtividade/index" options={{ headerShown: false }} />

      {/* Cliente */}
      <Stack.Screen name="screens/Cliente/CriacaoCliente/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/Cliente/EdicaoCliente/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/Cliente/InfoCliente/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/Cliente/ListagemCliente/index" options={{ headerShown: false }} />

      {/* Funcionario */}
      <Stack.Screen name="screens/Funcionario/CriacaoFuncionario/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/Funcionario/EdicaoFuncionario/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/Funcionario/InfoFuncionario/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/Funcionario/ListagemFuncionario/index" options={{ headerShown: false }} />

      {/* Quarto */}
      <Stack.Screen name="screens/Quarto/CriacaoQuarto/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/Quarto/EdicaoQuarto/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/Quarto/InfoQuarto/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/Quarto/ListagemQuarto/index" options={{ headerShown: false }} />

      {/* Reserva */}
      <Stack.Screen name="screens/Reserva/CriacaoReserva/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/Reserva/EdicaoReserva/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/Reserva/InfoReserva/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/Reserva/ListagemReserva/index" options={{ headerShown: false }} />

      {/* (tabs) */}
      <Stack.Screen name="screens/(tabs)/index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/(tabs)/cliente" options={{ headerShown: false }} />
      <Stack.Screen name="screens/(tabs)/reservas" options={{ headerShown: false }} />
    </Stack>
    </ToastProvider>
  );
}
