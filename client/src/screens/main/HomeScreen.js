import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Avatar, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { theme, spacing, typography, shadows } from '../../constants/theme';
import { selectUser } from '../../redux/slices/authSlice';
import LoadingScreen from '../LoadingScreen';

/**
 * Home screen component
 * @param {object} navigation - React Navigation object
 * @returns {JSX.Element} - Home screen component
 */
const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isFemale = user?.gender === 'female';
  
  // Placeholder data - in a real app, this would come from Redux
  const fertileWindowActive = true;
  const daysUntilOvulation = 2;
  const partnerConnected = true;
  const partnerName = 'Alex';
  const upcomingAppointments = [
    { id: '1', title: 'Doctor Appointment', date: '2025-04-15', time: '14:30' },
  ];
  const recentEducationArticles = [
    { id: '1', title: 'Understanding Your Fertility Window', category: 'Fertility' },
    { id: '2', title: 'Nutrition Tips for Conception', category: 'Nutrition' },
  ];
  
  if (!user) {
    return <LoadingScreen />;
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user.displayName}</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar.Text 
              size={50} 
              label={user.displayName?.substring(0, 2).toUpperCase() || 'U'} 
              backgroundColor={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
        
        {/* Fertility Status Card */}
        <Card style={[styles.card, styles.statusCard]}>
          <Card.Content>
            <View style={styles.statusHeader}>
              <Text style={styles.cardTitle}>Fertility Status</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate(isFemale ? 'FemaleHealth' : 'MaleHealth')}
              >
                <Text style={styles.seeAll}>See Details</Text>
              </TouchableOpacity>
            </View>
            
            {isFemale ? (
              <View style={styles.femaleStatus}>
                {fertileWindowActive ? (
                  <View style={styles.alertContainer}>
                    <Ionicons name="alert-circle" size={24} color={theme.colors.fertile} />
                    <Text style={[styles.alertText, { color: theme.colors.fertile }]}>
                      Fertile Window Active
                    </Text>
                  </View>
                ) : null}
                
                <Text style={styles.statusText}>
                  {daysUntilOvulation === 0 
                    ? 'Ovulation predicted today' 
                    : `Ovulation predicted in ${daysUntilOvulation} days`}
                </Text>
                
                <Button 
                  mode="contained" 
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('FemaleHealth', { screen: 'CycleTracking' })}
                >
                  Track Today
                </Button>
              </View>
            ) : (
              <View style={styles.maleStatus}>
                <Text style={styles.statusText}>
                  Track your sperm health to optimize fertility
                </Text>
                
                <Button 
                  mode="contained" 
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('MaleHealth', { screen: 'SpermHealth' })}
                >
                  Record Results
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Partner Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Partner</Text>
            
            {partnerConnected ? (
              <View style={styles.partnerConnected}>
                <View style={styles.partnerInfo}>
                  <Avatar.Text 
                    size={40} 
                    label={partnerName.substring(0, 2).toUpperCase()} 
                    backgroundColor={isFemale ? theme.colors.male : theme.colors.female}
                  />
                  <View style={styles.partnerDetails}>
                    <Text style={styles.partnerName}>{partnerName}</Text>
                    <Text style={styles.partnerStatus}>Connected</Text>
                  </View>
                </View>
                
                <Button 
                  mode="outlined" 
                  style={styles.partnerButton}
                  onPress={() => navigation.navigate('Calendar')}
                >
                  View Shared Calendar
                </Button>
              </View>
            ) : (
              <View style={styles.partnerNotConnected}>
                <Text style={styles.partnerPrompt}>
                  Connect with your partner to sync calendars and track fertility together
                </Text>
                
                <Button 
                  mode="contained" 
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('Profile')}
                >
                  Connect Partner
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Upcoming Appointments */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.cardTitle}>Upcoming Appointments</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <View key={appointment.id} style={styles.appointmentItem}>
                  <View style={styles.appointmentIcon}>
                    <Ionicons name="calendar" size={24} color={theme.colors.primary} />
                  </View>
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                    <Text style={styles.appointmentDate}>
                      {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {appointment.time}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No upcoming appointments</Text>
            )}
            
            <Button 
              mode="outlined" 
              style={styles.addButton}
              icon="plus"
              onPress={() => navigation.navigate('Calendar')}
            >
              Add Appointment
            </Button>
          </Card.Content>
        </Card>
        
        {/* Educational Content */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.cardTitle}>Educational Content</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Education')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {recentEducationArticles.map((article) => (
              <TouchableOpacity 
                key={article.id}
                style={styles.articleItem}
                onPress={() => navigation.navigate('Education', { articleId: article.id })}
              >
                <View style={styles.articleContent}>
                  <Text style={styles.articleCategory}>{article.category}</Text>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={theme.colors.grey[500]} />
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
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
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.h2,
  },
  date: {
    ...typography.body2,
    color: theme.colors.textSecondary,
  },
  card: {
    marginBottom: spacing.lg,
    borderRadius: 12,
    ...shadows.medium,
  },
  statusCard: {
    backgroundColor: isFemale => isFemale ? theme.colors.female + '10' : theme.colors.male + '10',
    borderWidth: 1,
    borderColor: isFemale => isFemale ? theme.colors.female + '30' : theme.colors.male + '30',
  },
  cardTitle: {
    ...typography.h4,
    marginBottom: spacing.sm,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAll: {
    ...typography.button,
    color: theme.colors.primary,
  },
  femaleStatus: {
    marginTop: spacing.sm,
  },
  maleStatus: {
    marginTop: spacing.sm,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  alertText: {
    ...typography.subtitle1,
    marginLeft: spacing.xs,
  },
  statusText: {
    ...typography.body1,
    marginBottom: spacing.md,
  },
  actionButton: {
    marginTop: spacing.sm,
  },
  partnerConnected: {
    marginTop: spacing.sm,
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  partnerDetails: {
    marginLeft: spacing.md,
  },
  partnerName: {
    ...typography.subtitle1,
  },
  partnerStatus: {
    ...typography.body2,
    color: theme.colors.success,
  },
  partnerButton: {
    marginTop: spacing.xs,
  },
  partnerNotConnected: {
    marginTop: spacing.sm,
  },
  partnerPrompt: {
    ...typography.body1,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  appointmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentTitle: {
    ...typography.subtitle1,
  },
  appointmentDate: {
    ...typography.body2,
    color: theme.colors.textSecondary,
  },
  emptyText: {
    ...typography.body1,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginVertical: spacing.md,
  },
  addButton: {
    marginTop: spacing.md,
  },
  articleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  articleContent: {
    flex: 1,
  },
  articleCategory: {
    ...typography.caption,
    color: theme.colors.primary,
    marginBottom: spacing.xs,
  },
  articleTitle: {
    ...typography.subtitle1,
  },
});

export default HomeScreen;
