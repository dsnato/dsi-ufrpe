import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeDashboard from './screens/home';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/register';
import { HeaderShownContext } from '@react-navigation/elements';

const Stack = createNativeStackNavigator();

export default function AppLayout() {
  return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeDashboard} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
  );
}
