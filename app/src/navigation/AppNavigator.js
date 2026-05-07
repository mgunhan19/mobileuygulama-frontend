import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen'; // Login ekranını 
import RegisterScreen from '../screens/RegisterScreen';//Üye olma ekranı
import MainMenu from '../screens/MainMenu'; // Ana menü ekranı
import GameScreen from '../screens/GameScreen'; // Oyun ekranı
import ProfileScreen from '../screens/ProfileScreen'; // Profil ekranı

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainMenu" component={MainMenu} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}