import { ThemedText } from '@/components/themed-text';
import MacroCard from '@/components/ui/macrocards';
import TabScreen from '@/components/ui/tabScreen';
import TopBar from '@/components/ui/topbar';
import { BorderRadius, Colors, FontSizes, MacroColors, Spacing } from '@/constants/theme';
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
  const surfaceAlt = useThemeColor({}, 'surfaceAlt');
  const border = useThemeColor({}, 'border');
  const buttonText = useThemeColor({}, 'buttonText');
  const buttonDisabled = useThemeColor({}, 'buttonDisabled');
  const infoBackground = useThemeColor({}, 'infoBackground');
  const infoText = useThemeColor({}, 'infoText');

  useEffect(() => {
    const preset = DIET_PRESETS[dietType];
    setProtein(preset.protein);
    setCarbs(preset.carbs);
    setFats(preset.fats);
  }, [dietType]);

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.lg,
    },
    header: {
      fontSize: FontSizes.xxl,
      fontWeight: 'bold',
      marginBottom: Spacing.lg,
      color: colors.text,
    },
    card: {
      backgroundColor: surfaceAlt,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginBottom: Spacing.lg,
      borderWidth: 1,
      borderColor: border,
    },
    label: {
      fontSize: FontSizes.sm,
      color: textMuted,
      textTransform: 'uppercase',
      marginBottom: Spacing.sm,
      letterSpacing: 1,
    },
    input: {
      fontSize: 64,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: Spacing.sm,
    },
    unit: {
      fontSize: FontSizes.md,
      color: textMuted,
    },
    sectionTitle: {
      fontSize: FontSizes.base,
      fontWeight: '600',
      color: colors.text,
      marginBottom: Spacing.md,
    },
    dietTypeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginBottom: Spacing.lg,
    },
    dietButton: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.xl,
      borderWidth: 1,
      borderColor: border,
    },
    dietButtonActive: {
      backgroundColor: colors.tint,
      borderColor: colors.tint,
    },
    dietButtonText: {
      color: textMuted,
      fontSize: FontSizes.md,
      fontWeight: '500',
    },
    dietButtonActiveText: {
      color: buttonText,
    },
    macroItem: {
      marginBottom: Spacing.md,
    },
    macroLabel: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      marginBottom: Spacing.xs,
      color: colors.text,
    },
    macroValue: {
      fontSize: FontSizes.sm,
      color: textMuted,
    },
    slider: {
      height: 6,
      backgroundColor: surfaceColor,
      borderRadius: 3,
      overflow: 'hidden',
      marginTop: Spacing.sm,
    },
    sliderFill: {
      height: '100%',
      borderRadius: 3,
    },
    saveButton: {
      backgroundColor: colors.tint,
      paddingVertical: 14,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      marginTop: Spacing.lg,
    },
    saveButtonDisabled: {
      backgroundColor: buttonDisabled,
      paddingVertical: 14,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      marginTop: Spacing.lg,
    },
    saveButtonText: {
      color: buttonText,
      fontWeight: '600',
      fontSize: FontSizes.base,
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

  const macroColors = MacroColors;

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
        <View style={{ height: 18, flexDirection: 'row', width: '100%', marginTop: Spacing.sm, borderRadius: BorderRadius.sm, overflow: 'hidden' }}>
          <View style={{ flex: protein, backgroundColor: MacroColors.protein }} />
          <View style={{ flex: carbs, backgroundColor: MacroColors.carbs }} />
          <View style={{ flex: fats, backgroundColor: MacroColors.fats }} />
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
            backgroundColor: infoBackground,
            borderRadius: BorderRadius.sm,
            padding: Spacing.md,
            marginTop: Spacing.md,
            marginBottom: Spacing.lg,
          }}
        >
          <ThemedText style={{ fontSize: FontSizes.sm, color: infoText }}>
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