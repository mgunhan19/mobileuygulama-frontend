import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import GameScreen from '../screens/GameScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen'; // EKLEME
import LoginScreen from '../screens/LoginScreen';
import MainMenu from '../screens/MainMenu';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainMenu" component={MainMenu} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} /> 
    </Stack.Navigator>
  );
}