import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { registerSuccess } from '../../store/authSlice';

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  GenderSelection: { email: string; password: string; name: string };
};

type GenderSelectionScreenRouteProp = RouteProp<AuthStackParamList, 'GenderSelection'>;
type GenderSelectionScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'GenderSelection'>;

const GenderSelectionScreen: React.FC = () => {
  const navigation = useNavigation<GenderSelectionScreenNavigationProp>();
  const route = useRoute<GenderSelectionScreenRouteProp>();
  const dispatch = useDispatch();
  
  const { name, email, password } = route.params;
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);

  const handleComplete = () => {
    if (!selectedGender) return;

    // For demo purposes, we'll simulate a successful registration
    // In a real app, you would make an API call here
    dispatch(
      registerSuccess({
        id: Math.random().toString(36).substring(2, 9), // Generate a random ID
        name,
        email,
        gender: selectedGender,
        birthDate: new Date().toISOString().split('T')[0], // Current date as placeholder
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Gender</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          This helps us personalize your fertility tracking experience
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.genderOption,
              selectedGender === 'female' && styles.selectedOption,
              { borderColor: colors.female }
            ]}
            onPress={() => setSelectedGender('female')}
          >
            <Ionicons
              name="female"
              size={48}
              color={selectedGender === 'female' ? colors.female : colors.text}
            />
            <Text style={[
              styles.genderText,
              selectedGender === 'female' && { color: colors.female }
            ]}>
              Female
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderOption,
              selectedGender === 'male' && styles.selectedOption,
              { borderColor: colors.male }
            ]}
            onPress={() => setSelectedGender('male')}
          >
            <Ionicons
              name="male"
              size={48}
              color={selectedGender === 'male' ? colors.male : colors.text}
            />
            <Text style={[
              styles.genderText,
              selectedGender === 'male' && { color: colors.male }
            ]}>
              Male
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={20} color={colors.text} />
          <Text style={styles.infoText}>
            Ovulink is designed for both partners. You can connect with your partner later.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, !selectedGender && styles.disabledButton]}
          onPress={handleComplete}
          disabled={!selectedGender}
        >
          <Text style={styles.buttonText}>Complete Registration</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  genderOption: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  selectedOption: {
    borderWidth: 3,
  },
  genderText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 40,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GenderSelectionScreen;
