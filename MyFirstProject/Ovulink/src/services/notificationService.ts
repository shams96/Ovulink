import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Cycle, DailyLog } from '../types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Notification types
export enum NotificationType {
  OVULATION_APPROACHING = 'ovulation_approaching',
  OVULATION_DAY = 'ovulation_day',
  PERIOD_APPROACHING = 'period_approaching',
  PERIOD_DAY = 'period_day',
  DAILY_TRACKING_REMINDER = 'daily_tracking_reminder',
  MEDICATION_REMINDER = 'medication_reminder',
  SUPPLEMENT_REMINDER = 'supplement_reminder',
  TEMPERATURE_REMINDER = 'temperature_reminder',
  SPERM_TEST_REMINDER = 'sperm_test_reminder',
  CUSTOM = 'custom',
}

// Notification settings
export interface NotificationSettings {
  enabled: boolean;
  types: {
    [key in NotificationType]: boolean;
  };
  reminderTime: {
    hour: number;
    minute: number;
  };
  daysInAdvance: number;
}

// Default notification settings
export const defaultNotificationSettings: NotificationSettings = {
  enabled: true,
  types: {
    [NotificationType.OVULATION_APPROACHING]: true,
    [NotificationType.OVULATION_DAY]: true,
    [NotificationType.PERIOD_APPROACHING]: true,
    [NotificationType.PERIOD_DAY]: true,
    [NotificationType.DAILY_TRACKING_REMINDER]: true,
    [NotificationType.MEDICATION_REMINDER]: true,
    [NotificationType.SUPPLEMENT_REMINDER]: true,
    [NotificationType.TEMPERATURE_REMINDER]: true,
    [NotificationType.SPERM_TEST_REMINDER]: true,
    [NotificationType.CUSTOM]: true,
  },
  reminderTime: {
    hour: 8,
    minute: 0,
  },
  daysInAdvance: 2,
};

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
};

// Schedule a notification
export const scheduleNotification = async (
  title: string,
  body: string,
  trigger: Notifications.NotificationTriggerInput,
  data?: Record<string, unknown>,
  type: NotificationType = NotificationType.CUSTOM
): Promise<string> => {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { ...data, type },
    },
    trigger,
  });
};

// Cancel a notification
export const cancelNotification = async (notificationId: string): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};

// Cancel all notifications
export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// Get all scheduled notifications
export const getAllScheduledNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
  return await Notifications.getAllScheduledNotificationsAsync();
};

// Schedule fertility-related notifications based on cycle data
export const scheduleFertilityNotifications = async (
  cycle: Cycle,
  settings: NotificationSettings
): Promise<string[]> => {
  if (!settings.enabled) {
    return [];
  }

  const notificationIds: string[] = [];

  // Only schedule if we have predicted dates
  if (!cycle.predictedOvulationDate || !cycle.predictedPeriodDate) {
    return notificationIds;
  }

  const now = new Date();
  const ovulationDate = new Date(cycle.predictedOvulationDate);
  const periodDate = new Date(cycle.predictedPeriodDate);

  // Schedule ovulation approaching notification
  if (settings.types[NotificationType.OVULATION_APPROACHING]) {
    const ovulationApproachingDate = new Date(ovulationDate);
    ovulationApproachingDate.setDate(ovulationApproachingDate.getDate() - settings.daysInAdvance);
    ovulationApproachingDate.setHours(settings.reminderTime.hour, settings.reminderTime.minute, 0, 0);

    if (ovulationApproachingDate > now) {
      const id = await scheduleNotification(
        'Ovulation Approaching',
        `Your predicted ovulation is in ${settings.daysInAdvance} days. This is a good time to start planning.`,
        { date: ovulationApproachingDate },
        { cycleId: cycle.id },
        NotificationType.OVULATION_APPROACHING
      );
      notificationIds.push(id);
    }
  }

  // Schedule ovulation day notification
  if (settings.types[NotificationType.OVULATION_DAY]) {
    const ovulationReminderDate = new Date(ovulationDate);
    ovulationReminderDate.setHours(settings.reminderTime.hour, settings.reminderTime.minute, 0, 0);

    if (ovulationReminderDate > now) {
      const id = await scheduleNotification(
        'Ovulation Day',
        'Today is your predicted ovulation day. This is your most fertile day.',
        { date: ovulationReminderDate },
        { cycleId: cycle.id },
        NotificationType.OVULATION_DAY
      );
      notificationIds.push(id);
    }
  }

  // Schedule period approaching notification
  if (settings.types[NotificationType.PERIOD_APPROACHING]) {
    const periodApproachingDate = new Date(periodDate);
    periodApproachingDate.setDate(periodApproachingDate.getDate() - settings.daysInAdvance);
    periodApproachingDate.setHours(settings.reminderTime.hour, settings.reminderTime.minute, 0, 0);

    if (periodApproachingDate > now) {
      const id = await scheduleNotification(
        'Period Approaching',
        `Your period is predicted to start in ${settings.daysInAdvance} days.`,
        { date: periodApproachingDate },
        { cycleId: cycle.id },
        NotificationType.PERIOD_APPROACHING
      );
      notificationIds.push(id);
    }
  }

  // Schedule period day notification
  if (settings.types[NotificationType.PERIOD_DAY]) {
    const periodReminderDate = new Date(periodDate);
    periodReminderDate.setHours(settings.reminderTime.hour, settings.reminderTime.minute, 0, 0);

    if (periodReminderDate > now) {
      const id = await scheduleNotification(
        'Period Day',
        'Your period is predicted to start today.',
        { date: periodReminderDate },
        { cycleId: cycle.id },
        NotificationType.PERIOD_DAY
      );
      notificationIds.push(id);
    }
  }

  return notificationIds;
};

