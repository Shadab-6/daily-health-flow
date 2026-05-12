// App.tsx
import React, { useEffect } from 'react';
import { Platform, UIManager } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import {
  initNotifications,
  setupNotificationChannel,
  requestNotificationPermission,
  scheduleAllReminders,
} from './src/utils/notifications';
import { loadSettings } from './src/utils/storage';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App: React.FC = () => {
  useEffect(() => {
    const init = async () => {
      // Initialize push notifications
      initNotifications();

      // Create Android notification channel
      if (Platform.OS === 'android') {
        setupNotificationChannel();
      }

      // Request permissions and schedule reminders if enabled
      const settings = await loadSettings();
      if (settings.remindersEnabled) {
        const granted = await requestNotificationPermission();
        if (granted) {
          scheduleAllReminders();
        }
      }
    };

    init();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
