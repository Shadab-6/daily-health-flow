// src/utils/notifications.ts
import PushNotification, { Importance } from 'react-native-push-notification';
import { Platform, PermissionsAndroid } from 'react-native';
import { DAILY_TASKS } from '../data/appData';

const CHANNEL_ID = 'daily-health-flow-reminders';
const CHANNEL_NAME = 'Hydration & Health Reminders';

export const setupNotificationChannel = (): void => {
  PushNotification.createChannel(
    {
      channelId: CHANNEL_ID,
      channelName: CHANNEL_NAME,
      channelDescription: 'Daily reminders for Sabiya to stay hydrated and healthy',
      playSound: true,
      soundName: 'default',
      importance: Importance.HIGH,
      vibrate: true,
    },
    (created) => console.log(`Notification channel created: ${created}`),
  );
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Stay Healthy with Reminders',
          message:
            'Daily Health Flow needs permission to send you water and exercise reminders to help Sabiya stay on track!',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Not Now',
          buttonPositive: 'Allow Reminders',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }
  return true;
};

export const scheduleAllReminders = (): void => {
  // Cancel existing reminders first
  PushNotification.cancelAllLocalNotifications();

  const waterTasks = DAILY_TASKS.filter(t => t.reminderTime);

  waterTasks.forEach((task, index) => {
    if (!task.reminderTime) return;

    const [hours, minutes] = task.reminderTime.split(':').map(Number);
    const now = new Date();
    const reminderDate = new Date();
    reminderDate.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (reminderDate <= now) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    PushNotification.localNotificationSchedule({
      channelId: CHANNEL_ID,
      id: 100 + index,
      title: '💧 Time to Hydrate, Sabiya!',
      message: task.sub,
      date: reminderDate,
      repeatType: 'day',
      allowWhileIdle: true,
      importance: 'high',
      priority: 'high',
      vibrate: true,
      vibration: 500,
      playSound: true,
      soundName: 'default',
      actions: ['✓ Mark as Drank', 'Snooze 15 min'],
      invokeApp: true,
      userInfo: { taskId: task.id },
      // Android specific
      bigText: `${task.sub}\n\nTap "Mark as Drank" to log your water intake for today.`,
      subText: 'Daily Health Flow',
      color: '#70E000',
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
    });
  });

  // Morning reminder
  const morning = new Date();
  morning.setHours(7, 0, 0, 0);
  if (morning <= new Date()) morning.setDate(morning.getDate() + 1);

  PushNotification.localNotificationSchedule({
    channelId: CHANNEL_ID,
    id: 200,
    title: '🌿 Good Morning, Sabiya!',
    message: 'Start your day right — drink your first glass of water now!',
    date: morning,
    repeatType: 'day',
    allowWhileIdle: true,
    importance: 'high',
    vibrate: true,
    playSound: true,
    soundName: 'default',
    color: '#70E000',
  });

  console.log('All reminders scheduled successfully');
};

export const cancelAllReminders = (): void => {
  PushNotification.cancelAllLocalNotifications();
};

export const scheduleSnoozeReminder = (taskLabel: string): void => {
  const snoozeDate = new Date(Date.now() + 15 * 60 * 1000);
  PushNotification.localNotificationSchedule({
    channelId: CHANNEL_ID,
    id: 999,
    title: '💧 Snooze Reminder — Sabiya',
    message: `Don't forget: ${taskLabel}`,
    date: snoozeDate,
    allowWhileIdle: true,
    importance: 'high',
    vibrate: true,
    playSound: true,
    color: '#70E000',
  });
};

export const initNotifications = (): void => {
  PushNotification.configure({
    onRegister: (token) => {
      console.log('TOKEN:', token);
    },
    onNotification: (notification) => {
      console.log('NOTIFICATION:', notification);
      if (notification.action === 'Snooze 15 min') {
        scheduleSnoozeReminder(notification.message);
      }
    },
    onAction: (notification) => {
      console.log('ACTION:', notification.action);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });
};
