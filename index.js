import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import App from './App';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import PalpitesScreen from './screens/PalpitesScreen';
import MeusPalpitesScreen from './screens/MeusPalpitesScreen';

const Stack = createNativeStackNavigator();

function Root() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={App} />
        <Stack.Screen name="Palpites" component={PalpitesScreen} />
        <Stack.Screen name="MeusPalpites" component={MeusPalpitesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(Root);