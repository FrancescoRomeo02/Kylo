import { ThemedText } from '@/components/themed-text';
import TabScreen from '@/components/ui/tabScreen';
import TopBar from '@/components/ui/topbar';
import { BorderRadius, Colors, FontSizes, MacroColors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Diet } from '@/lib/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import MacroProgressCircle from '../ui/macroProgressCircle';
import MealEntry from '../ui/mealEntry';

function DietView({ diet }: { diet: Diet }) {

    const profile = useAuthStore((state) => state.profile);
    const meal = [
    { name: 'Colazione', calories: 450, items: [{ name: 'Porridge & Frutti di Bosco', calories: 300, protein: 10, carbs: 50, fats: 5 }] },
    { name: 'Pranzo', calories: 800, items: [{ name: 'Pasta al Pomodoro', calories: 200, protein: 20, carbs: 100, fats: 10 }, 
    { name: 'Insalata di Pollo', calories: 600, protein: 50, carbs: 20, fats: 25 }
    ] },
    { name: 'Cena', calories: 0, items: [] },
    { name: 'Spuntini', calories: 0, items: [] },
    ];
    const fullName = profile?.full_name ?? 'Atleta';
  
    const accentText = useThemeColor({}, "accent");
    const mutedText = useThemeColor({}, "textMuted");
  const surfaceColor = useThemeColor({}, "surface");
  const surfaceAlt = useThemeColor({}, "surfaceAlt");
  const border = useThemeColor({}, "border");
  const tintColor = useThemeColor({}, "tint");

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme ?? 'light'];

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dateList, setDateList] = useState<string[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  const generateDateList = useCallback((startDate?: string | null) => {
    const list: string[] = [];
    const start = startDate ? new Date(startDate) : new Date();
    const today = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.floor((today.getTime() - start.getTime()) / msPerDay);

    for (let i = 0; i <= diffDays; i++) {
      const date = new Date(start.getTime() + i * msPerDay);
      list.push(date.toISOString().slice(0, 10));
    }

    setDateList(list);
    setSelectedDate(list[list.length - 1]);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, []);

  useEffect(() => {
    generateDateList(diet.effective_from);
  }, [diet.effective_from, generateDateList]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.sm,
    },
    header: {
      fontSize: FontSizes.xxl,
      fontWeight: 'bold',
      marginBottom: Spacing.lg,
      color: colors.text,
    },
    dateSelector: {
      flexDirection: 'row',
      marginBottom: Spacing.md,
    },
    dateButton: {
      padding: Spacing.sm,
      borderRadius: BorderRadius.sm,
      backgroundColor: surfaceAlt,
      marginRight: Spacing.sm,
    },
    dateButtonActive: {
      backgroundColor: tintColor,
    },
    dateButtonText: {
      color: colors.text,
    },
    card: {
      backgroundColor: surfaceColor,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
      borderWidth: 1,
      borderColor: border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    progressBar: {
      height: 8,
      backgroundColor: 'rgba(124, 58, 237, 0.3)',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: Spacing.md,
    },
    progressFill: {
      height: '100%',
      backgroundColor: tintColor,
      borderRadius: 4,
    },
    calorieStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: FontSizes.sm,
      color: mutedText,
    },
    macroCircles: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: Spacing.lg,
      gap: Spacing.md,
    },
  }), [colors, surfaceColor, surfaceAlt, border, tintColor, mutedText]);

  const goal = diet.target_calories;
  const remaining = goal - (meal.reduce((sum, m) => sum + m.calories, 0));
  const progressPercent = ((goal - remaining) / goal) * 100;

  const todayProtein = (meal.reduce((sum, m) => sum + m.items.reduce((isum, item) => isum + (item.protein || 0), 0), 0));
  const todayCarbs = (meal.reduce((sum, m) => sum + m.items.reduce((isum, item) => isum + (item.carbs || 0), 0), 0));
  const todayFats = (meal.reduce((sum, m) => sum + m.items.reduce((isum, item) => isum + (item.fats || 0), 0), 0));

  const todayKey = new Date().toLocaleDateString('sv-SE');
  const orderedDateList = dateList.includes(todayKey) 
    ? dateList 
    : [...dateList, todayKey];  


  return (
    <TabScreen renderHeader={<TopBar onPress={() => {}} fullName={fullName} />}>
      <ScrollView style={styles.container}>
        <ThemedText style={styles.header}>Daily Nutrition</ThemedText>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20, paddingLeft: 4, alignItems: 'center' }}
          style={styles.dateSelector}
        >
          {orderedDateList.map((iso) => {
            const dateDate = new Date(iso);
            const diffDays = Math.floor(
              (new Date(todayKey).getTime() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)
            );

            let label = iso;
            if (diffDays === 0) label = 'Oggi';
            else if (diffDays === 1) label = 'Ieri';
            else if (diffDays > 1 && diffDays < 7) label = `${diffDays} Giorni Fa`;
            else label = dateDate.toLocaleDateString(); 

            const active = selectedDate === iso;

            return (
              <Pressable
                key={iso}
                style={[styles.dateButton, active && styles.dateButtonActive]}
                onPress={() => setSelectedDate(iso)}
              >
                <ThemedText style={[styles.dateButtonText, active && styles.dateButtonActive]}>
                  {label}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>

          {/* Selected date label */}
          <ThemedText style={{ fontSize: FontSizes.md, color: colors.text, marginBottom: Spacing.md, textAlign: 'center' }}>
            {selectedDate ? new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : ''}
          </ThemedText>

          {/* Calories Card */}
          <View style={styles.card}>
            <ThemedText type='subtitle' style={{ marginBottom: 8, textAlign: 'center', color: accentText }}>Calorie Rimanenti</ThemedText>
            <ThemedText type='title' style={{ marginBottom: 8, textAlign: 'center', fontSize: 48, paddingTop: 24 }}>{remaining.toLocaleString()}</ThemedText>
            <ThemedText style={{marginBottom: 12, textAlign: 'center', color: mutedText }}>kcal</ThemedText>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(progressPercent, 100)}%` },
                ]}
              />
            </View>

            <View style={styles.calorieStats}>
              <ThemedText>CONSUMATE: {(goal - remaining).toLocaleString()}</ThemedText>
              <ThemedText>GOAL: {goal.toLocaleString()}</ThemedText>
            </View>

          {/* Macro Circles */}
          <View style={styles.macroCircles}>
            <MacroProgressCircle
              value={todayProtein}
              target={diet.target_protein ?? 0}
              color={MacroColors.protein}
              label="Proteine"
            />
            <MacroProgressCircle
              value={todayCarbs}
              target={diet.target_carbs ?? 0}
              color={MacroColors.carbs}
              label="Carboidrati"
            />
            <MacroProgressCircle
              value={todayFats}
              target={diet.target_fats ?? 0}
              color={MacroColors.fats}
              label="Grassi"
            />
          </View>
          </View>

          {/* Meals */}
          {meal.map((meal) => (
            <MealEntry key={meal.name} meal={meal} />
          ))}
      </ScrollView>
    </TabScreen>
  );
}

export default DietView;