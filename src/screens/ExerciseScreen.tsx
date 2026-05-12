// src/screens/ExerciseScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Vibration,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EXERCISES, Exercise } from '../data/appData';
import { saveSelectedExercises, loadSelectedExercises } from '../utils/storage';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

interface ExerciseScreenProps {
  route?: {
    params?: {
      markTask?: (id: string) => void;
    };
  };
}

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  Easy: { bg: '#E8FFD0', text: '#2D6A00' },
  Medium: { bg: '#FFF3E0', text: '#7A3700' },
  Gentle: { bg: '#EBF8FF', text: '#1A4971' },
};

const ExerciseCard: React.FC<{
  exercise: Exercise;
  selected: boolean;
  onToggle: () => void;
  onYoutube: () => void;
}> = ({ exercise, selected, onToggle, onYoutube }) => {
  const levelStyle = LEVEL_COLORS[exercise.level];

  return (
    <View style={[styles.exerciseCard, selected && styles.exerciseCardSelected]}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.85} style={styles.cardTouchable}>
        <View style={styles.cardHeader}>
          <View style={styles.emojiBox}>
            <Text style={styles.emoji}>{exercise.emoji}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.metaRow}>
              <View style={[styles.badge, { backgroundColor: levelStyle.bg }]}>
                <Text style={[styles.badgeText, { color: levelStyle.text }]}>{exercise.level}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeMuted}>⏱ {exercise.duration}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.checkCircle, selected && styles.checkCircleSelected]}>
            <Text style={{ fontSize: 16, color: selected ? COLORS.white : COLORS.graymid }}>
              {selected ? '✓' : ''}
            </Text>
          </View>
        </View>

        <Text style={styles.benefit}>{exercise.benefit}</Text>
        <Text style={styles.description}>{exercise.description}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.youtubeBtn}
        onPress={onYoutube}
        activeOpacity={0.8}
      >
        <Text style={styles.youtubeBtnText}>▶  Watch on YouTube</Text>
      </TouchableOpacity>
    </View>
  );
};

export const ExerciseScreen: React.FC<ExerciseScreenProps> = ({ route }) => {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const markTask = route?.params?.markTask;

  useEffect(() => {
    loadSelectedExercises().then(ids => {
      setSelected(new Set(ids));
    });
  }, []);

  const toggleExercise = async (id: string) => {
    Vibration.vibrate(40);
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
    await saveSelectedExercises(Array.from(next));
  };

  const openYoutube = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Could not open YouTube', 'Please check your internet connection.');
    });
  };

  const handleDone = async () => {
    if (selected.size === 0) {
      Alert.alert(
        'Select an Exercise',
        'Please select at least one exercise you completed today.',
        [{ text: 'OK' }],
      );
      return;
    }
    Vibration.vibrate([0, 80, 50, 80]);
    markTask?.('t2');
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Exercise</Text>
        <Text style={styles.subtitle}>Select all you completed today</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 You can select one, two, or all three exercises. Each is shown with a YouTube video to follow along.
          </Text>
        </View>

        {EXERCISES.map(ex => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            selected={selected.has(ex.id)}
            onToggle={() => toggleExercise(ex.id)}
            onYoutube={() => openYoutube(ex.youtubeUrl)}
          />
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.doneBtn, selected.size === 0 && styles.doneBtnDisabled]}
          onPress={handleDone}
          activeOpacity={0.85}
        >
          <Text style={styles.doneBtnText}>
            {selected.size === 0
              ? 'Select an Exercise'
              : `Mark ${selected.size} Exercise${selected.size > 1 ? 's' : ''} as Done ✓`}
          </Text>
        </TouchableOpacity>
      </View>
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
    padding: SPACING.base,
    paddingTop: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    marginBottom: 6,
  },
  backText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.base,
  },
  infoBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.base,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  infoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primaryDark,
    lineHeight: 18,
  },
  exerciseCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  exerciseCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FAFFFA',
  },
  cardTouchable: {
    padding: SPACING.base,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  emojiBox: {
    width: 52,
    height: 52,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emoji: {
    fontSize: 26,
  },
  headerInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.graysoft,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeMuted: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.graymid,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  checkCircleSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  benefit: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  description: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    lineHeight: 19,
  },
  youtubeBtn: {
    backgroundColor: '#FF0000',
    padding: SPACING.md,
    alignItems: 'center',
  },
  youtubeBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONTS.sizes.base,
  },
  bottomBar: {
    padding: SPACING.base,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  doneBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    alignItems: 'center',
  },
  doneBtnDisabled: {
    backgroundColor: COLORS.graymid,
  },
  doneBtnText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: FONTS.sizes.lg,
  },
});
