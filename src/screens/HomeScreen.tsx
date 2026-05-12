// src/screens/HomeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DAILY_TASKS, MOTIVATIONAL_QUOTES } from '../data/appData';
import { TaskCard } from '../components/TaskCard';
import { ProgressRing } from '../components/ProgressRing';
import {
  checkAndResetTasks,
  saveTaskState,
  loadStreak,
  TaskState,
} from '../utils/storage';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

interface HomeScreenProps {
  taskState: TaskState;
  setTaskState: (state: TaskState) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ taskState, setTaskState }) => {
  const navigation = useNavigation<any>();
  const [streak, setStreak] = useState(5);
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  const [refreshing, setRefreshing] = useState(false);

  const totalTasks = DAILY_TASKS.length;
  const doneTasks = Object.values(taskState).filter(Boolean).length;
  const progress = doneTasks / totalTasks;

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    loadStreak().then(setStreak);
    const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setQuote(MOTIVATIONAL_QUOTES[idx]);
  }, []);

  const markTask = useCallback(
    async (id: string) => {
      const next = { ...taskState, [id]: true };
      setTaskState(next);
      await saveTaskState(next);
    },
    [taskState, setTaskState],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    const fresh = await checkAndResetTasks();
    setTaskState(fresh);
    setRefreshing(false);
  };

  const waterDone = DAILY_TASKS.filter(
    t => t.type === 'water' && taskState[t.id],
  ).length;
  const totalWater = DAILY_TASKS.filter(t => t.type === 'water').length;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Sticky Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 🌿</Text>
            <Text style={styles.name}>Sabiya</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <View style={styles.rightHeader}>
            <ProgressRing progress={progress} size={72} strokeWidth={7} />
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {streak} days</Text>
            </View>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressRow}>
          <View style={styles.progressBarOuter}>
            <View style={[styles.progressBarInner, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{doneTasks}/{totalTasks}</Text>
        </View>

        <Text style={styles.quote}>{quote}</Text>

        {/* Mini stats */}
        <View style={styles.miniStats}>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatVal}>💧 {waterDone}/{totalWater}</Text>
            <Text style={styles.miniStatLabel}>Water</Text>
          </View>
          <View style={styles.miniStatDivider} />
          <View style={styles.miniStat}>
            <Text style={styles.miniStatVal}>🏃 {taskState['t2'] ? '1' : '0'}/1</Text>
            <Text style={styles.miniStatLabel}>Exercise</Text>
          </View>
          <View style={styles.miniStatDivider} />
          <View style={styles.miniStat}>
            <Text style={styles.miniStatVal}>⭐ {Math.round(progress * 100)}%</Text>
            <Text style={styles.miniStatLabel}>Today</Text>
          </View>
        </View>
      </View>

      {/* Journey Scroll */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <Text style={styles.sectionTitle}>Today's Journey</Text>

        {DAILY_TASKS.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            done={!!taskState[task.id]}
            onMark={markTask}
            taskIndex={index}
            isLast={index === DAILY_TASKS.length - 1}
            onExercisePress={() => navigation.navigate('Exercise', { taskState, markTask })}
          />
        ))}

        {/* Completion card */}
        {doneTasks === totalTasks && (
          <View style={styles.completionCard}>
            <Text style={styles.completionEmoji}>🏆</Text>
            <Text style={styles.completionTitle}>Perfect Day, Sabiya!</Text>
            <Text style={styles.completionSub}>All tasks complete. You're amazing!</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 12,
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  greeting: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: 1,
  },
  name: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  date: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  rightHeader: {
    alignItems: 'center',
    gap: 6,
  },
  streakBadge: {
    backgroundColor: COLORS.streakLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.streakOrange,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: 6,
  },
  progressBarOuter: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.graysoft,
    borderRadius: RADIUS.round,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.round,
  },
  progressLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    minWidth: 32,
  },
  quote: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primaryDark,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  miniStats: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  miniStat: {
    flex: 1,
    alignItems: 'center',
  },
  miniStatVal: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  miniStatLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  miniStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.base,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  completionCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginTop: SPACING.sm,
  },
  completionEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  completionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  completionSub: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
