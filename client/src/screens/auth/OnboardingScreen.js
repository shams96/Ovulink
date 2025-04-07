import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

import { theme, spacing, typography, shadows } from '../../constants/theme';
import { completeOnboarding } from '../../redux/slices/authSlice';

const { width } = Dimensions.get('window');

/**
 * OnboardingScreen component
 * @param {object} navigation - React Navigation object
 * @returns {JSX.Element} - OnboardingScreen component
 */
const OnboardingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const translateX = useSharedValue(0);
  
  const onboardingData = [
    {
      title: 'Welcome to Ovulink',
      description: 'Your personal fertility tracking companion designed to help you understand your body better.',
      image: require('../../assets/onboarding-1.png'), // Placeholder - you'll need to create these assets
    },
    {
      title: 'Track Your Cycle',
      description: 'Log your menstrual cycle, symptoms, and fertility signs to get personalized insights.',
      image: require('../../assets/onboarding-2.png'),
    },
    {
      title: 'Partner Sharing',
      description: 'Share your fertility data with your partner to keep them informed and involved.',
      image: require('../../assets/onboarding-3.png'),
    },
    {
      title: 'Educational Resources',
      description: 'Access a wealth of articles and resources about fertility and reproductive health.',
      image: require('../../assets/onboarding-4.png'),
    },
  ];
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });
  
  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      const nextPage = currentPage + 1;
      translateX.value = withTiming(-nextPage * width, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      setCurrentPage(nextPage);
    } else {
      handleGetStarted();
    }
  };
  
  const handleBack = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      translateX.value = withTiming(-prevPage * width, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      setCurrentPage(prevPage);
    }
  };
  
  const handleSkip = () => {
    handleGetStarted();
  };
  
  const handleGetStarted = () => {
    // In a real app, this would dispatch an action to mark onboarding as complete
    dispatch(completeOnboarding());
    navigation.navigate('Login');
  };
  
  const goToPage = (pageIndex) => {
    translateX.value = withTiming(-pageIndex * width, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    setCurrentPage(pageIndex);
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          {currentPage > 0 ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.backButton} />
          )}
          
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
        
        <Animated.View style={[styles.slidesContainer, animatedStyle]}>
          {onboardingData.map((item, index) => (
            <View key={index} style={styles.slide}>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          ))}
        </Animated.View>
        
        <View style={styles.footer}>
          <View style={styles.pagination}>
            {onboardingData.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.paginationDot,
                  currentPage === index && styles.paginationDotActive,
                ]}
                onPress={() => goToPage(index)}
              />
            ))}
          </View>
          
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.button}
          >
            {currentPage < onboardingData.length - 1 ? 'Next' : 'Get Started'}
          </Button>
        </View>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
    width: 60,
  },
  backButtonText: {
    ...typography.button,
    color: theme.colors.primary,
  },
  skipButton: {
    padding: spacing.xs,
  },
  skipButtonText: {
    ...typography.button,
    color: theme.colors.primary,
  },
  slidesContainer: {
    flex: 1,
    flexDirection: 'row',
    width: width * onboardingData.length,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: 'contain',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h4,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body1,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  footer: {
    padding: spacing.lg,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.grey[300],
    marginHorizontal: spacing.xs,
  },
  paginationDotActive: {
    backgroundColor: theme.colors.primary,
    width: 20,
  },
  button: {
    paddingVertical: spacing.xs,
  },
});

export default OnboardingScreen;
