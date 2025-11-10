import { ToastProvider } from '@/src/components/ToastContext';
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <ToastProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right', // Transição suave
        }}
      >
        {/* Auth Screens */}
        <Stack.Screen 
          name="screens/Login/index" 
          options={{ 
            animation: 'fade' // Login com fade
          }} 
        />
        <Stack.Screen 
          name="screens/register/index" 
          options={{ 
            animation: 'fade' 
          }} 
        />

        {/* Tabs Navigation */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false 
          }} 
        />

        {/* Atividade Screens */}
        <Stack.Screen name="screens/Atividade/CriacaoAtividade/index" />
        <Stack.Screen name="screens/Atividade/EdicaoAtividade/index" />
        <Stack.Screen name="screens/Atividade/InfoAtividade/index" />
        <Stack.Screen name="screens/Atividade/ListagemAtividade/index" />

        {/* Cliente Screens */}
        <Stack.Screen name="screens/Cliente/CriacaoCliente/index" />
        <Stack.Screen name="screens/Cliente/EdicaoCliente/index" />
        <Stack.Screen name="screens/Cliente/InfoCliente/index" />
        <Stack.Screen name="screens/Cliente/ListagemCliente/index" />

        {/* Funcionario Screens */}
        <Stack.Screen name="screens/Funcionario/CriacaoFuncionario/index" />
        <Stack.Screen name="screens/Funcionario/EdicaoFuncionario/index" />
        <Stack.Screen name="screens/Funcionario/InfoFuncionario/index" />
        <Stack.Screen name="screens/Funcionario/ListagemFuncionario/index" />

        {/* Quarto Screens */}
        <Stack.Screen name="screens/Quarto/CriacaoQuarto/index" />
        <Stack.Screen name="screens/Quarto/EdicaoQuarto/index" />
        <Stack.Screen name="screens/Quarto/InfoQuarto/index" />
        <Stack.Screen name="screens/Quarto/ListagemQuarto/index" />

        {/* Reserva Screens */}
        <Stack.Screen name="screens/Reserva/CriacaoReserva/index" />
        <Stack.Screen name="screens/Reserva/EdicaoReserva/index" />
        <Stack.Screen name="screens/Reserva/InfoReserva/index" />
        <Stack.Screen name="screens/Reserva/ListagemReserva/index" />
      </Stack>
    </ToastProvider>
  );
}
