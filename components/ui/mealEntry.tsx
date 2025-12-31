import { useAuthStore } from '@/store/useAuthStore';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../themed-text';
import { IconSymbol } from './icon-symbol';


const KyloPalette = {
  primary: '#7C3AED',
  accent: '#C4B5FD',
  background: '#0F0E17',
  surface: '#1E1B2E',
  inputBackground: '#2A273F',
  textMuted: '#9BA1A6',
  text: '#FFFFFF',
};

interface MealItem {
  id?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
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
    if(item.protein > item.carbs && item.protein > item.fats) return 'fish.fill';
    if(item.carbs > item.protein && item.carbs > item.fats) return 'bolt.fill';
    if(item.fats > item.protein && item.fats > item.carbs) return 'drop.fill';
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
        <ThemedText type="default" style={{ color: KyloPalette.textMuted }}>
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
            <IconSymbol name="plus.circle.fill" size={32} color={KyloPalette.textMuted} />
          </View>
          <ThemedText type="default" style={{ color: KyloPalette.textMuted }}>
            Log your {meal.name.toLowerCase()}
          </ThemedText>
        </TouchableOpacity>
      ) : (
        meal.items.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.iconContainer}>
              <IconSymbol name={itemIcon(item)} size={24} color={KyloPalette.accent}/>
            </View>

            <View style={styles.textContainer}>
              <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
              <ThemedText type="caption" style={{ color: KyloPalette.textMuted }}>
                 {item.quantity ? item.quantity + ' • ' : ''}{item.calories} kcal
              </ThemedText>
            </View>

            {/* Bottone Modifica/Info */}
            <TouchableOpacity 
              style={styles.smallAddButton}
              onPress={() => handlePresentModalPress(item)}
            >
              {/* Cambiato icona in "pencil" o "slider" per indicare modifica */}
              <IconSymbol name="slider.horizontal.3" size={24} color={KyloPalette.textMuted} />
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* === BOTTOM SHEET === */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: KyloPalette.surface }}
        handleIndicatorStyle={{ backgroundColor: KyloPalette.textMuted }}
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
                    placeholderTextColor={KyloPalette.textMuted}
                  />
                </View>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <ThemedText type="caption" style={styles.label}>Kcal</ThemedText>
                  <BottomSheetTextInput 
                    style={styles.input} 
                    value={String(editingItem.calories)}
                    keyboardType="numeric"
                    onChangeText={(t) => handleChange('calories', t)}
                    placeholderTextColor={KyloPalette.textMuted}
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
                    placeholderTextColor={KyloPalette.textMuted}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <ThemedText type="caption" style={styles.label}>Carbo</ThemedText>
                  <BottomSheetTextInput 
                    style={styles.input} 
                    value={String(editingItem.carbs)}
                    keyboardType="numeric"
                    onChangeText={(t) => handleChange('carbs', t)}
                    placeholderTextColor={KyloPalette.textMuted}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <ThemedText type="caption" style={styles.label}>Grassi</ThemedText>
                  <BottomSheetTextInput 
                    style={styles.input} 
                    value={String(editingItem.fats)}
                    keyboardType="numeric"
                    onChangeText={(t) => handleChange('fats', t)}
                    placeholderTextColor={KyloPalette.textMuted}
                  />
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <ThemedText type="defaultSemiBold" style={{color: KyloPalette.text}}>
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
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: KyloPalette.surface, borderRadius: 16, padding: 16, marginBottom: 12 },
  iconContainer: { width: 48, height: 48, backgroundColor: KyloPalette.background, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: '#ffffff10' },
  textContainer: { flex: 1 },
  smallAddButton: { padding: 4, opacity: 0.7 },
  emptyStateContainer: { height: 100, borderRadius: 16, borderWidth: 2, borderColor: KyloPalette.surface, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  
  sheetContent: {
    flex: 1,
    padding: 24,
    backgroundColor: KyloPalette.surface,
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
    color: KyloPalette.textMuted,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: KyloPalette.inputBackground,
    color: KyloPalette.text,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    height: 50, 
  },
  saveButton: {
    backgroundColor: KyloPalette.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  }
});

export default MealEntry;