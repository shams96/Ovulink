import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens (we'll create these next)
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import GenderSelectionScreen from '../screens/auth/GenderSelectionScreen';

const Stack = createStackNavigator();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="GenderSelection" component={GenderSelectionScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
