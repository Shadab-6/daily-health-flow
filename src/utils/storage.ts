// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dish } from '../data/appData';

const KEYS = {
  TASK_STATE: 'task_state_v1',
  LAST_RESET: 'last_reset_date',
  STREAK: 'streak_count',
  CUSTOM_DISHES: 'custom_dishes_v1',
  WEEKLY_DATA: 'weekly_data_v1',
  SETTINGS: 'app_settings_v1',
  SELECTED_EXERCISES: 'selected_exercises',
};

export interface TaskState {
  [taskId: string]: boolean;
}

export interface AppSettings {
  remindersEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  largeText: boolean;
  darkMode: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  remindersEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  largeText: false,
  darkMode: false,
};

// Auto-reset tasks at midnight
export const checkAndResetTasks = async (): Promise<TaskState> => {
  try {
    const today = new Date().toDateString();
    const lastReset = await AsyncStorage.getItem(KEYS.LAST_RESET);

    if (lastReset !== today) {
      // It's a new day — save yesterday's completion to weekly data before reset
      const taskState = await loadTaskState();
      const doneTasks = Object.values(taskState).filter(Boolean).length;
      await saveWeeklyEntry(doneTasks, 11);

      // Update streak
      if (doneTasks >= 8) {
        const streak = await loadStreak();
        await saveStreak(streak + 1);
      }

      // Reset tasks
      await AsyncStorage.setItem(KEYS.TASK_STATE, JSON.stringify({}));
      await AsyncStorage.setItem(KEYS.LAST_RESET, today);
      await AsyncStorage.removeItem(KEYS.SELECTED_EXERCISES);
      return {};
    }

    return await loadTaskState();
  } catch (e) {
    return {};
  }
};

export const loadTaskState = async (): Promise<TaskState> => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.TASK_STATE);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveTaskState = async (state: TaskState): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.TASK_STATE, JSON.stringify(state));
  } catch {}
};

export const loadStreak = async (): Promise<number> => {
  try {
    const val = await AsyncStorage.getItem(KEYS.STREAK);
    return val ? parseInt(val, 10) : 5; // default 5 for demo
  } catch {
    return 5;
  }
};

export const saveStreak = async (streak: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.STREAK, streak.toString());
  } catch {}
};

export const loadCustomDishes = async (): Promise<Dish[]> => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.CUSTOM_DISHES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCustomDishes = async (dishes: Dish[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.CUSTOM_DISHES, JSON.stringify(dishes));
  } catch {}
};

export const loadWeeklyData = async (): Promise<number[]> => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.WEEKLY_DATA);
    return raw ? JSON.parse(raw) : [60, 80, 45, 90, 70, 55, 0];
  } catch {
    return [60, 80, 45, 90, 70, 55, 0];
  }
};

export const saveWeeklyEntry = async (done: number, total: number): Promise<void> => {
  try {
    const data = await loadWeeklyData();
    const pct = Math.round((done / total) * 100);
    data.shift();
    data.push(pct);
    await AsyncStorage.setItem(KEYS.WEEKLY_DATA, JSON.stringify(data));
  } catch {}
};

export const loadSettings = async (): Promise<AppSettings> => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch {}
};

export const loadSelectedExercises = async (): Promise<string[]> => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SELECTED_EXERCISES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveSelectedExercises = async (ids: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.SELECTED_EXERCISES, JSON.stringify(ids));
  } catch {}
};

export const exportHealthData = async (): Promise<string> => {
  try {
    const taskState = await loadTaskState();
    const streak = await loadStreak();
    const weeklyData = await loadWeeklyData();
    const data = {
      exportDate: new Date().toISOString(),
      user: 'Sabiya',
      streak,
      todaysTasks: taskState,
      weeklyCompletion: weeklyData,
    };
    return JSON.stringify(data, null, 2);
  } catch {
    return '{}';
  }
};
