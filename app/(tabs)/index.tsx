import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../src/screens/RegisterScreen';

import LoginScreen from '../src/screens/LoginScreen'; 

const Stack = createNativeStackNavigator();

export default function Home() {
  return (
   
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
      />
    </Stack.Navigator>
  );
}