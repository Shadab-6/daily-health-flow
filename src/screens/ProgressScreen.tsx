// src/screens/ProgressScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import { DAILY_TASKS } from '../data/appData';
import { ProgressRing } from '../components/ProgressRing';
import {
  TaskState,
  loadStreak,
  loadWeeklyData,
} from '../utils/storage';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

interface ProgressScreenProps {
  taskState: TaskState;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WeekBar: React.FC<{ data: number[] }> = ({ data }) => {
  const max = Math.max(...data, 1);
  return (
    <View style={styles.weekBarWrap}>
      {data.map((val, i) => (
        <View key={i} style={styles.dayCol}>
          <Text style={styles.dayPct}>{val > 0 ? `${val}%` : ''}</Text>
          <View style={styles.barOuter}>
            <View
              style={[
                styles.barInner,
                {
                  height: `${(val / max) * 100}%`,
                  opacity: i === 6 ? 0.3 : 1,
                },
              ]}
            />
          </View>
          <Text style={styles.dayLabel}>{DAYS[i]}</Text>
        </View>
      ))}
    </View>
  );
};

interface Achievement {
  emoji: string;
  title: string;
  desc: string;
  unlocked: boolean;
  gradient: string[];
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ taskState }) => {
  const [streak, setStreak] = useState(5);
  const [weeklyData, setWeeklyData] = useState<number[]>([60, 80, 45, 90, 70, 55, 0]);

  const totalTasks = DAILY_TASKS.length;
  const doneTasks = Object.values(taskState).filter(Boolean).length;
  const progress = doneTasks / totalTasks;

  const waterTasks = DAILY_TASKS.filter(t => t.type === 'water');
  const waterDone = waterTasks.filter(t => taskState[t.id]).length;
  const waterProgress = waterDone / waterTasks.length;

  const exerciseDone = taskState['t2'] ? 1 : 0;

  useEffect(() => {
    loadStreak().then(setStreak);
    loadWeeklyData().then(setWeeklyData);
  }, []);

  const achievements: Achievement[] = [
    {
      emoji: '🌅',
      title: 'Early Bird',
      desc: 'Started the day healthy',
      unlocked: doneTasks >= 1,
      gradient: ['#FFD700', '#FFA500'],
    },
    {
      emoji: '💧',
      title: 'Hydration Hero',
      desc: 'Drank 4+ glasses of water',
      unlocked: waterDone >= 4,
      gradient: ['#4FC3F7', '#0288D1'],
    },
    {
      emoji: '💪',
      title: 'Fitness Champ',
      desc: 'Completed today\'s exercise',
      unlocked: !!taskState['t2'],
      gradient: ['#A5D6A7', '#388E3C'],
    },
    {
      emoji: '🌿',
      title: 'Halfway There',
      desc: 'Completed 50%+ of daily tasks',
      unlocked: progress >= 0.5,
      gradient: ['#C8E6C9', '#2E7D32'],
    },
    {
      emoji: '🏆',
      title: 'Perfect Day',
      desc: 'All tasks complete!',
      unlocked: doneTasks === totalTasks,
      gradient: ['#70E000', '#4CAF00'],
    },
    {
      emoji: '🔥',
      title: 'On Fire',
      desc: '5+ day streak maintained',
      unlocked: streak >= 5,
      gradient: ['#FF8F00', '#E65100'],
    },
  ];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress</Text>
        <Text style={styles.headerSub}>Keep it up, Sabiya! 🌿</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's Score */}
        <View style={styles.card}>
          <View style={styles.scoreRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardLabel}>Today's Score</Text>
              <Text style={styles.scoreBig}>{Math.round(progress * 100)}%</Text>
              <Text style={styles.scoreSub}>{doneTasks} of {totalTasks} tasks complete</Text>
              <View style={styles.streakRow}>
                <Text style={styles.streakText}>🔥 {streak} day streak</Text>
              </View>
            </View>
            <ProgressRing progress={progress} size={96} strokeWidth={9} />
          </View>
        </View>

        {/* Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Today's Breakdown</Text>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <ProgressRing progress={waterProgress} size={72} strokeWidth={7} color="#4FC3F7" />
              <Text style={styles.breakdownLabel}>💧 Water</Text>
              <Text style={styles.breakdownVal}>{waterDone}/{waterTasks.length}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <ProgressRing progress={exerciseDone} size={72} strokeWidth={7} color="#A5D6A7" />
              <Text style={styles.breakdownLabel}>🏃 Exercise</Text>
              <Text style={styles.breakdownVal}>{exerciseDone}/1</Text>
            </View>
            <View style={styles.breakdownItem}>
              <ProgressRing progress={taskState['t11'] ? 1 : 0} size={72} strokeWidth={7} color="#FFB74D" />
              <Text style={styles.breakdownLabel}>🚶 Walk</Text>
              <Text style={styles.breakdownVal}>{taskState['t11'] ? 1 : 0}/1</Text>
            </View>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Weekly Consistency</Text>
          <WeekBar data={weeklyData} />
          <Text style={styles.weekAvg}>
            7-day avg:{' '}
            <Text style={styles.weekAvgVal}>
              {Math.round(weeklyData.reduce((a, b) => a + b, 0) / 7)}%
            </Text>
          </Text>
        </View>

        {/* Achievements */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((ach, i) => (
              <View
                key={i}
                style={[styles.achCard, !ach.unlocked && styles.achCardLocked]}
              >
                <Text style={[styles.achEmoji, !ach.unlocked && { opacity: 0.3 }]}>
                  {ach.emoji}
                </Text>
                <Text style={[styles.achTitle, !ach.unlocked && styles.achLocked]}>
                  {ach.title}
                </Text>
                <Text style={styles.achDesc}>{ach.desc}</Text>
                {!ach.unlocked && (
                  <Text style={styles.achLockedBadge}>🔒</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Calendar placeholder */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>This Month</Text>
          <View style={styles.calendarGrid}>
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const today = new Date().getDate();
              const isPast = day < today;
              const isToday = day === today;
              const pct = isPast ? Math.floor(Math.random() * 60) + 40 : isToday ? Math.round(progress * 100) : 0;
              const color = pct >= 80 ? COLORS.primary : pct >= 50 ? COLORS.primaryMid : pct > 0 ? COLORS.graysoft : COLORS.background;
              return (
                <View key={i} style={[styles.calDay, { backgroundColor: color, borderWidth: isToday ? 2 : 0, borderColor: COLORS.primaryDark }]}>
                  <Text style={[styles.calDayText, pct >= 80 && { color: COLORS.white }]}>{day}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.calLegend}>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} /><Text style={styles.legendText}>80%+</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: COLORS.primaryMid }]} /><Text style={styles.legendText}>50%+</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: COLORS.graysoft }]} /><Text style={styles.legendText}>Started</Text></View>
          </View>
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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardLabel: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.base },
  scoreBig: { fontSize: 38, fontWeight: '900', color: COLORS.textPrimary, lineHeight: 42 },
  scoreSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: 8 },
  streakRow: { flexDirection: 'row' },
  streakText: { backgroundColor: COLORS.streakLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.round, fontSize: 12, fontWeight: '700', color: COLORS.streakOrange },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 4 },
  breakdownItem: { alignItems: 'center', gap: 6 },
  breakdownLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  breakdownVal: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.textPrimary },
  weekBarWrap: { flexDirection: 'row', height: 100, alignItems: 'flex-end', gap: 6, marginBottom: 8 },
  dayCol: { flex: 1, alignItems: 'center', gap: 3 },
  barOuter: { flex: 1, width: '100%', backgroundColor: COLORS.graysoft, borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
  barInner: { width: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  dayLabel: { fontSize: 9, color: COLORS.textSecondary },
  dayPct: { fontSize: 8, color: COLORS.textMuted },
  weekAvg: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 4 },
  weekAvgVal: { fontWeight: '700', color: COLORS.primaryDark },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  achCard: { width: '47%', backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, position: 'relative' },
  achCardLocked: { opacity: 0.7 },
  achEmoji: { fontSize: 28, marginBottom: 4 },
  achTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
  achLocked: { color: COLORS.graymid },
  achDesc: { fontSize: 10, color: COLORS.textSecondary, textAlign: 'center', marginTop: 2 },
  achLockedBadge: { position: 'absolute', top: 6, right: 6, fontSize: 12 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  calDay: { width: '12%', aspectRatio: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  calDayText: { fontSize: 9, color: COLORS.textSecondary, fontWeight: '600' },
  calLegend: { flexDirection: 'row', gap: 14, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 10, color: COLORS.textSecondary },
});