// Schedule daily tracking reminder
export const scheduleDailyTrackingReminder = async (
  settings: NotificationSettings,
  isMale: boolean = false
): Promise<string | null> => {
  if (!settings.enabled || !settings.types[NotificationType.DAILY_TRACKING_REMINDER]) {
    return null;
  }

  // Schedule for tomorrow at the specified time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(settings.reminderTime.hour, settings.reminderTime.minute, 0, 0);

  return await scheduleNotification(
    'Daily Tracking Reminder',
    isMale
      ? 'Remember to log your health data today to improve fertility insights.'
      : 'Remember to log your cycle and health data today to improve fertility predictions.',
    {
      hour: settings.reminderTime.hour,
      minute: settings.reminderTime.minute,
      repeats: true,
    },
    {},
    NotificationType.DAILY_TRACKING_REMINDER
  );
};

// Schedule temperature tracking reminder
export const scheduleTemperatureReminder = async (
  settings: NotificationSettings
): Promise<string | null> => {
  if (!settings.enabled || !settings.types[NotificationType.TEMPERATURE_REMINDER]) {
    return null;
  }

  // Set reminder for early morning (default to 6:00 AM regardless of general reminder time)
  return await scheduleNotification(
    'Temperature Tracking Reminder',
    'Remember to take your basal body temperature before getting out of bed.',
    {
      hour: 6,
      minute: 0,
      repeats: true,
    },
    {},
    NotificationType.TEMPERATURE_REMINDER
  );
};

// Schedule medication reminder
export const scheduleMedicationReminder = async (
  medicationName: string,
  hour: number,
  minute: number,
  settings: NotificationSettings
): Promise<string | null> => {
  if (!settings.enabled || !settings.types[NotificationType.MEDICATION_REMINDER]) {
    return null;
  }

  return await scheduleNotification(
    'Medication Reminder',
    `Time to take your ${medicationName}.`,
    {
      hour,
      minute,
      repeats: true,
    },
    { medicationName },
    NotificationType.MEDICATION_REMINDER
  );
};

// Schedule supplement reminder
export const scheduleSupplementReminder = async (
  supplementName: string,
  hour: number,
  minute: number,
  settings: NotificationSettings
): Promise<string | null> => {
  if (!settings.enabled || !settings.types[NotificationType.SUPPLEMENT_REMINDER]) {
    return null;
  }

  return await scheduleNotification(
    'Supplement Reminder',
    `Time to take your ${supplementName}.`,
    {
      hour,
      minute,
      repeats: true,
    },
    { supplementName },
    NotificationType.SUPPLEMENT_REMINDER
  );
};

// Schedule sperm test reminder (for male users)
export const scheduleSpermTestReminder = async (
  date: Date,
  settings: NotificationSettings
): Promise<string | null> => {
  if (!settings.enabled || !settings.types[NotificationType.SPERM_TEST_REMINDER]) {
    return null;
  }

  const reminderDate = new Date(date);
  reminderDate.setHours(settings.reminderTime.hour, settings.reminderTime.minute, 0, 0);

  return await scheduleNotification(
    'Sperm Test Reminder',
    'Reminder to complete your scheduled sperm test today.',
    { date: reminderDate },
    {},
    NotificationType.SPERM_TEST_REMINDER
  );
};

// Schedule a custom notification
export const scheduleCustomNotification = async (
  title: string,
  body: string,
  date: Date,
  settings: NotificationSettings
): Promise<string | null> => {
  if (!settings.enabled || !settings.types[NotificationType.CUSTOM]) {
    return null;
  }

  return await scheduleNotification(
    title,
    body,
    { date },
    {},
    NotificationType.CUSTOM
  );
};

export default {
  requestNotificationPermissions,
  scheduleNotification,
  cancelNotification,
  cancelAllNotifications,
  getAllScheduledNotifications,
  scheduleFertilityNotifications,
  scheduleDailyTrackingReminder,
  scheduleTemperatureReminder,
  scheduleMedicationReminder,
  scheduleSupplementReminder,
  scheduleSpermTestReminder,
  scheduleCustomNotification,
  defaultNotificationSettings,
};
