import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { Text, Card, Button, Avatar, Divider, Dialog, Portal, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { theme, spacing, typography, shadows } from '../../constants/theme';
import { selectUser, logout, updateUserProfile } from '../../redux/slices/authSlice';
import LoadingScreen from '../LoadingScreen';

/**
 * ProfileScreen component
 * @param {object} navigation - React Navigation object
 * @returns {JSX.Element} - ProfileScreen component
 */
const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isPartnerLinkVisible, setIsPartnerLinkVisible] = useState(false);
  const [isDeleteAccountVisible, setIsDeleteAccountVisible] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [partnerEmail, setPartnerEmail] = useState('');
  const [notifications, setNotifications] = useState({
    cycleReminders: true,
    fertileWindow: true,
    appointments: true,
    partnerUpdates: true,
  });
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  const handleUpdateProfile = () => {
    // In a real app, this would dispatch an action to update the user profile
    dispatch(updateUserProfile(profileData));
    setIsEditProfileVisible(false);
  };
  
  const handleLinkPartner = () => {
    // In a real app, this would send an invitation to the partner's email
    Alert.alert(
      'Partner Invitation Sent',
      `An invitation has been sent to ${partnerEmail}. They will need to accept it to link accounts.`,
      [{ text: 'OK', onPress: () => setIsPartnerLinkVisible(false) }]
    );
  };
  
  const handleDeleteAccount = () => {
    // In a real app, this would dispatch an action to delete the user account
    Alert.alert(
      'Account Deleted',
      'Your account has been successfully deleted.',
      [{ text: 'OK', onPress: () => dispatch(logout()) }]
    );
  };
  
  const toggleNotification = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };
  
  if (!user) {
    return <LoadingScreen />;
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        
        {/* User Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar.Text
              size={80}
              label={`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
              backgroundColor={theme.colors.primary}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{`${user.firstName} ${user.lastName}`}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <Text style={styles.profileDetail}>
                {user.gender === 'female' ? 'Female' : 'Male'} • {user.birthDate}
              </Text>
            </View>
          </View>
          
          <Button
            mode="outlined"
            onPress={() => setIsEditProfileVisible(true)}
            style={styles.editButton}
            icon="pencil"
          >
            Edit Profile
          </Button>
        </Card>
        
        {/* Partner Section */}
        <Card style={styles.sectionCard}>
          <Card.Title title="Partner" />
          <Card.Content>
            {user.partnerId ? (
              <View style={styles.partnerInfo}>
                <Avatar.Text
                  size={50}
                  label="JP"
                  backgroundColor={theme.colors.secondary}
                />
                <View style={styles.partnerDetails}>
                  <Text style={styles.partnerName}>John Partner</Text>
                  <Text style={styles.partnerEmail}>john.partner@example.com</Text>
                </View>
                <Button
                  mode="text"
                  onPress={() => Alert.alert('Unlink Partner', 'Are you sure you want to unlink your partner?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Unlink', style: 'destructive' },
                  ])}
                  color={theme.colors.error}
                >
                  Unlink
                </Button>
              </View>
            ) : (
              <View style={styles.noPartner}>
                <Text style={styles.noPartnerText}>
                  Link with your partner to share fertility data and keep them informed.
                </Text>
                <Button
                  mode="contained"
                  onPress={() => setIsPartnerLinkVisible(true)}
                  style={styles.linkButton}
                  icon="link"
                >
                  Link Partner
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Notifications Section */}
        <Card style={styles.sectionCard}>
          <Card.Title title="Notifications" />
          <Card.Content>
            <View style={styles.notificationItem}>
              <Text style={styles.notificationText}>Cycle Reminders</Text>
              <Switch
                value={notifications.cycleReminders}
                onValueChange={() => toggleNotification('cycleReminders')}
                color={theme.colors.primary}
              />
            </View>
            <Divider style={styles.divider} />
            
            <View style={styles.notificationItem}>
              <Text style={styles.notificationText}>Fertile Window Alerts</Text>
              <Switch
                value={notifications.fertileWindow}
                onValueChange={() => toggleNotification('fertileWindow')}
                color={theme.colors.primary}
              />
            </View>
            <Divider style={styles.divider} />
            
            <View style={styles.notificationItem}>
              <Text style={styles.notificationText}>Appointment Reminders</Text>
              <Switch
                value={notifications.appointments}
                onValueChange={() => toggleNotification('appointments')}
                color={theme.colors.primary}
              />
            </View>
            <Divider style={styles.divider} />
            
            <View style={styles.notificationItem}>
              <Text style={styles.notificationText}>Partner Updates</Text>
              <Switch
                value={notifications.partnerUpdates}
                onValueChange={() => toggleNotification('partnerUpdates')}
                color={theme.colors.primary}
              />
            </View>
          </Card.Content>
        </Card>
        
        {/* Account Section */}
        <Card style={styles.sectionCard}>
          <Card.Title title="Account" />
          <Card.Content>
            <TouchableOpacity
              style={styles.accountItem}
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              <Ionicons name="shield-checkmark-outline" size={24} color={theme.colors.textPrimary} />
              <Text style={styles.accountItemText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <Divider style={styles.divider} />
            
            <TouchableOpacity
              style={styles.accountItem}
              onPress={() => navigation.navigate('TermsOfService')}
            >
              <Ionicons name="document-text-outline" size={24} color={theme.colors.textPrimary} />
              <Text style={styles.accountItemText}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <Divider style={styles.divider} />
            
            <TouchableOpacity
              style={styles.accountItem}
              onPress={() => setIsDeleteAccountVisible(true)}
            >
              <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
              <Text style={[styles.accountItemText, { color: theme.colors.error }]}>Delete Account</Text>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <Divider style={styles.divider} />
            
            <TouchableOpacity
              style={styles.accountItem}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color={theme.colors.textPrimary} />
              <Text style={styles.accountItemText}>Logout</Text>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </Card.Content>
        </Card>
        
        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Ovulink v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2025 Ovulink. All rights reserved.</Text>
        </View>
      </ScrollView>
      
      {/* Edit Profile Dialog */}
      <Portal>
        <Dialog visible={isEditProfileVisible} onDismiss={() => setIsEditProfileVisible(false)}>
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="First Name"
              value={profileData.firstName}
              onChangeText={(text) => setProfileData({ ...profileData, firstName: text })}
              mode="outlined"
              style={styles.dialogInput}
            />
            
            <TextInput
              label="Last Name"
              value={profileData.lastName}
              onChangeText={(text) => setProfileData({ ...profileData, lastName: text })}
              mode="outlined"
              style={styles.dialogInput}
            />
            
            <TextInput
              label="Email"
              value={profileData.email}
              onChangeText={(text) => setProfileData({ ...profileData, email: text })}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsEditProfileVisible(false)}>Cancel</Button>
            <Button onPress={handleUpdateProfile}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Link Partner Dialog */}
      <Portal>
        <Dialog visible={isPartnerLinkVisible} onDismiss={() => setIsPartnerLinkVisible(false)}>
          <Dialog.Title>Link Partner</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Enter your partner's email address to send them an invitation to link accounts.
            </Text>
            <TextInput
              label="Partner's Email"
              value={partnerEmail}
              onChangeText={setPartnerEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsPartnerLinkVisible(false)}>Cancel</Button>
            <Button onPress={handleLinkPartner}>Send Invitation</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Delete Account Dialog */}
      <Portal>
        <Dialog visible={isDeleteAccountVisible} onDismiss={() => setIsDeleteAccountVisible(false)}>
          <Dialog.Title>Delete Account</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDeleteAccountVisible(false)}>Cancel</Button>
            <Button onPress={handleDeleteAccount} color={theme.colors.error}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h4,
  },
  profileCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
    ...shadows.medium,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  profileInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  profileName: {
    ...typography.h5,
  },
  profileEmail: {
    ...typography.body2,
    color: theme.colors.textSecondary,
  },
  profileDetail: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    marginTop: spacing.xs,
  },
  editButton: {
    borderRadius: 8,
  },
  sectionCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    ...shadows.small,
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerDetails: {
    marginLeft: spacing.md,
    flex: 1,
  },
  partnerName: {
    ...typography.subtitle1,
  },
  partnerEmail: {
    ...typography.body2,
    color: theme.colors.textSecondary,
  },
  noPartner: {
    alignItems: 'center',
    padding: spacing.md,
  },
  noPartnerText: {
    ...typography.body2,
    textAlign: 'center',
    marginBottom: spacing.md,
    color: theme.colors.textSecondary,
  },
  linkButton: {
    borderRadius: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  notificationText: {
    ...typography.body1,
  },
  divider: {
    marginVertical: spacing.xs,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  accountItemText: {
    ...typography.body1,
    flex: 1,
    marginLeft: spacing.md,
  },
  appInfo: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  appVersion: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
  appCopyright: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    marginTop: spacing.xs,
  },
  dialogInput: {
    marginBottom: spacing.sm,
  },
  dialogText: {
    ...typography.body2,
    marginBottom: spacing.md,
  },
});

export default ProfileScreen;
