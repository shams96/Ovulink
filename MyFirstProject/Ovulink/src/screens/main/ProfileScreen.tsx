import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { colors } from '../../theme';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user, partner } = useSelector((state: RootState) => state.auth);
  const isMale = user?.gender === 'male';

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={[styles.profileImage, { backgroundColor: isMale ? colors.male : colors.female }]}>
              <Text style={styles.profileInitial}>{user?.name.charAt(0) || '?'}</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{user?.name || 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuList}>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="person-outline" size={24} color={colors.text} />
              <Text style={styles.menuText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="lock-closed-outline" size={24} color={colors.text} />
              <Text style={styles.menuText}>Change Password</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="notifications-outline" size={24} color={colors.text} />
              <Text style={styles.menuText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Partner Connection</Text>
          <View style={styles.menuList}>
            {partner ? (
              <View style={styles.partnerItem}>
                <View style={styles.partnerInfo}>
                  <View style={[styles.partnerIcon, { 
                    backgroundColor: partner.gender === 'male' ? colors.male : colors.female 
                  }]}>
                    <Text style={styles.partnerInitial}>{partner.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.partnerName}>{partner.name}</Text>
                    <Text style={styles.partnerEmail}>{partner.email}</Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Ionicons name="close-circle-outline" size={24} color={colors.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="people-outline" size={24} color={colors.text} />
                <Text style={styles.menuText}>Connect with Partner</Text>
                <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuList}>
            <View style={styles.switchItem}>
              <View style={styles.switchLabel}>
                <Ionicons name="moon-outline" size={24} color={colors.text} />
                <Text style={styles.menuText}>Dark Mode</Text>
              </View>
              <Switch 
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                value={false}
              />
            </View>
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="language-outline" size={24} color={colors.text} />
              <Text style={styles.menuText}>Language</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.valueText}>English</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.text} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="calendar-outline" size={24} color={colors.text} />
              <Text style={styles.menuText}>Date Format</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.valueText}>MM/DD/YYYY</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.text} />
              </View>
            </TouchableOpacity>
            
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuList}>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="help-circle-outline" size={24} color={colors.text} />
              <Text style={styles.menuText}>Help Center</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="document-text-outline" size={24} color={colors.text} />
              <Text style={styles.menuText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="information-circle-outline" size={24} color={colors.text} />
              <Text style={styles.menuText}>About</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  menuList: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: colors.text,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginRight: 5,
  },
  partnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  partnerInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  partnerEmail: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  logoutButton: {
    backgroundColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProfileScreen;
