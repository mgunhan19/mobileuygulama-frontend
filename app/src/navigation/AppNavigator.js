import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen'; 
import RegisterScreen from '../screens/RegisterScreen';
import MainMenu from '../screens/MainMenu'; 
import GameScreen from '../screens/GameScreen'; 
import ProfileScreen from '../screens/ProfileScreen'; 
import LeaderboardScreen from '../screens/LeaderboardScreen'; 
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="MainMenu" component={MainMenu} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} /> 
    </Stack.Navigator>
  );
}