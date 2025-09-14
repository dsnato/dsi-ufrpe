import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import InitScreen from './screens/initscreen';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/register';
import HomeScreen from './screens/Home';
//import ClienteInserirScreen from './screens/cliente/cliente-inserir';
//import ClienteListScreen from './screens/cliente/cliente-lista';
//import QuartoInserirScreen from './screens/quarto/quarto-inserir';
//import QuartoListScreen from './screens/quarto/quarto-lista';

const Stack = createNativeStackNavigator();

export default function AppLayout() {
  return (
      <Stack.Navigator initialRouteName="Login">
        {/* <Stack.Screen name="Initial" component={InitScreen} options={{ headerShown: false }} />
         */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
{/* 
        <Stack.Screen name="ClienteInserir" component={ClienteInserirScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ClienteList" component={ClienteListScreen} options={{ headerShown: false }} />
        
        <Stack.Screen name="QuartoInserir" component={QuartoInserirScreen} options={{ headerShown: false }} />
        <Stack.Screen name="QuartoList" component={QuartoListScreen} options={{ headerShown: false }} /> */}

      </Stack.Navigator>
  );
}
