// src/data/appData.ts

export interface Task {
  id: string;
  icon: string;
  label: string;
  sub: string;
  type: 'water' | 'exercise' | 'food' | 'walk';
  reminderTime?: string; // "HH:MM" 24h
  reminderLabel?: string;
}

export interface Exercise {
  id: string;
  name: string;
  emoji: string;
  benefit: string;
  duration: string;
  level: 'Easy' | 'Medium' | 'Gentle';
  levelColor: string;
  youtubeUrl: string;
  description: string;
}

export interface Dish {
  id: string;
  name: string;
  emoji: string;
  imageUri?: string;
  tag: string;
  cookTime: string;
  ingredients: string[];
  steps: string[];
  benefits: string;
  nutrition: { value: string; label: string }[];
  youtubeUrl?: string;
  isCustom?: boolean;
}

export const DAILY_TASKS: Task[] = [
  {
    id: 't1',
    icon: 'water',
    label: 'Drink 1 glass of water',
    sub: 'First thing in the morning',
    type: 'water',
  },
  {
    id: 't2',
    icon: 'run',
    label: 'Exercise',
    sub: 'Complete your workout for today',
    type: 'exercise',
  },
  {
    id: 't3',
    icon: 'water',
    label: 'Drink 1 glass of water',
    sub: 'After 15 minutes of exercise',
    type: 'water',
  },
  {
    id: 't4',
    icon: 'food-apple',
    label: 'Eat Oats + Milk',
    sub: '30–60 minutes after finishing exercise',
    type: 'food',
  },
  {
    id: 't5',
    icon: 'water',
    label: '1 glass of water',
    sub: 'Between 11am – 12pm',
    type: 'water',
    reminderTime: '11:45',
    reminderLabel: 'Reminder at 11:45 AM',
  },
  {
    id: 't6',
    icon: 'water',
    label: '1 glass of water',
    sub: 'Between 1pm – 2pm',
    type: 'water',
    reminderTime: '13:45',
    reminderLabel: 'Reminder at 1:45 PM',
  },
  {
    id: 't7',
    icon: 'water',
    label: '1 glass of water',
    sub: 'Between 3pm – 4pm',
    type: 'water',
    reminderTime: '15:45',
    reminderLabel: 'Reminder at 3:45 PM',
  },
  {
    id: 't8',
    icon: 'water',
    label: '1 glass of water',
    sub: 'Between 5pm – 6pm',
    type: 'water',
    reminderTime: '17:45',
    reminderLabel: 'Reminder at 5:45 PM',
  },
  {
    id: 't9',
    icon: 'water',
    label: '1 glass of water',
    sub: 'Between 7pm – 8pm',
    type: 'water',
    reminderTime: '19:45',
    reminderLabel: 'Reminder at 7:45 PM',
  },
  {
    id: 't10',
    icon: 'water',
    label: '1 glass of water',
    sub: 'Between 9pm – 10pm',
    type: 'water',
    reminderTime: '21:45',
    reminderLabel: 'Reminder at 9:45 PM',
  },
  {
    id: 't11',
    icon: 'walk',
    label: '15 min light walk',
    sub: 'After dinner',
    type: 'walk',
  },
];

export const EXERCISES: Exercise[] = [
  {
    id: 'e1',
    name: 'Brisk Walking',
    emoji: '🚶',
    benefit: 'Burns calories, improves heart health, great for blood sugar control',
    duration: '30–45 min',
    level: 'Easy',
    levelColor: '#E8FFD0',
    youtubeUrl: 'https://youtu.be/jUiI5DlRmO4?si=rSA63LxXmQzPjtNv',
    description:
      'A low-impact exercise perfect for managing diabetes. Walk at a pace where you can talk but feel slightly breathless. Best done after meals.',
  },
  {
    id: 'e2',
    name: 'Body Weight Workout',
    emoji: '💪',
    benefit: 'Builds strength, boosts metabolism, no equipment needed',
    duration: '20–30 min',
    level: 'Medium',
    levelColor: '#FFF3E0',
    youtubeUrl: 'https://youtu.be/A2WUdTsxMoA?si=FXNLPdz3GRpwNKKC',
    description:
      'Squats, push-ups, lunges and planks that use your own bodyweight. Builds muscle which helps cells absorb glucose more effectively.',
  },
  {
    id: 'e3',
    name: 'Yoga',
    emoji: '🧘',
    benefit: 'Reduces stress, improves flexibility, supports insulin sensitivity',
    duration: '20–30 min',
    level: 'Gentle',
    levelColor: '#EBF8FF',
    youtubeUrl: 'https://youtu.be/_EcKtL7wpYc?si=MA232Q9M1wfVfYRc',
    description:
      'Gentle yoga poses help reduce cortisol (stress hormone) which directly affects blood sugar levels. Great for all fitness levels.',
  },
];

