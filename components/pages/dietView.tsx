import { ThemedText } from '@/components/themed-text';
import TabScreen from '@/components/ui/tabScreen';
import TopBar from '@/components/ui/topbar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Diet } from '@/lib/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';



function DietView({ diet }: { diet: Diet }) {
  const profile = useAuthStore((state) => state.profile);
  const fullName = profile?.full_name ?? 'Atleta';
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme ?? 'light'];

  const [consumed, setConsumed] = useState(0);

  // Dates: build array of ISO yyyy-mm-dd strings from diet.effective_from up to today (inclusive)
  const today = new Date();
  const todayISO = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().slice(0, 10);

  const dateList = useMemo(() => {
    const list: string[] = [];
    const startDate = diet?.effective_from ? new Date(diet.effective_from) : new Date();
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date();
    const endZero = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.floor((endZero.getTime() - start.getTime()) / msPerDay);
    for (let i = 0; i <= Math.max(diffDays, 0); i++) {
      const d = new Date(start.getTime() + i * msPerDay);
      list.push(d.toISOString().slice(0, 10));
    }
    return list;
  }, [diet?.effective_from]);

  const [selectedDate, setSelectedDate] = useState<string>(
    dateList.length ? dateList[dateList.length - 1] : todayISO
  );

  const scrollRef = useRef<any>(null);

  useEffect(() => {
    if (!dateList.length) return;
    // set selected date to last (today) when list becomes available
    setSelectedDate(dateList[dateList.length - 1]);
    // small timeout to allow layout, then scroll to end so "Today" is visible
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(t);
  }, [dateList]);

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: colors.text,
    },
    dateSelector: {
      flexDirection: 'row',
      marginBottom: 12,
      gap: 8,
      maxHeight: 56,
    },
    dateButton: {
      minWidth: 72,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 18,
      backgroundColor: isDark ? '#11121a' : '#f3f4f6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dateButtonActive: {
      backgroundColor: colors.tint,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    dateButtonText: {
      fontSize: 13,
      color: '#888',
    },
    dateButtonActiveText: {
      color: '#fff',
    },
    card: {
      backgroundColor: isDark ? '#12121a' : '#ffffff',
      borderRadius: 14,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: isDark ? '#222' : '#e6e9ee',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    caloriesValue: {
      fontSize: 48,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    caloriesLabel: {
      fontSize: 12,
      color: '#888',
      textAlign: 'center',
      marginBottom: 16,
      textTransform: 'uppercase',
    },
    progressBar: {
      height: 8,
      backgroundColor: isDark ? '#333' : '#e0e0e0',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 12,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.tint,
      borderRadius: 4,
    },
    calorieStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 12,
      color: '#888',
    },
    macroCircles: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
      gap: 12,
    },
    macroCircle: {
      flex: 1,
      alignItems: 'center',
    },
    circle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
      borderWidth: 6,
    },
    mealSection: {
      marginBottom: 20,
    },
    mealTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    mealCalories: {
      fontSize: 14,
      color: '#888',
      marginLeft: 'auto',
    },
  });

  const goal = diet.target_calories;
  const remaining = goal - consumed;
  const progressPercent = (consumed / goal) * 100;

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
      // 2. Calcoli semplici basati sulle stringhe
      const dateDate = new Date(iso);
      const diffDays = Math.floor(
        (new Date(todayKey).getTime() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)
      );

      let label = iso; // Fallback
      if (diffDays === 0) label = 'Today';
      else if (diffDays === 1) label = 'Yesterday';
      else if (diffDays > 1 && diffDays < 7) label = `${diffDays} Days Ago`;
      else label = dateDate.toLocaleDateString(); // Formato locale (es. 23/12/2025)

      const active = selectedDate === iso;

      return (
        <Pressable
          key={iso}
          style={[styles.dateButton, active && styles.dateButtonActive]}
          onPress={() => setSelectedDate(iso)}
        >
          <ThemedText style={[styles.dateButtonText, active && styles.dateButtonActiveText]}>
            {label}
          </ThemedText>
        </Pressable>
      );
    })}
  </ScrollView>
);

        {/* Selected date label */}
        <ThemedText style={{ fontSize: 14, color: colors.text, marginBottom: 12, textAlign: 'center' }}>
          {selectedDate ? new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : ''}
        </ThemedText>

        {/* Calories Card */}
        <View style={styles.card}>
          <ThemedText style={styles.caloriesLabel}>Calories Remaining</ThemedText>
          <ThemedText style={styles.caloriesValue}>{remaining.toLocaleString()}</ThemedText>
          <ThemedText style={styles.caloriesLabel}>kcal</ThemedText>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(progressPercent, 100)}%` },
              ]}
            />
          </View>

          <View style={styles.calorieStats}>
            <ThemedText>CONSUMED: {consumed.toLocaleString()}</ThemedText>
            <ThemedText>GOAL: {goal.toLocaleString()}</ThemedText>
          </View>

          {/* Macro Circles */}
          <View style={styles.macroCircles}>
            <View style={styles.macroCircle}>
              <View style={[styles.circle, { borderColor: '#06b6d4' }]}>
                <View>
                  <ThemedText style={{ fontWeight: 'bold', fontSize: 12 }}>120g</ThemedText>
                </View>
              </View>
              <ThemedText style={{ fontSize: 12, color: '#888' }}>Protein</ThemedText>
            </View>
            <View style={styles.macroCircle}>
              <View style={[styles.circle, { borderColor: '#a855f7' }]}>
                <ThemedText style={{ fontWeight: 'bold', fontSize: 12 }}>210g</ThemedText>
              </View>
              <ThemedText style={{ fontSize: 12, color: '#888' }}>Carbs</ThemedText>
            </View>
            <View style={styles.macroCircle}>
              <View style={[styles.circle, { borderColor: '#f87171' }]}>
                <ThemedText style={{ fontWeight: 'bold', fontSize: 12 }}>45g</ThemedText>
              </View>
              <ThemedText style={{ fontSize: 12, color: '#888' }}>Fats</ThemedText>
            </View>
          </View>
        </View>

        {/* Meals */}
        <View style={styles.mealSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <ThemedText style={styles.mealTitle}>Breakfast</ThemedText>
            <ThemedText style={styles.mealCalories}>450 kcal</ThemedText>
          </View>
          <View
            style={[
              styles.card,
              { marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
            ]}
          >
            <ThemedText>Oatmeal & Berries</ThemedText>
            <ThemedText style={{ color: '#888' }}>300 kcal</ThemedText>
          </View>
        </View>

        <View style={styles.mealSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <ThemedText style={styles.mealTitle}>Lunch</ThemedText>
            <ThemedText style={styles.mealCalories}>0 kcal</ThemedText>
          </View>
          <Pressable
            style={[
              styles.card,
              {
                borderStyle: 'dashed',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 40,
              },
            ]}
          >
            <ThemedText style={{ color: '#888' }}>+ Log your lunch</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </TabScreen>
  );
}

export default DietView;