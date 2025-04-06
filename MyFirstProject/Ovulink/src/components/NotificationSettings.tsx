import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../theme';
import { NotificationType, NotificationSettings as NotificationSettingsType, defaultNotificationSettings } from '../services/notificationService';

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
  onSave: (settings: NotificationSettingsType) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  settings = defaultNotificationSettings,
  onSave
}) => {
  const [localSettings, setLocalSettings] = useState<NotificationSettingsType>({...settings});
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const handleToggleEnabled = (value: boolean) => {
    setLocalSettings({
      ...localSettings,
      enabled: value
    });
  };
  
  const handleToggleType = (type: NotificationType, value: boolean) => {
    setLocalSettings({
      ...localSettings,
      types: {
        ...localSettings.types,
        [type]: value
      }
    });
  };
  
  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (selectedDate) {
      setLocalSettings({
        ...localSettings,
        reminderTime: {
          hour: selectedDate.getHours(),
          minute: selectedDate.getMinutes()
        }
      });
    }
  };
  
  const handleDaysInAdvanceChange = (days: number) => {
    if (days >= 1 && days <= 7) {
      setLocalSettings({
        ...localSettings,
        daysInAdvance: days
      });
    }
  };
  
  const handleSave = () => {
    onSave(localSettings);
  };
  
  // Format time for display
  const formatTime = (hour: number, minute: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const displayMinute = minute < 10 ? `0${minute}` : minute;
    return `${displayHour}:${displayMinute} ${period}`;
  };
  
  // Get notification type label
  const getTypeLabel = (type: NotificationType): string => {
    switch (type) {
      case NotificationType.OVULATION_APPROACHING:
        return 'Ovulation Approaching';
      case NotificationType.OVULATION_DAY:
        return 'Ovulation Day';
      case NotificationType.PERIOD_APPROACHING:
        return 'Period Approaching';
      case NotificationType.PERIOD_DAY:
        return 'Period Day';
      case NotificationType.DAILY_TRACKING_REMINDER:
        return 'Daily Tracking Reminder';
      case NotificationType.MEDICATION_REMINDER:
        return 'Medication Reminders';
      case NotificationType.SUPPLEMENT_REMINDER:
        return 'Supplement Reminders';
      case NotificationType.TEMPERATURE_REMINDER:
        return 'Temperature Tracking Reminder';
      case NotificationType.SPERM_TEST_REMINDER:
        return 'Sperm Test Reminders';
      case NotificationType.CUSTOM:
        return 'Custom Notifications';
      default:
        return 'Unknown';
    }
  };
  
  // Get notification type description
  const getTypeDescription = (type: NotificationType): string => {
    switch (type) {
      case NotificationType.OVULATION_APPROACHING:
        return `Notifies you ${localSettings.daysInAdvance} days before predicted ovulation`;
      case NotificationType.OVULATION_DAY:
        return 'Notifies you on your predicted ovulation day';
      case NotificationType.PERIOD_APPROACHING:
        return `Notifies you ${localSettings.daysInAdvance} days before predicted period`;
      case NotificationType.PERIOD_DAY:
        return 'Notifies you on your predicted period day';
      case NotificationType.DAILY_TRACKING_REMINDER:
        return 'Daily reminder to log your health data';
      case NotificationType.MEDICATION_REMINDER:
        return 'Reminders for taking medications';
      case NotificationType.SUPPLEMENT_REMINDER:
        return 'Reminders for taking supplements';
      case NotificationType.TEMPERATURE_REMINDER:
        return 'Daily reminder to take your basal body temperature';
      case NotificationType.SPERM_TEST_REMINDER:
        return 'Reminders for scheduled sperm tests';
      case NotificationType.CUSTOM:
        return 'Custom notifications you create';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notification Settings</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Enable Notifications</Text>
            <Switch
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={'#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggleEnabled}
              value={localSettings.enabled}
            />
          </View>
          <Text style={styles.sectionDescription}>
            Turn on to receive notifications about your fertility cycle and health reminders.
          </Text>
        </View>
        
        {localSettings.enabled && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notification Types</Text>
              
              {Object.values(NotificationType).map((type) => (
                <View key={type} style={styles.notificationTypeItem}>
                  <View style={styles.typeInfo}>
                    <Text style={styles.typeLabel}>{getTypeLabel(type)}</Text>
                    <Text style={styles.typeDescription}>{getTypeDescription(type)}</Text>
                  </View>
                  <Switch
                    trackColor={{ false: '#767577', true: colors.primary }}
                    thumbColor={'#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(value) => handleToggleType(type, value)}
                    value={localSettings.types[type]}
                  />
                </View>
              ))}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Default Reminder Time</Text>
              <TouchableOpacity 
                style={styles.timeSelector}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.timeText}>
                  {formatTime(localSettings.reminderTime.hour, localSettings.reminderTime.minute)}
                </Text>
                <Ionicons name="time-outline" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.sectionDescription}>
                This is the default time when daily notifications will be sent.
              </Text>
              
              {showTimePicker && (
                <DateTimePicker
                  value={new Date().setHours(
                    localSettings.reminderTime.hour, 
                    localSettings.reminderTime.minute
                  )}
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              )}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Days in Advance</Text>
              <View style={styles.daysSelector}>
                <TouchableOpacity 
                  style={styles.dayButton}
                  onPress={() => handleDaysInAdvanceChange(localSettings.daysInAdvance - 1)}
                  disabled={localSettings.daysInAdvance <= 1}
                >
                  <Ionicons 
                    name="remove" 
                    size={24} 
                    color={localSettings.daysInAdvance <= 1 ? colors.neutral : colors.text} 
                  />
                </TouchableOpacity>
                <Text style={styles.daysText}>{localSettings.daysInAdvance} days</Text>
                <TouchableOpacity 
                  style={styles.dayButton}
                  onPress={() => handleDaysInAdvanceChange(localSettings.daysInAdvance + 1)}
                  disabled={localSettings.daysInAdvance >= 7}
                >
                  <Ionicons 
                    name="add" 
                    size={24} 
                    color={localSettings.daysInAdvance >= 7 ? colors.neutral : colors.text} 
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.sectionDescription}>
                How many days in advance to notify you about upcoming events.
              </Text>
            </View>
          </>
        )}
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 25,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  notificationTypeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  typeInfo: {
    flex: 1,
    marginRight: 10,
  },
  typeLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 3,
  },
  typeDescription: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
    color: colors.text,
  },
  daysSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysText: {
    fontSize: 16,
    color: colors.text,
    marginHorizontal: 20,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificationSettings;
