import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { selectIsAuthenticated, getCurrentUser } from '../redux/slices/authSlice';
import { theme } from '../constants/theme';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';

// Main screens
import HomeScreen from '../screens/main/HomeScreen';
import CalendarScreen from '../screens/main/CalendarScreen';
import EducationScreen from '../screens/main/EducationScreen';
import ArticleDetailScreen from '../screens/main/ArticleDetailScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Female health screens
import CycleTrackingScreen from '../screens/female/CycleTrackingScreen';
import TemperatureScreen from '../screens/female/TemperatureScreen';
import CervicalMucusScreen from '../screens/female/CervicalMucusScreen';
import OvulationPredictionScreen from '../screens/female/OvulationPredictionScreen';

// Male health screens
import SpermHealthScreen from '../screens/male/SpermHealthScreen';
import SpermTrendsScreen from '../screens/male/SpermTrendsScreen';

// Create navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth navigator
const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Female health navigator
const FemaleHealthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="CycleTracking" component={CycleTrackingScreen} options={{ title: 'Cycle Tracking' }} />
    <Stack.Screen name="Temperature" component={TemperatureScreen} options={{ title: 'Temperature' }} />
    <Stack.Screen name="CervicalMucus" component={CervicalMucusScreen} options={{ title: 'Cervical Mucus' }} />
    <Stack.Screen name="OvulationPrediction" component={OvulationPredictionScreen} options={{ title: 'Ovulation Prediction' }} />
  </Stack.Navigator>
);

// Male health navigator
const MaleHealthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="SpermHealth" component={SpermHealthScreen} options={{ title: 'Sperm Health' }} />
    <Stack.Screen name="SpermTrends" component={SpermTrendsScreen} options={{ title: 'Sperm Trends' }} />
  </Stack.Navigator>
);

// Main tab navigator
const MainNavigator = () => {
  const user = useSelector(state => state.auth.user);
  const isFemale = user?.gender === 'female';
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Education') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'FemaleHealth') {
            iconName = focused ? 'female' : 'female-outline';
          } else if (route.name === 'MaleHealth') {
            iconName = focused ? 'male' : 'male-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.grey[600],
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen
        name={isFemale ? 'FemaleHealth' : 'MaleHealth'}
        component={isFemale ? FemaleHealthNavigator : MaleHealthNavigator}
        options={{ title: 'Health' }}
      />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendar' }} />
      <Tab.Screen name="Education" component={EducationScreen} options={{ title: 'Learn' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

// Root navigator
const AppNavigator = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Check if user is authenticated
    dispatch(getCurrentUser());
  }, [dispatch]);
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen 
            name="ArticleDetail" 
            component={ArticleDetailScreen} 
            options={{
              headerShown: true,
              title: '',
              headerBackTitle: 'Back',
              headerTintColor: theme.colors.primary,
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