export const DEFAULT_DISHES: Dish[] = [
  {
    id: 'd1',
    name: 'Oats & Milk',
    emoji: '🥣',
    tag: 'Low GI • High Fiber',
    cookTime: '10 min',
    ingredients: ['Rolled oats (½ cup)', 'Low-fat milk (1 cup)', 'Cinnamon (½ tsp)', 'Chia seeds (1 tbsp)', 'Almonds, sliced (1 tbsp)'],
    steps: [
      'Boil milk in a saucepan over low heat.',
      'Add rolled oats and stir gently to combine.',
      'Cook for 5–7 minutes, stirring occasionally, until creamy.',
      'Add cinnamon and chia seeds, stir well.',
      'Top with sliced almonds. Serve warm.',
    ],
    benefits:
      'Oats have a low glycemic index — they release glucose slowly, preventing spikes. Beta-glucan fiber in oats slows glucose absorption, keeping blood sugar stable for hours after exercise.',
    nutrition: [
      { value: '180', label: 'Calories' },
      { value: '6g', label: 'Protein' },
      { value: '32g', label: 'Carbs' },
      { value: '4g', label: 'Fiber' },
    ],
  },
  {
    id: 'd2',
    name: 'Dal Palak',
    emoji: '🍲',
    tag: 'Protein-Rich • Diabetic Safe',
    cookTime: '25 min',
    ingredients: ['Moong dal (½ cup)', 'Fresh spinach (2 cups)', 'Garlic (4 cloves)', 'Cumin seeds (1 tsp)', 'Turmeric (½ tsp)', 'Tomato (1)'],
    steps: [
      'Wash and soak moong dal for 20 minutes.',
      'Pressure cook dal with turmeric until completely soft.',
      'In a pan, sauté cumin seeds, garlic, and chopped tomato.',
      'Add blanched spinach and cooked dal to the pan.',
      'Season with salt, simmer 5 minutes. Serve hot.',
    ],
    benefits:
      'Moong dal is high in protein and fiber — it digests slowly without spiking blood sugar. Spinach adds iron and magnesium which play a key role in insulin function and glucose metabolism.',
    nutrition: [
      { value: '210', label: 'Calories' },
      { value: '14g', label: 'Protein' },
      { value: '28g', label: 'Carbs' },
      { value: '7g', label: 'Fiber' },
    ],
  },
  {
    id: 'd3',
    name: 'Karela Sabzi',
    emoji: '🥬',
    tag: 'Blood Sugar Control',
    cookTime: '20 min',
    ingredients: ['Bitter gourd / Karela (2)', 'Onion (1)', 'Turmeric (½ tsp)', 'Coriander powder (1 tsp)', 'Cumin (1 tsp)', 'Salt to taste'],
    steps: [
      'Slice bitter gourd thinly. Sprinkle salt and rest for 10 minutes.',
      'Squeeze out liquid and rinse to reduce bitterness.',
      'Sauté cumin and onion until golden brown.',
      'Add karela and all spices. Mix well.',
      'Cover and cook on low heat for 15 minutes. Garnish with coriander.',
    ],
    benefits:
      'Bitter gourd contains charantin and polypeptide-p — compounds that mimic insulin and actively help lower blood glucose. It is one of the most researched vegetables for diabetes management.',
    nutrition: [
      { value: '85', label: 'Calories' },
      { value: '3g', label: 'Protein' },
      { value: '12g', label: 'Carbs' },
      { value: '5g', label: 'Fiber' },
    ],
  },
  {
    id: 'd4',
    name: 'Grilled Paneer',
    emoji: '🧀',
    tag: 'High Protein • Low Carb',
    cookTime: '20 min',
    ingredients: ['Low-fat paneer (200g)', 'Bell peppers (2)', 'Olive oil (1 tbsp)', 'Chaat masala (1 tsp)', 'Lemon juice (1 tbsp)', 'Cumin (½ tsp)'],
    steps: [
      'Cut paneer into cubes. Marinate with spices, olive oil, and lemon for 15 min.',
      'Chop bell peppers into equal-sized pieces.',
      'Thread on skewers alternating paneer and peppers.',
      'Grill on a hot pan or grill for 8–10 minutes, turning halfway.',
      'Serve hot with mint chutney.',
    ],
    benefits:
      'Paneer is high in protein and very low in carbohydrates. It helps maintain satiety for long periods, reduces overeating, and keeps blood glucose levels steady throughout the day.',
    nutrition: [
      { value: '240', label: 'Calories' },
      { value: '18g', label: 'Protein' },
      { value: '6g', label: 'Carbs' },
      { value: '0g', label: 'Fiber' },
    ],
  },
  {
    id: 'd5',
    name: 'Methi Thepla',
    emoji: '🫓',
    tag: 'Low GI • Traditional',
    cookTime: '30 min',
    ingredients: ['Whole wheat flour (1 cup)', 'Fresh methi / fenugreek leaves (1 cup)', 'Yogurt (3 tbsp)', 'Turmeric (¼ tsp)', 'Cumin (½ tsp)', 'Oil (1 tsp)'],
    steps: [
      'Mix flour, chopped methi, spices, and yogurt into a soft dough.',
      'Add a teaspoon of oil and knead for 2 minutes.',
      'Divide into small balls and roll into thin rounds.',
      'Cook on a hot tawa with minimal oil, 2 min each side.',
      'Serve with low-fat curd or green chutney.',
    ],
    benefits:
      'Methi (fenugreek) seeds and leaves contain soluble fiber and galactomannan that slow carbohydrate digestion and lower blood sugar. Whole wheat flour provides sustained energy.',
    nutrition: [
      { value: '160', label: 'Calories' },
      { value: '5g', label: 'Protein' },
      { value: '26g', label: 'Carbs' },
      { value: '4g', label: 'Fiber' },
    ],
  },
  {
    id: 'd6',
    name: 'Vegetable Soup',
    emoji: '🍵',
    tag: 'Low Calorie • Filling',
    cookTime: '20 min',
    ingredients: ['Mixed vegetables (2 cups)', 'Garlic (3 cloves)', 'Ginger (1 inch)', 'Black pepper (½ tsp)', 'Cumin (½ tsp)', 'Lemon juice (1 tbsp)'],
    steps: [
      'Chop all vegetables into small chunks.',
      'Sauté garlic and ginger in a pot for 1 minute.',
      'Add vegetables and 3 cups water. Bring to boil.',
      'Simmer 15 minutes until vegetables are tender.',
      'Blend partially for a chunky texture. Add lemon juice. Serve.',
    ],
    benefits:
      'Low in calories and high in fiber, this soup fills you up without raising blood sugar. The non-starchy vegetables provide vitamins and antioxidants that support overall metabolic health.',
    nutrition: [
      { value: '90', label: 'Calories' },
      { value: '4g', label: 'Protein' },
      { value: '15g', label: 'Carbs' },
      { value: '6g', label: 'Fiber' },
    ],
  },
];

export const MOTIVATIONAL_QUOTES = [
  'Stay healthy, step by step 🌿',
  'Small steps, big changes 💚',
  'Every sip counts, Sabiya! 💧',
  'Your health is your wealth 🌱',
  'Keep going, you\'re doing great! ⭐',
  'One habit at a time 🌿',
  'Your body thanks you today! 💪',
];
