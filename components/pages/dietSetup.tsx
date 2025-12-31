import { ThemedText } from '@/components/themed-text';
import MacroCard from '@/components/ui/macrocards';
import TabScreen from '@/components/ui/tabScreen';
import TopBar from '@/components/ui/topbar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

const DIET_PRESETS = {
  'Balanced': { protein: 30, carbs: 45, fats: 25 },
  'High Protein': { protein: 40, carbs: 35, fats: 25 },
  'Keto': { protein: 25, carbs: 5, fats: 70 },
  'Low Carb': { protein: 35, carbs: 25, fats: 40 },
};

function DietSetup({ onSave }: { onSave: (data: any) => void }) {
  const profile = useAuthStore((state) => state.profile);
  const fullName = profile?.full_name ?? 'Atleta';
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme ?? 'light'];
  
  const [dailyTarget, setDailyTarget] = useState('2400');
  const [dietType, setDietType] = useState<'Balanced' | 'High Protein' | 'Keto' | 'Low Carb'>('Balanced');
  const [protein, setProtein] = useState(30);
  const [carbs, setCarbs] = useState(45);
  const [fats, setFats] = useState(25);

  const textMuted = useThemeColor({}, 'textMuted');
  const surfaceColor = useThemeColor({}, 'surface');
  

  useEffect(() => {
    const preset = DIET_PRESETS[dietType];
    setProtein(preset.protein);
    setCarbs(preset.carbs);
    setFats(preset.fats);
  }, [dietType]);

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
      color: colors.text,
    },
    card: {
      backgroundColor: isDark ? '#1a1a2e' : '#f5f5f5',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#e0e0e0',
    },
    label: {
      fontSize: 12,
      color: '#888',
      textTransform: 'uppercase',
      marginBottom: 8,
      letterSpacing: 1,
    },
    input: {
      fontSize: 64,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    unit: {
      fontSize: 14,
      color: '#888',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    dietTypeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 20,
    },
    dietButton: {
      paddingHorizontal: 8,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#666',
    },
    dietButtonActive: {
      backgroundColor: colors.tint,
      borderColor: colors.tint,
    },
    dietButtonText: {
      color: '#999',
      fontSize: 14,
      fontWeight: '500',
    },
    dietButtonActiveText: {
      color: '#fff',
    },
    macroItem: {
      marginBottom: 12,
    },
    macroLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 4,
      color: colors.text,
    },
    macroValue: {
      fontSize: 12,
      color: '#888',
    },
    slider: {
      height: 6,
      backgroundColor: '#333',
      borderRadius: 3,
      overflow: 'hidden',
      marginTop: 8,
    },
    sliderFill: {
      height: '100%',
      borderRadius: 3,
    },
    saveButton: {
      backgroundColor: colors.tint,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    saveButtonDisabled: {
      backgroundColor: '#ccc',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    saveButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
  });

  const handleSave = () => {
    if (protein + carbs + fats !== 100) {
      alert('The sum of macros must equal 100%. Please adjust the sliders.');
      return;
    }
    const totalCalories = parseInt(dailyTarget);
    onSave({
        target_calories: totalCalories,
        target_protein: Math.round((protein / 100) * totalCalories / 4),
        target_carbs: Math.round((carbs / 100) * totalCalories / 4),
        target_fats: Math.round((fats / 100) * totalCalories / 9),
    });
  };

  const macroColors = {
    protein: '#a855f7',
    carbs: '#06b6d4',
    fats: '#f87171',
  };

  return (
    <TabScreen renderHeader={<TopBar onPress={() => {}} fullName={fullName} />}>
      <ScrollView style={styles.container}>
        <ThemedText style={styles.header}>Imposta i tuoi obiettivi</ThemedText>

        {/* Daily Target */}
        <View style={styles.card}>
          <ThemedText style={styles.label}>Obiettivo giornaliero</ThemedText>
          <View style={{ flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', gap: 8 }}>
          <TextInput
            style={styles.input}
            value={dailyTarget}
            onChangeText={setDailyTarget}
            keyboardType="numeric"
          />
          <ThemedText style={styles.unit}>kcal</ThemedText>
          </View>
        </View>

        {/* Diet Type */}
        <ThemedText style={styles.sectionTitle}>Tipo di dieta</ThemedText>
        <View style={styles.dietTypeContainer}>
          {(['Balanced', 'High Protein', 'Keto', 'Low Carb'] as const).map((type) => (
            <Pressable
              key={type}
              style={[
                styles.dietButton,
                dietType === type && styles.dietButtonActive,
              ]}
              onPress={() => setDietType(type)}
            >
              <ThemedText
                style={[
                  styles.dietButtonText,
                  dietType === type && styles.dietButtonActiveText,
                ]}
              >
                {type}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {/* Macro Split */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <ThemedText type='subtitle'>Distribuzione macro</ThemedText>
          <View style={{backgroundColor: surfaceColor, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4}}>
          <ThemedText style={{color: textMuted}}>
            {protein + carbs + fats}%
          </ThemedText>
          </View>
        </View>
        <View style={{ height: 18, flexDirection: 'row', width: '100%', marginTop: 8, borderRadius: 6, overflow: 'hidden' }}>
          <View style={{ flex: protein, backgroundColor: macroColors.protein }} />
          <View style={{ flex: carbs, backgroundColor: macroColors.carbs }} />
          <View style={{ flex: fats, backgroundColor: macroColors.fats }} />
        </View>


        <MacroCard
          macroName='Proteine'
          ammount={protein}
          dailyTarget={dailyTarget}
          macroColors={macroColors.protein}
          setMacro={setProtein}
          isDark={isDark}
        />

        <MacroCard 
          macroName='Carboidrati'
          ammount={carbs}
          dailyTarget={dailyTarget}
          macroColors={macroColors.carbs }
          setMacro={setCarbs}
          isDark={isDark}
        />

        <MacroCard 
          macroName='Grassi'
          ammount={fats}
          dailyTarget={dailyTarget}
          macroColors={macroColors.fats}
          setMacro={setFats}
          isDark={isDark}
        />

        <View
          style={{
            backgroundColor: isDark ? '#1a2555' : '#dbeafe',
            borderRadius: 8,
            padding: 12,
            marginTop: 16,
            marginBottom: 20,
          }}
        >
          <ThemedText style={{ fontSize: 12, color: isDark ? '#60a5fa' : '#0369a1' }}>
            💡 Adjust sliders to change your ratio. The values in grams are automatically calculated based on
            your total calorie target.
          </ThemedText>
        </View>

        <Pressable style={protein + carbs + fats !== 100 ? styles.saveButtonDisabled : styles.saveButton} onPress={handleSave} disabled={protein + carbs + fats !== 100}>
          <ThemedText style={styles.saveButtonText}>Save</ThemedText>
        </Pressable>
      </ScrollView>
    </TabScreen>
  );
}
export default DietSetup;