// src/navigation/AppNavigator.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeScreen } from '../screens/HomeScreen';
import { KitchenScreen } from '../screens/KitchenScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ExerciseScreen } from '../screens/ExerciseScreen';

import { checkAndResetTasks, TaskState } from '../utils/storage';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../utils/theme';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const TAB_ICONS: Record<string, string> = {
  Home: '🏠',
  Kitchen: '🍽',
  Progress: '📊',
  Settings: '⚙️',
};

const TAB_LABELS: Record<string, string> = {
  Home: 'Home',
  Kitchen: 'Kitchen',
  Progress: 'Progress',
  Settings: 'Settings',
};

// Shared task state passed via props between Home and Exercise
interface SharedState {
  taskState: TaskState;
  setTaskState: React.Dispatch<React.SetStateAction<TaskState>>;
}

const HomeStackNavigator: React.FC<SharedState> = ({ taskState, setTaskState }) => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeMain">
      {() => <HomeScreen taskState={taskState} setTaskState={setTaskState} />}
    </HomeStack.Screen>
    <HomeStack.Screen
      name="Exercise"
      component={ExerciseScreen}
      options={{
        headerShown: true,
        title: 'Exercise',
        headerStyle: { backgroundColor: COLORS.white },
        headerTintColor: COLORS.primaryDark,
        headerTitleStyle: { fontWeight: '700' },
        presentation: 'modal',
      }}
    />
  </HomeStack.Navigator>
);

const CustomTabBar: React.FC<{
  state: any;
  descriptors: any;
  navigation: any;
}> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const icon = TAB_ICONS[route.name] ?? '⭕';
        const label = TAB_LABELS[route.name] ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <View key={route.key} style={styles.tabItem}>
            <View style={isFocused ? styles.tabActive : undefined}>
              <Text
                style={[styles.tabIcon, isFocused && styles.tabIconActive]}
                onPress={onPress}
              >
                {icon}
              </Text>
            </View>
            <Text
              style={[styles.tabLabel, isFocused && styles.tabLabelActive]}
              onPress={onPress}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export const AppNavigator: React.FC = () => {
  const [taskState, setTaskState] = useState<TaskState>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAndResetTasks().then(state => {
      setTaskState(state);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          tabBar={props => <CustomTabBar {...props} />}
          screenOptions={{ headerShown: false }}
        >
          <Tab.Screen name="Home">
            {() => (
              <HomeStackNavigator
                taskState={taskState}
                setTaskState={setTaskState}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Kitchen" component={KitchenScreen} />
          <Tab.Screen name="Progress">
            {() => <ProgressScreen taskState={taskState} />}
          </Tab.Screen>
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    ...SHADOWS.md,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  tabActive: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 3,
  },
  tabIcon: {
    fontSize: 22,
    textAlign: 'center',
  },
  tabIconActive: {},
  tabLabel: {
    fontSize: 10,
    color: COLORS.graymid,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
});
