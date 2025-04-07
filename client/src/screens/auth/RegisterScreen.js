import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { theme, spacing, typography, shadows } from '../../constants/theme';
import { registerUser, selectAuthLoading, selectAuthError } from '../../redux/slices/authSlice';

/**
 * RegisterScreen component
 * @param {object} navigation - React Navigation object
 * @returns {JSX.Element} - RegisterScreen component
 */
const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    gender: 'female', // Default to female
    birthDate: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthDate: '',
  });
  
  const [secureTextEntry, setSecureTextEntry] = useState({
    password: true,
    confirmPassword: true,
  });
  
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };
  
  const toggleSecureEntry = (field) => {
    setSecureTextEntry({
      ...secureTextEntry,
      [field]: !secureTextEntry[field],
    });
  };
  
  const validateForm = () => {
    let isValid = true;
    const errors = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    // First name validation
    if (!formData.firstName) {
      errors.firstName = 'First name is required';
      isValid = false;
    }
    
    // Last name validation
    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }
    
    // Birth date validation
    if (!formData.birthDate) {
      errors.birthDate = 'Birth date is required';
      isValid = false;
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.birthDate)) {
      errors.birthDate = 'Birth date must be in YYYY-MM-DD format';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleRegister = () => {
    if (validateForm()) {
      dispatch(registerUser(formData));
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
          </View>
          
          <View style={styles.form}>
            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              error={!!formErrors.email}
            />
            {formErrors.email ? (
              <HelperText type="error" visible={!!formErrors.email}>
                {formErrors.email}
              </HelperText>
            ) : null}
            
            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              mode="outlined"
              secureTextEntry={secureTextEntry.password}
              style={styles.input}
              error={!!formErrors.password}
              right={
                <TextInput.Icon
                  icon={secureTextEntry.password ? 'eye-off' : 'eye'}
                  onPress={() => toggleSecureEntry('password')}
                />
              }
            />
            {formErrors.password ? (
              <HelperText type="error" visible={!!formErrors.password}>
                {formErrors.password}
              </HelperText>
            ) : null}
            
            <TextInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              mode="outlined"
              secureTextEntry={secureTextEntry.confirmPassword}
              style={styles.input}
              error={!!formErrors.confirmPassword}
              right={
                <TextInput.Icon
                  icon={secureTextEntry.confirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => toggleSecureEntry('confirmPassword')}
                />
              }
            />
            {formErrors.confirmPassword ? (
              <HelperText type="error" visible={!!formErrors.confirmPassword}>
                {formErrors.confirmPassword}
              </HelperText>
            ) : null}
            
            <TextInput
              label="First Name"
              value={formData.firstName}
              onChangeText={(text) => handleInputChange('firstName', text)}
              mode="outlined"
              style={styles.input}
              error={!!formErrors.firstName}
            />
            {formErrors.firstName ? (
              <HelperText type="error" visible={!!formErrors.firstName}>
                {formErrors.firstName}
              </HelperText>
            ) : null}
            
            <TextInput
              label="Last Name"
              value={formData.lastName}
              onChangeText={(text) => handleInputChange('lastName', text)}
              mode="outlined"
              style={styles.input}
              error={!!formErrors.lastName}
            />
            {formErrors.lastName ? (
              <HelperText type="error" visible={!!formErrors.lastName}>
                {formErrors.lastName}
              </HelperText>
            ) : null}
            
            <TextInput
              label="Birth Date (YYYY-MM-DD)"
              value={formData.birthDate}
              onChangeText={(text) => handleInputChange('birthDate', text)}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              error={!!formErrors.birthDate}
            />
            {formErrors.birthDate ? (
              <HelperText type="error" visible={!!formErrors.birthDate}>
                {formErrors.birthDate}
              </HelperText>
            ) : null}
            
            <Text style={styles.sectionTitle}>Gender</Text>
            <RadioButton.Group
              onValueChange={(value) => handleInputChange('gender', value)}
              value={formData.gender}
            >
              <View style={styles.radioContainer}>
                <RadioButton.Item
                  label="Female"
                  value="female"
                  color={theme.colors.primary}
                  style={styles.radioButton}
                />
                <RadioButton.Item
                  label="Male"
                  value="male"
                  color={theme.colors.primary}
                  style={styles.radioButton}
                />
              </View>
            </RadioButton.Group>
            
            {error ? (
              <HelperText type="error" visible={!!error} style={styles.serverError}>
                {error}
              </HelperText>
            ) : null}
            
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              loading={isLoading}
              disabled={isLoading}
            >
              Register
            </Button>
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    ...typography.h4,
    marginLeft: spacing.md,
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle1,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flex: 1,
  },
  button: {
    marginTop: spacing.lg,
    paddingVertical: spacing.xs,
  },
  serverError: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  loginText: {
    ...typography.body2,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    ...typography.body2,
    color: theme.colors.primary,
    marginLeft: spacing.xs,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
