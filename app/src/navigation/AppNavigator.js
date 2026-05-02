import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen'; // Login ekranını 
import RegisterScreen from '../screens/RegisterScreen';//Üye olma ekranı
import MainMenu from '../screens/MainMenu'; // Ana menü ekranı

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainMenu" component={MainMenu} />
    </Stack.Navigator>
  );
}