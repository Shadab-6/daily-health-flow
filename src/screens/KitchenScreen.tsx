// src/screens/KitchenScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Vibration,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Dish } from '../data/appData';
import { loadCustomDishes, saveCustomDishes } from '../utils/storage';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

const DishCard: React.FC<{ dish: Dish; onPress: () => void }> = ({ dish, onPress }) => (
  <TouchableOpacity style={styles.dishCard} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.dishEmoji}>
      {dish.imageUri ? (
        <Image source={{ uri: dish.imageUri }} style={styles.dishImage} resizeMode="cover" />
      ) : (
        <Text style={styles.dishEmojiText}>{dish.emoji}</Text>
      )}
    </View>
    <View style={styles.dishInfo}>
      <Text style={styles.dishName} numberOfLines={1}>{dish.name}</Text>
      <Text style={styles.dishTag} numberOfLines={1}>{dish.tag}</Text>
      <Text style={styles.dishTime}>⏱ {dish.cookTime}</Text>
    </View>
  </TouchableOpacity>
);

const RecipeModal: React.FC<{
  dish: Dish | null;
  visible: boolean;
  onClose: () => void;
}> = ({ dish, visible, onClose }) => {
  if (!dish) return null;
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modalScreen}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕ Close</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.recipeBanner}>
            {dish.imageUri ? (
              <Image source={{ uri: dish.imageUri }} style={styles.recipeBannerImage} resizeMode="cover" />
            ) : (
              <Text style={styles.recipeBannerEmoji}>{dish.emoji}</Text>
            )}
          </View>
          <Text style={styles.recipeTitle}>{dish.name}</Text>
          <View style={styles.recipeMetaRow}>
            <View style={styles.recipeBadge}><Text style={styles.recipeBadgeText}>🌿 Diabetes-Friendly</Text></View>
            <View style={styles.recipeBadge}><Text style={styles.recipeBadgeText}>⏱ {dish.cookTime}</Text></View>
          </View>
          <Text style={styles.recipeTagLine}>{dish.tag}</Text>

          <Text style={styles.sectionLabel}>Ingredients</Text>
          <View style={styles.ingredientsWrap}>
            {dish.ingredients.map((ing, i) => (
              <View key={i} style={styles.ingredientChip}>
                <Text style={styles.ingredientText}>{ing}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Preparation Steps</Text>
          {dish.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}

          <Text style={styles.sectionLabel}>Why It's Good for Sabiya</Text>
          <View style={styles.benefitsBox}>
            <Text style={styles.benefitsText}>{dish.benefits}</Text>
          </View>

          {dish.nutrition && dish.nutrition.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Nutrition (per serving)</Text>
              <View style={styles.nutritionGrid}>
                {dish.nutrition.map((n, i) => (
                  <View key={i} style={styles.nutritionItem}>
                    <Text style={styles.nutritionVal}>{n.value}</Text>
                    <Text style={styles.nutritionLabel}>{n.label}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {dish.youtubeUrl ? (
            <TouchableOpacity
              style={styles.youtubeBtn}
              onPress={() => Linking.openURL(dish.youtubeUrl!)}
              activeOpacity={0.85}
            >
              <Text style={styles.youtubeBtnText}>▶  Watch Recipe on YouTube</Text>
            </TouchableOpacity>
          ) : null}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const AddDishModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onAdd: (dish: Dish) => void;
}> = ({ visible, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [benefits, setBenefits] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [emoji, setEmoji] = useState('🍽');
  const [imageUri, setImageUri] = useState('');

  const reset = () => {
    setName(''); setTag(''); setCookTime(''); setIngredients('');
    setSteps(''); setBenefits(''); setYoutubeUrl(''); setEmoji('🍽'); setImageUri('');
  };

  const handlePickPhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.85,
      selectionLimit: 1,
    });

    if (result.didCancel) return;

    if (result.errorCode) {
      Alert.alert('Photo Error', result.errorMessage || 'Unable to pick photo right now.');
      return;
    }

    const uri = result.assets?.[0]?.uri;
    if (uri) setImageUri(uri);
  };

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert('Missing Info', 'Please enter a dish name.');
      return;
    }
    const dish: Dish = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      emoji,
      tag: tag.trim() || 'Healthy Choice',
      cookTime: cookTime.trim() || '—',
      ingredients: ingredients.split(',').map(s => s.trim()).filter(Boolean),
      steps: steps.split('\n').map(s => s.trim()).filter(Boolean),
      benefits: benefits.trim() || 'A healthy addition to Sabiya\'s diet.',
      nutrition: [],
      youtubeUrl: youtubeUrl.trim() || undefined,
      imageUri: imageUri || undefined,
      isCustom: true,
    };
    onAdd(dish);
    reset();
    onClose();
    Vibration.vibrate(80);
  };

  const EMOJIS = ['🍽','🥗','🍲','🥣','🍛','🫓','🥬','🧀','🍵','🥙','🫘','🥦'];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.modalScreen}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { reset(); onClose(); }} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕ Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Dish</Text>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.sectionLabel}>Choose Emoji</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              {EMOJIS.map(e => (
                <TouchableOpacity key={e} onPress={() => setEmoji(e)}
                  style={[styles.emojiChoice, emoji === e && styles.emojiChoiceSelected]}>
                  <Text style={{ fontSize: 24 }}>{e}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Dish Photo (optional)</Text>
              <TouchableOpacity style={styles.photoPickerBtn} onPress={handlePickPhoto} activeOpacity={0.85}>
                <Text style={styles.photoPickerBtnText}>{imageUri ? 'Change Photo' : 'Add Photo from Gallery'}</Text>
              </TouchableOpacity>
              {imageUri ? (
                <>
                  <Image source={{ uri: imageUri }} style={styles.photoPreview} resizeMode="cover" />
                  <TouchableOpacity onPress={() => setImageUri('')} style={styles.removePhotoBtn}>
                    <Text style={styles.removePhotoBtnText}>Remove Photo</Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </View>

            {[
              { label: 'Dish Name *', value: name, set: setName, placeholder: 'e.g. Bitter Gourd Stir Fry' },
              { label: 'Health Tag', value: tag, set: setTag, placeholder: 'e.g. Low GI • Rich in Fiber' },
              { label: 'Cook Time', value: cookTime, set: setCookTime, placeholder: 'e.g. 20 min' },
              { label: 'Ingredients (comma separated)', value: ingredients, set: setIngredients, placeholder: 'Onion, Garlic, Turmeric...' },
            ].map(f => (
              <View key={f.label} style={styles.formGroup}>
                <Text style={styles.formLabel}>{f.label}</Text>
                <TextInput
                  style={styles.formInput}
                  value={f.value}
                  onChangeText={f.set}
                  placeholder={f.placeholder}
                  placeholderTextColor={COLORS.graymid}
                />
              </View>
            ))}

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Preparation Steps (one per line)</Text>
              <TextInput
                style={[styles.formInput, { height: 100, textAlignVertical: 'top' }]}
                value={steps}
                onChangeText={setSteps}
                placeholder={'Step 1...\nStep 2...\nStep 3...'}
                placeholderTextColor={COLORS.graymid}
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Diabetes-Friendly Benefits</Text>
              <TextInput
                style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]}
                value={benefits}
                onChangeText={setBenefits}
                placeholder="Why is this dish good for managing blood sugar?"
                placeholderTextColor={COLORS.graymid}
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>YouTube Recipe Link (optional)</Text>
              <TextInput
                style={styles.formInput}
                value={youtubeUrl}
                onChangeText={setYoutubeUrl}
                placeholder="https://youtu.be/..."
                placeholderTextColor={COLORS.graymid}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>

            <TouchableOpacity style={styles.addDishBtn} onPress={handleAdd} activeOpacity={0.85}>
              <Text style={styles.addDishBtnText}>Add Dish to Kitchen 🍽</Text>
            </TouchableOpacity>
            <View style={{ height: 60 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export const KitchenScreen: React.FC = () => {
  const [customDishes, setCustomDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [recipeVisible, setRecipeVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);

  const allDishes = customDishes;

  useEffect(() => {
    loadCustomDishes().then(setCustomDishes);
  }, []);

  const handleAddDish = async (dish: Dish) => {
    const next = [...customDishes, dish];
    setCustomDishes(next);
    await saveCustomDishes(next);
  };

  const openRecipe = (dish: Dish) => {
    setSelectedDish(dish);
    setRecipeVisible(true);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kitchen</Text>
        <Text style={styles.headerSub}>Diabetes-friendly recipes for Sabiya</Text>
      </View>

      <FlatList
        data={allDishes}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.kitchenBanner}>
            <Text style={styles.kitchenBannerText}>
              🌿 All recipes are specially chosen to help manage blood sugar and support healthy living.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <DishCard dish={item} onPress={() => openRecipe(item)} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No dishes yet</Text>
            <Text style={styles.emptyStateText}>Tap + to add your first dish with a photo.</Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setAddVisible(true)} activeOpacity={0.85}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <RecipeModal dish={selectedDish} visible={recipeVisible} onClose={() => setRecipeVisible(false)} />
      <AddDishModal visible={addVisible} onClose={() => setAddVisible(false)} onAdd={handleAddDish} />
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
  grid: { padding: SPACING.base },
  row: { justifyContent: 'space-between', marginBottom: SPACING.md },
  kitchenBanner: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.base,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  kitchenBannerText: { fontSize: FONTS.sizes.sm, color: COLORS.primaryDark, lineHeight: 18 },
  dishCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  dishEmoji: {
    backgroundColor: COLORS.primaryLight,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dishImage: {
    width: '100%',
    height: '100%',
  },
  dishEmojiText: { fontSize: 52 },
  dishInfo: { padding: 10 },
  dishName: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.textPrimary },
  dishTag: { fontSize: 10, color: COLORS.primaryDark, fontWeight: '600', marginTop: 2 },
  dishTime: { fontSize: 10, color: COLORS.textMuted, marginTop: 3 },
  emptyState: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.base,
  },
  emptyStateTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  emptyStateText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 6, textAlign: 'center' },
  fab: {
    position: 'absolute',
    bottom: 86,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  },
  fabText: { fontSize: 28, color: COLORS.white, lineHeight: 30 },

  // Modal
  modalScreen: { flex: 1, backgroundColor: COLORS.white },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  modalTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  closeBtn: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: COLORS.background, borderRadius: RADIUS.sm },
  closeBtnText: { fontSize: FONTS.sizes.base, color: COLORS.textSecondary, fontWeight: '600' },
  modalContent: { padding: SPACING.base },
  recipeBanner: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.lg, height: 160, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.base },
  recipeBannerImage: { width: '100%', height: '100%', borderRadius: RADIUS.lg },
  recipeBannerEmoji: { fontSize: 72 },
  recipeTitle: { fontSize: FONTS.sizes.xxxl, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  recipeMetaRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  recipeBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.round },
  recipeBadgeText: { fontSize: 12, color: COLORS.primaryDark, fontWeight: '600' },
  recipeTagLine: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: 4 },
  sectionLabel: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: SPACING.base, marginBottom: 8 },
  ingredientsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  ingredientChip: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.round },
  ingredientText: { fontSize: 12, color: COLORS.primaryDark, fontWeight: '500' },
  stepRow: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  stepNumText: { fontSize: 11, fontWeight: '800', color: COLORS.white },
  stepText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textPrimary, lineHeight: 19 },
  benefitsBox: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: 4 },
  benefitsText: { fontSize: FONTS.sizes.sm, color: COLORS.primaryDark, lineHeight: 20 },
  nutritionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  nutritionItem: { flex: 1, minWidth: '22%', backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  nutritionVal: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.textPrimary },
  nutritionLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
  youtubeBtn: { backgroundColor: '#FF0000', borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.base },
  youtubeBtnText: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.base },

  // Add dish form
  formGroup: { marginBottom: 14 },
  formLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 5 },
  formInput: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.sm, padding: 10, fontSize: FONTS.sizes.base, color: COLORS.textPrimary, backgroundColor: COLORS.white },
  photoPickerBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  photoPickerBtnText: { fontSize: FONTS.sizes.base, color: COLORS.primaryDark, fontWeight: '700' },
  photoPreview: {
    width: '100%',
    height: 150,
    borderRadius: RADIUS.md,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  removePhotoBtn: { alignSelf: 'flex-start', marginTop: 8, paddingVertical: 4, paddingHorizontal: 8 },
  removePhotoBtnText: { color: '#D32F2F', fontWeight: '700' },
  emojiChoice: { width: 44, height: 44, borderRadius: RADIUS.sm, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', marginRight: 8, borderWidth: 1.5, borderColor: COLORS.border },
  emojiChoiceSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  addDishBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.base, alignItems: 'center', marginTop: 8 },
  addDishBtnText: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.lg },
});
