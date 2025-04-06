import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../theme';

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  GenderSelection: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Ovulink</Text>
          <Text style={styles.tagline}>Fertility tracking for couples</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Welcome to Ovulink</Text>
          <Text style={styles.infoText}>
            The first fertility app designed for both partners to work together on their conception journey.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.primary,
  },
  tagline: {
    fontSize: 16,
    color: colors.text,
    marginTop: 8,
  },
  infoContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: colors.primary,
  },
  registerButton: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
