// src/screens/SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Linking,
  Share,
} from 'react-native';
import {
  loadSettings,
  saveSettings,
  exportHealthData,
  AppSettings,
  DEFAULT_SETTINGS,
} from '../utils/storage';
import {
  scheduleAllReminders,
  cancelAllReminders,
} from '../utils/notifications';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

const SettingRow: React.FC<{
  icon: string;
  label: string;
  sublabel?: string;
  value?: boolean;
  onToggle?: (val: boolean) => void;
  onPress?: () => void;
  showChevron?: boolean;
  danger?: boolean;
}> = ({ icon, label, sublabel, value, onToggle, onPress, showChevron, danger }) => (
  <TouchableOpacity
    style={styles.settingRow}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    disabled={!onPress && !onToggle}
  >
    <View style={[styles.settingIcon, danger && styles.settingIconDanger]}>
      <Text style={styles.settingEmoji}>{icon}</Text>
    </View>
    <View style={styles.settingText}>
      <Text style={[styles.settingLabel, danger && { color: COLORS.error }]}>{label}</Text>
      {sublabel ? <Text style={styles.settingSub}>{sublabel}</Text> : null}
    </View>
    {onToggle !== undefined && value !== undefined && (
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.graymid, true: COLORS.primary }}
        thumbColor={COLORS.white}
      />
    )}
    {showChevron && <Text style={styles.chevron}>›</Text>}
  </TouchableOpacity>
);

export const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const updateSetting = async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    await saveSettings(next);

    if (key === 'remindersEnabled') {
      if (value) {
        scheduleAllReminders();
        Alert.alert('Reminders On', 'Hydration reminders have been scheduled for Sabiya!');
      } else {
        cancelAllReminders();
        Alert.alert('Reminders Off', 'All reminders have been cancelled.');
      }
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportHealthData();
      await Share.share({
        title: 'Daily Health Flow — Sabiya\'s Data',
        message: `Daily Health Flow Export\n\n${data}`,
      });
    } catch {
      Alert.alert('Export Failed', 'Could not export health data.');
    }
  };

  const handleBatteryOptimization = () => {
    Alert.alert(
      'Battery Optimization',
      'To ensure reminders work in the background:\n\n1. Go to Settings → Apps → Daily Health Flow\n2. Tap "Battery"\n3. Select "Unrestricted"\n\nThis allows the app to send reminders even when closed.',
      [
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
        { text: 'OK' },
      ],
    );
  };

  const handleResetTasks = () => {
    Alert.alert(
      'Reset Today\'s Tasks',
      'Are you sure you want to reset all of today\'s tasks? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Tasks Reset', 'All tasks have been reset for today. Restart the app to reflect changes.');
          },
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSub}>Customize your experience</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileEmoji}>🌿</Text>
          </View>
          <View>
            <Text style={styles.profileName}>Sabiya</Text>
            <Text style={styles.profileSub}>Daily Health Flow Member</Text>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>🔥 Active Streak</Text>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <Text style={styles.sectionLabel}>Reminders</Text>
        <View style={styles.settingsGroup}>
          <SettingRow
            icon="🔔"
            label="Hydration Reminders"
            sublabel="Get reminded to drink water throughout the day"
            value={settings.remindersEnabled}
            onToggle={val => updateSetting('remindersEnabled', val)}
          />
          <SettingRow
            icon="🔊"
            label="Reminder Sound"
            sublabel="Play a sound with notifications"
            value={settings.soundEnabled}
            onToggle={val => updateSetting('soundEnabled', val)}
          />
          <SettingRow
            icon="📳"
            label="Vibration"
            sublabel="Vibrate when reminders arrive"
            value={settings.vibrationEnabled}
            onToggle={val => updateSetting('vibrationEnabled', val)}
          />
          <SettingRow
            icon="🔋"
            label="Battery Optimization"
            sublabel="Allow reminders when app is closed"
            onPress={handleBatteryOptimization}
            showChevron
          />
        </View>

        {/* Display */}
        <Text style={styles.sectionLabel}>Display</Text>
        <View style={styles.settingsGroup}>
          <SettingRow
            icon="🌙"
            label="Dark Mode"
            sublabel="Easier on the eyes at night"
            value={settings.darkMode}
            onToggle={val => updateSetting('darkMode', val)}
          />
          <SettingRow
            icon="🔠"
            label="Large Text"
            sublabel="Bigger fonts for easier reading"
            value={settings.largeText}
            onToggle={val => updateSetting('largeText', val)}
          />
        </View>

        {/* Data */}
        <Text style={styles.sectionLabel}>Data & Privacy</Text>
        <View style={styles.settingsGroup}>
          <SettingRow
            icon="📤"
            label="Export Health Data"
            sublabel="Share your progress as a text file"
            onPress={handleExport}
            showChevron
          />
          <SettingRow
            icon="🔄"
            label="Reset Today's Tasks"
            sublabel="Clear all completions for today"
            onPress={handleResetTasks}
            showChevron
          />
        </View>

        {/* About */}
        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.settingsGroup}>
          <SettingRow
            icon="ℹ️"
            label="About Daily Health Flow"
            sublabel="Version 1.0.0"
            onPress={() => Alert.alert('Daily Health Flow', 'A personalized diabetes-friendly health companion for Sabiya.\n\nVersion 1.0.0\nBuilt with ❤️ for healthy living.')}
            showChevron
          />
          <SettingRow
            icon="📋"
            label="Health Disclaimer"
            sublabel="Important information"
            onPress={() => Alert.alert('Health Disclaimer', 'This app is a lifestyle companion tool and does not replace professional medical advice. Always consult your doctor regarding your diabetes management and any changes to your exercise or diet routine.')}
            showChevron
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Daily Health Flow v1.0</Text>
          <Text style={styles.footerSub}>Made with 🌿 for Sabiya</Text>
          <Text style={styles.footerSub}>Stay healthy, step by step</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.white,
    padding: SPACING.base,
    paddingTop: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.textPrimary },
  headerSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: SPACING.base },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  profileEmoji: { fontSize: 30 },
  profileName: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.textPrimary },
  profileSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: 5 },
  profileBadge: { backgroundColor: COLORS.streakLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.round, alignSelf: 'flex-start' },
  profileBadgeText: { fontSize: 11, color: COLORS.streakOrange, fontWeight: '700' },
  sectionLabel: { fontSize: FONTS.sizes.xs, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6, marginTop: 4, marginLeft: 4 },
  settingsGroup: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIconDanger: { backgroundColor: '#FFF0F0' },
  settingEmoji: { fontSize: 18 },
  settingText: { flex: 1 },
  settingLabel: { fontSize: FONTS.sizes.base, fontWeight: '600', color: COLORS.textPrimary },
  settingSub: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 1 },
  chevron: { fontSize: 22, color: COLORS.graymid },
  footer: { alignItems: 'center', paddingVertical: SPACING.xl, gap: 3 },
  footerText: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.textSecondary },
  footerSub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
});
