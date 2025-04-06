import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../store';
import { colors } from '../theme';

// Import screens (we'll create these next)
import HomeScreen from '../screens/main/HomeScreen';
import CycleScreen from '../screens/main/CycleScreen';
import MaleHealthScreen from '../screens/main/MaleHealthScreen';
import LogScreen from '../screens/main/LogScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainNavigator: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isMale = user?.gender === 'male';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cycle' && !isMale) {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'MaleHealth' && isMale) {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Log') {
            iconName = focused ? 'journal' : 'journal-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      {!isMale && <Tab.Screen name="Cycle" component={CycleScreen} />}
      {isMale && <Tab.Screen name="MaleHealth" component={MaleHealthScreen} />}
      <Tab.Screen name="Log" component={LogScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
