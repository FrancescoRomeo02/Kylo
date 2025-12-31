import { Colors } from '@/constants/theme';
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
  const colors = Colors.dark;

  const router = useRouter();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['60%'], []);

  const [editingItem, setEditingItem] = useState<MealItem | null>(null);

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
        <ThemedText type="default" style={{ color: colors.textMuted }}>
          {meal.calories} kcal
        </ThemedText>
      </View>

      {/* Lista Items */}
      {meal.items.length === 0 ? (
        <TouchableOpacity
          style={styles.emptyStateContainer}
          onPress={() => router.push({ pathname: '/searchFood', params: { mealType: meal.name, userId: profile?.id || '' } })}
        >
          <View style={{ marginBottom: 8 }}>
            <IconSymbol name="plus.circle.fill" size={32} color={colors.textMuted} />
          </View>
          <ThemedText type="default" style={{ color: colors.textMuted }}>
            Log your {meal.name.toLowerCase()}
          </ThemedText>
        </TouchableOpacity>
      ) : (
        <>
          {meal.items.map((item, index) => (
            <View key={item.id || `${item.name}-${index}`} style={styles.card}>
              <View style={styles.iconContainer}>
                <IconSymbol name={itemIcon(item)} size={24} color={colors.accent}/>
              </View>

              <View style={styles.textContainer}>
                <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                <ThemedText type="caption" style={{ color: colors.textMuted }}>
                   {item.quantity ? item.quantity + ' • ' : ''}{item.calories} kcal
                </ThemedText>
              </View>

              {/* Bottone Modifica/Info */}
              <TouchableOpacity 
                style={styles.smallAddButton}
                onPress={() => handlePresentModalPress(item)}
              >
                <IconSymbol name="slider.horizontal.3" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          ))}
          
          {/* Bottone per aggiungere altri items */}
          <TouchableOpacity
            style={styles.addMoreButton}
            onPress={() => router.push({ pathname: '/searchFood', params: { mealType: meal.name, userId: profile?.id || '' } })}
          >
            <IconSymbol name="plus.circle.fill" size={24} color={colors.textMuted} />
          </TouchableOpacity>
        </>
      )}

      {/* === BOTTOM SHEET === */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
        keyboardBlurBehavior="restore"
      >
        <BottomSheetView style={styles.sheetContent}>
          {editingItem && (
            <>
              <ThemedText type="subtitle" style={{textAlign: 'center', marginBottom: 20}}>
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
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <ThemedText type="caption" style={styles.label}>Kcal</ThemedText>
                  <BottomSheetTextInput 
                    style={styles.input} 
                    value={String(editingItem.calories)}
                    keyboardType="numeric"
                    onChangeText={(t) => handleChange('calories', t)}
                    placeholderTextColor={colors.textMuted}
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
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <ThemedText type="caption" style={styles.label}>Carbo</ThemedText>
                  <BottomSheetTextInput 
                    style={styles.input} 
                    value={String(editingItem.carbs)}
                    keyboardType="numeric"
                    onChangeText={(t) => handleChange('carbs', t)}
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <ThemedText type="caption" style={styles.label}>Grassi</ThemedText>
                  <BottomSheetTextInput 
                    style={styles.input} 
                    value={String(editingItem.fats)}
                    keyboardType="numeric"
                    onChangeText={(t) => handleChange('fats', t)}
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <ThemedText type="defaultSemiBold" style={{color: colors.text}}>
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

const styles = StyleSheet.create({
  mealSection: { marginBottom: 24, paddingHorizontal: 4 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.dark.surface, borderRadius: 16, padding: 16, marginBottom: 12 },
  iconContainer: { width: 48, height: 48, backgroundColor: Colors.dark.background, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: '#ffffff10' },
  textContainer: { flex: 1 },
  smallAddButton: { padding: 4, opacity: 0.7 },
  emptyStateContainer: { height: 100, borderRadius: 16, borderWidth: 2, borderColor: Colors.dark.surface, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  addMoreButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.dark.surface, borderRadius: 12, padding: 12, marginTop: 8, gap: 8, opacity: 0.8 },
  
  sheetContent: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.dark.surface,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    color: Colors.dark.textMuted,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: Colors.dark.surface,
    color: Colors.dark.text,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    height: 50, 
  },
  saveButton: {
    backgroundColor: Colors.dark.tint,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  }
});

export default MealEntry;