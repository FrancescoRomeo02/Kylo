import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuthStore } from '@/store/useAuthStore';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../themed-text';
import { IconSymbol } from './icon-symbol';

interface MealItem {
  id?: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  quantity?: string;
}

interface MealEntryProps {
  meal: {
    name: string;
    calories: number;
    items: MealItem[];
  };
  onUpdateItem?: (updatedItem: MealItem) => void; 
}

const MealEntry = ({ meal, onUpdateItem }: MealEntryProps) => {
  const profile = useAuthStore((state) => state.profile);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const surfaceColor = useThemeColor({}, 'surface');
  const backgroundColor = useThemeColor({}, 'background');
  const textMuted = useThemeColor({}, 'textMuted');
  const accentColor = useThemeColor({}, 'accent');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  const router = useRouter();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['60%'], []);

  const [editingItem, setEditingItem] = useState<MealItem | null>(null);

  const styles = useMemo(() => StyleSheet.create({
    mealSection: { marginBottom: Spacing.lg, paddingHorizontal: Spacing.xs },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: surfaceColor, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md },
    iconContainer: { width: 48, height: 48, backgroundColor: backgroundColor, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md, borderWidth: 1, borderColor: borderColor },
    textContainer: { flex: 1 },
    smallAddButton: { padding: Spacing.xs, opacity: 0.7 },
    emptyStateContainer: { height: 100, borderRadius: BorderRadius.lg, borderWidth: 2, borderColor: surfaceColor, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
    addMoreButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: surfaceColor, borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.sm, gap: Spacing.sm, opacity: 0.8 },
    
    sheetContent: {
      flex: 1,
      padding: Spacing.lg,
      backgroundColor: surfaceColor,
    },
    inputRow: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginBottom: Spacing.md,
    },
    inputContainer: {
      flex: 1,
    },
    label: {
      color: textMuted,
      marginBottom: Spacing.sm,
      marginLeft: Spacing.xs,
    },
    input: {
      backgroundColor: surfaceColor,
      color: textColor,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      fontSize: FontSizes.base,
      height: 50, 
    },
    saveButton: {
      backgroundColor: tintColor,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      marginTop: Spacing.lg,
    }
  }), [surfaceColor, backgroundColor, textMuted, accentColor, tintColor, textColor, borderColor]);

  const handlePresentModalPress = useCallback((item: MealItem) => {
    setEditingItem({ ...item }); 
    bottomSheetModalRef.current?.present();
  }, []);

  const handleChange = (key: keyof MealItem, value: string) => {
    if (!editingItem) return;
    const val = key === 'name' || key === 'quantity' ? value : Number(value);
    setEditingItem(prev => prev ? { ...prev, [key]: val } : null);
  };

  const handleSave = () => {
    if (editingItem && onUpdateItem) {
      onUpdateItem(editingItem);
    }
    bottomSheetModalRef.current?.dismiss();
    Keyboard.dismiss();
  };
  
  const itemIcon = (item: MealItem) => {
    const protein = item.protein ?? 0;
    const carbs = item.carbs ?? 0;
    const fats = item.fats ?? 0;
    
    if(protein > carbs && protein > fats) return 'fish.fill';
    if(carbs > protein && carbs > fats) return 'bolt.fill';
    if(fats > protein && fats > carbs) return 'drop.fill';
    return 'carrot.fill';
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7} 
      />
    ),
    []
  );

  return (
    <View style={styles.mealSection}>
      {/* Header */}
      <View style={styles.headerRow}>
        <ThemedText type="subtitle">{meal.name}</ThemedText>
        <ThemedText type="default" style={{ color: textMuted }}>
          {meal.calories} kcal
        </ThemedText>
      </View>

      {/* Lista Items */}
      {meal.items.length === 0 ? (
        <TouchableOpacity
          style={styles.emptyStateContainer}
          onPress={() => router.push({ pathname: '/searchFood', params: { mealType: meal.name, userId: profile?.id || '' } })}
        >
          <View style={{ marginBottom: Spacing.sm }}>
            <IconSymbol name="plus.circle.fill" size={32} color={textMuted} />
          </View>
          <ThemedText type="default" style={{ color: textMuted }}>
            Log your {meal.name.toLowerCase()}
          </ThemedText>
        </TouchableOpacity>
      ) : (
        <>
          {meal.items.map((item, index) => (
            <View key={item.id || `${item.name}-${index}`} style={styles.card}>
              <View style={styles.iconContainer}>
                <IconSymbol name={itemIcon(item)} size={24} color={accentColor}/>
              </View>

              <View style={styles.textContainer}>
                <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                <ThemedText type="caption" style={{ color: textMuted }}>
                   {item.quantity ? item.quantity + ' • ' : ''}{item.calories} kcal
                </ThemedText>
              </View>

              {/* Bottone Modifica/Info */}
              <TouchableOpacity 
                style={styles.smallAddButton}
                onPress={() => handlePresentModalPress(item)}
              >
                <IconSymbol name="slider.horizontal.3" size={24} color={textMuted} />
              </TouchableOpacity>
            </View>
          ))}
          
          {/* Bottone per aggiungere altri items */}
          <TouchableOpacity
            style={styles.addMoreButton}
            onPress={() => router.push({ pathname: '/searchFood', params: { mealType: meal.name, userId: profile?.id || '' } })}
          >
            <IconSymbol name="plus.circle.fill" size={24} color={textMuted} />
          </TouchableOpacity>
        </>
      )}

      {/* === BOTTOM SHEET === */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: surfaceColor }}
        handleIndicatorStyle={{ backgroundColor: textMuted }}
        keyboardBlurBehavior="restore"
      >
        <BottomSheetView style={styles.sheetContent}>
          {editingItem && (
            <>
              <ThemedText type="subtitle" style={{textAlign: 'center', marginBottom: Spacing.lg}}>
                Modifica {editingItem.name}
              </ThemedText>

              {/* Form Grid */}
              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, { flex: 2 }]}>
                  <ThemedText type="caption" style={styles.label}>Nome</ThemedText>
                  <BottomSheetTextInput 
                    style={styles.input} 
                    value={editingItem.name}
                    onChangeText={(t) => handleChange('name', t)}
                    placeholderTextColor={textMuted}
                  />
                </View>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <ThemedText type="caption" style={styles.label}>Kcal</ThemedText>
                  <BottomSheetTextInput 
                    style={styles.input} 
                    value={String(editingItem.calories)}
                    keyboardType="numeric"
                    onChangeText={(t) => handleChange('calories', t)}
                    placeholderTextColor={textMuted}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <ThemedText type="caption" style={styles.label}>Proteine</ThemedText>
                  <BottomSheetTextInput 
                    style={styles.input} 
                    value={String(editingItem.protein)}
                    keyboardType="numeric"
                    onChangeText={(t) => handleChange('protein', t)}
                    placeholderTextColor={textMuted}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <ThemedText type="caption" style={styles.label}>Carbo</ThemedText>
                  <BottomSheetTextInput 
                    style={styles.input} 
                    value={String(editingItem.carbs)}
                    keyboardType="numeric"
                    onChangeText={(t) => handleChange('carbs', t)}
                    placeholderTextColor={textMuted}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <ThemedText type="caption" style={styles.label}>Grassi</ThemedText>
                  <BottomSheetTextInput 
                    style={styles.input} 
                    value={String(editingItem.fats)}
                    keyboardType="numeric"
                    onChangeText={(t) => handleChange('fats', t)}
                    placeholderTextColor={textMuted}
                  />
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <ThemedText type="defaultSemiBold" style={{color: textColor}}>
                  Salva Modifiche
                </ThemedText>
              </TouchableOpacity>
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default MealEntry;