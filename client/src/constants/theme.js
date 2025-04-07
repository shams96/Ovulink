import { DefaultTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

// Define the color palette
const colors = {
  // Primary colors
  primary: '#7E57C2', // Purple - main brand color
  primaryLight: '#B085F5',
  primaryDark: '#4D2C91',
  
  // Secondary colors
  secondary: '#FF6B8B', // Pink - accent color
  secondaryLight: '#FF9FB2',
  secondaryDark: '#D84A6A',
  
  // Neutral colors
  background: '#FFFFFF',
  surface: '#F9F9F9',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  
  // Semantic colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  
  // Gender-specific colors
  female: '#FF6B8B', // Pink
  male: '#4FC3F7', // Blue
  
  // Fertility status colors
  fertile: '#4CAF50', // Green
  ovulation: '#FF9800', // Orange
  period: '#F44336', // Red
  luteal: '#9C27B0', // Purple
  follicular: '#2196F3', // Blue
  lowFertility: '#F44336', // Red
  mediumFertility: '#FF9800', // Orange
  highFertility: '#4CAF50', // Green
  
  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};

// Define the typography
const fonts = {
  regular: {
    fontFamily: 'System',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500',
  },
  light: {
    fontFamily: 'System',
    fontWeight: '300',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700',
  },
};

// Create the theme
export const theme = {
  ...DefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    error: colors.error,
    disabled: colors.grey[400],
    placeholder: colors.grey[500],
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: colors.secondary,
    card: colors.white,
    border: colors.border,
    // Custom colors
    ...colors,
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: fonts.regular,
    medium: fonts.medium,
    light: fonts.light,
    thin: fonts.light,
  },
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};

// Export spacing constants
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Export typography styles
export const typography = {
  h1: {
    ...fonts.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0.25,
    color: colors.text,
  },
  h2: {
    ...fonts.bold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
    color: colors.text,
  },
  h3: {
    ...fonts.bold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.15,
    color: colors.text,
  },
  h4: {
    ...fonts.medium,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.15,
    color: colors.text,
  },
  h5: {
    ...fonts.medium,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.1,
    color: colors.text,
  },
  subtitle1: {
    ...fonts.medium,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.15,
    color: colors.textSecondary,
  },
  subtitle2: {
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: colors.textSecondary,
  },
  body1: {
    ...fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    color: colors.text,
  },
  body2: {
    ...fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    color: colors.text,
  },
  button: {
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 1.25,
    textTransform: 'uppercase',
    color: colors.white,
  },
  caption: {
    ...fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
    color: colors.textSecondary,
  },
  overline: {
    ...fonts.regular,
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
};

// Export shadow styles
export const shadows = {
  small: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
