import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { SafeAreaView } from 'react-native-safe-area-context';

import { login, selectError, selectIsLoading, resetError } from '../../redux/slices/authSlice';
import { theme, spacing, typography } from '../../constants/theme';
import LoadingScreen from '../LoadingScreen';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

/**
 * Login screen component
 * @param {object} navigation - React Navigation object
 * @returns {JSX.Element} - Login screen component
 */
const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // Reset error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetError());
    };
  }, [dispatch]);

  // Handle login
  const handleLogin = (values) => {
    dispatch(login(values));
  };

  // Toggle password visibility
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  if (isLoading) {
    return <LoadingScreen message="Logging in..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>OL</Text>
            </View>
            <Text style={styles.title}>Ovulink</Text>
            <Text style={styles.subtitle}>Your Fertility Journey Partner</Text>
          </View>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.formContainer}>
                <TextInput
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={touched.email && errors.email}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  left={<TextInput.Icon icon="email" />}
                />
                {touched.email && errors.email && (
                  <HelperText type="error" visible={touched.email && errors.email}>
                    {errors.email}
                  </HelperText>
                )}

                <TextInput
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={touched.password && errors.password}
                  style={styles.input}
                  mode="outlined"
                  secureTextEntry={secureTextEntry}
                  autoCapitalize="none"
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={secureTextEntry ? 'eye' : 'eye-off'}
                      onPress={toggleSecureEntry}
                    />
                  }
                />
                {touched.password && errors.password && (
                  <HelperText type="error" visible={touched.password && errors.password}>
                    {errors.password}
                  </HelperText>
                )}

                {error && (
                  <HelperText type="error" visible={!!error}>
                    {error}
                  </HelperText>
                )}

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}
                  labelStyle={styles.buttonLabel}
                >
                  Login
                </Button>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}
                  style={styles.linkContainer}
                >
                  <Text style={styles.linkText}>
                    Don't have an account? <Text style={styles.link}>Register</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  title: {
    ...typography.h1,
    color: theme.colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.subtitle1,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
  },
  buttonLabel: {
    ...typography.button,
  },
  linkContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  linkText: {
    ...typography.body2,
  },
  link: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
