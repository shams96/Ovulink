import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/redux/store';
import { theme } from './src/constants/theme';
import LoadingScreen from './src/screens/LoadingScreen';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Load only Ionicons font for the demo
        await Font.loadAsync({
          ...Ionicons.font,
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <NavigationContainer theme={theme}>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </ReduxProvider>
  );
}
