// src/components/TaskCard.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Vibration,
} from 'react-native';
import { Task } from '../data/appData';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

interface TaskCardProps {
  task: Task;
  done: boolean;
  onMark: (id: string) => void;
  onExercisePress?: () => void;
  isLast?: boolean;
  taskIndex: number;
}

const getTaskEmoji = (type: string, icon: string): string => {
  if (icon === 'water') return '💧';
  if (type === 'exercise') return '🏃';
  if (type === 'food') return '🥣';
  if (type === 'walk') return '🚶';
  return '✅';
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  done,
  onMark,
  onExercisePress,
  isLast,
  taskIndex,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: taskIndex * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (done) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.08,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 200,
          friction: 12,
        }),
      ]).start();
      Animated.timing(checkAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [done]);

  const handlePress = () => {
    if (task.type === 'exercise') {
      onExercisePress?.();
      return;
    }
    if (done) return;
    Vibration.vibrate(80);
    onMark(task.id);
  };

  const isExercise = task.type === 'exercise';

  return (
    <Animated.View style={[styles.nodeWrap, { opacity: fadeAnim }]}>
      <View style={styles.lineColumn}>
        <TouchableOpacity
          onPress={handlePress}
          style={[styles.iconCircle, done && styles.iconCircleDone]}
          activeOpacity={0.7}
        >
          <Text style={styles.iconEmoji}>{done ? '✅' : getTaskEmoji(task.type, task.icon)}</Text>
        </TouchableOpacity>
        {!isLast && (
          <View style={[styles.connector, done && styles.connectorDone]} />
        )}
      </View>

      <Animated.View
        style={[
          styles.card,
          done && styles.cardDone,
          isExercise && styles.cardExercise,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.cardRow}>
          <View style={styles.cardText}>
            <Text style={[styles.taskLabel, done && styles.taskLabelDone]}>
              {task.label}
            </Text>
            <Text style={styles.taskSub}>{task.sub}</Text>
            {task.reminderLabel && (
              <View style={styles.reminderBadge}>
                <Text style={styles.reminderText}>🔔 {task.reminderLabel}</Text>
              </View>
            )}
          </View>

          {!isExercise && (
            <TouchableOpacity onPress={handlePress} style={styles.checkBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.checkIcon, done && styles.checkIconDone]}>
                {done ? '✅' : '⭕'}
              </Text>
            </TouchableOpacity>
          )}

          {isExercise && (
            <TouchableOpacity
              onPress={onExercisePress}
              style={[styles.exerciseChevron, done && styles.exerciseChevronDone]}
            >
              <Text style={{ color: done ? COLORS.primaryDark : COLORS.graymid, fontSize: 18 }}>
                {done ? '✅' : '›'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {isExercise && done && (
          <Text style={styles.exerciseDoneLabel}>Exercise completed today! 💪</Text>
        )}
        {isExercise && !done && (
          <TouchableOpacity onPress={onExercisePress} style={styles.exerciseBtn}>
            <Text style={styles.exerciseBtnText}>Choose & Start Exercise →</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  nodeWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  lineColumn: {
    alignItems: 'center',
    width: 44,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.graysoft,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    ...SHADOWS.sm,
  },
  iconCircleDone: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  iconEmoji: {
    fontSize: 18,
  },
  connector: {
    width: 2,
    flex: 1,
    minHeight: 20,
    backgroundColor: COLORS.graysoft,
    marginVertical: 2,
  },
  connectorDone: {
    backgroundColor: COLORS.primary,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginLeft: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardDone: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  cardExercise: {
    borderColor: COLORS.primaryMid,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  taskLabel: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  taskLabelDone: {
    color: COLORS.primaryDark,
  },
  taskSub: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  reminderBadge: {
    marginTop: 5,
    backgroundColor: COLORS.infoLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  reminderText: {
    fontSize: 10,
    color: COLORS.info,
    fontWeight: '500',
  },
  checkBtn: {
    padding: 2,
  },
  checkIcon: {
    fontSize: 26,
  },
  checkIconDone: {},
  exerciseChevron: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.graysoft,
    borderRadius: RADIUS.sm,
  },
  exerciseChevronDone: {
    backgroundColor: COLORS.primaryLight,
  },
  exerciseBtn: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 9,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  exerciseBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONTS.sizes.sm,
  },
  exerciseDoneLabel: {
    marginTop: 6,
    fontSize: FONTS.sizes.sm,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
});
