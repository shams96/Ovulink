import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const colors = {
  primary: '#FF6B8B',
  secondary: '#7C83FD',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#333333',
  error: '#FF5252',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
  male: '#7C83FD',
  female: '#FF6B8B',
  neutral: '#78909C',
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
  },
};
