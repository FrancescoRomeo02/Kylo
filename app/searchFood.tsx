import { insertFoodLog } from '@/lib/api/foodLogs';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../components/themed-text';


const KyloPalette = {
  primary: '#7C3AED',
  background: '#0F0E17',
  surface: '#1E1B2E',
  inputBackground: '#2A273F',
  text: '#FFFFFF',
  textMuted: '#9BA1A6',
  accent: '#C4B5FD',
};

const MOCK_DB = [
  { id: '1', name: 'Banana', cal: 89, p: 1.1, c: 22, f: 0.3 },
  { id: '2', name: 'Petto di Pollo', cal: 165, p: 31, c: 0, f: 3.6 },
  { id: '3', name: 'Riso Basmati', cal: 130, p: 2.7, c: 28, f: 0.3 },
  { id: '4', name: 'Uovo', cal: 155, p: 13, c: 1.1, f: 11 },
  { id: '5', name: 'Avocado', cal: 160, p: 2, c: 8.5, f: 14.7 },
  { id: '6', name: 'Avena', cal: 389, p: 16.9, c: 66, f: 6.9 },
];

const SearchFoodScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mealType = (params.mealType as string) || 'Spuntino';
  const userId = params.userId as string || '';

  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]); 

  const results = query.length > 0 
    ? MOCK_DB.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const toggleItem = (item: any) => {
    const exists = cart.find(i => i.id === item.id);
    if (exists) {
      setCart(cart.filter(i => i.id !== item.id));
    } else {
      setCart([...cart, item]);
    }
  };

  const handleDone = () => {
    cart.forEach(async (food) => {
      try {
        await insertFoodLog({
            user_id: userId,
            food_name: food.name,
            meal_type: mealType.toLowerCase() as 'colazione' | 'pranzo' | 'cena' | 'spuntino',
            amount: 100, // Quantità fissa per esempio
        });
      } catch (error) {
        console.error('Errore durante l\'inserimento del log alimentare:', error);
      }
    });
    router.push('/(tabs)/diet');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: KyloPalette.background }}>
      
        {/* 1. HEADER CUSTOM */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/diet')} style={{ padding: 8 }}>
            <ThemedText type="link" style={{ color: KyloPalette.textMuted }}>Annulla</ThemedText>
          </TouchableOpacity>
          <ThemedText type="subtitle">Aggiungi a {mealType}</ThemedText>
          <TouchableOpacity onPress={handleDone} disabled={cart.length === 0} style={{ padding: 8 }}>
            <ThemedText type="link" style={{ color: cart.length > 0 ? KyloPalette.primary : '#333' }}>
              Fatto ({cart.length})
            </ThemedText>
          </TouchableOpacity>
        </View>

      {/* 2. BARRA DI RICERCA */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={KyloPalette.textMuted} style={{ marginRight: 8 }} />
        <TextInput 
          style={styles.input}
          placeholder="Cerca cibo (es. Banana)..."
          placeholderTextColor={KyloPalette.textMuted}
          value={query}
          onChangeText={setQuery}
          autoFocus={true}
        />
      </View>

      {/* 3. LISTA RISULTATI */}
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          query.length > 0 ? (
            <ThemedText style={{ textAlign: 'center', color: KyloPalette.textMuted, marginTop: 20 }}>
              Nessun risultato trovato.
            </ThemedText>
          ) : (
            <View style={{ alignItems: 'center', marginTop: 40, opacity: 0.5 }}>
              <Ionicons name="nutrition-outline" size={64} color={KyloPalette.textMuted} />
              <ThemedText style={{ marginTop: 10, color: KyloPalette.textMuted }}>
                Cerca un alimento per iniziare
              </ThemedText>
            </View>
          )
        }
        renderItem={({ item }) => {
          const isSelected = cart.find(c => c.id === item.id);
          return (
            <TouchableOpacity 
              style={[styles.resultItem, isSelected && styles.selectedItem]} 
              onPress={() => toggleItem(item)}
            >
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                <ThemedText type="caption" style={{ color: KyloPalette.textMuted }}>
                  {item.cal} kcal • P:{item.p} C:{item.c} F:{item.f}
                </ThemedText>
              </View>
              
              {/* Checkbox Visuale */}
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <Ionicons name="checkmark" size={16} color="#FFF" />}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* 4. MINI CARRELLO FLOTTANTE (Opzionale, se vuoi far vedere cosa ha scelto) */}
      {cart.length > 0 && (
        <View style={styles.floatingCart}>
          <ThemedText type="defaultSemiBold">Hai selezionato {cart.length} alimenti</ThemedText>
          <ThemedText type="caption" style={{ color: KyloPalette.textMuted }}>
            Totale: {cart.reduce((sum, i) => sum + i.cal, 0)} kcal
          </ThemedText>
        </View>
      )}

      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff10',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KyloPalette.inputBackground,
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 48,
  },
  input: {
    flex: 1,
    color: KyloPalette.text,
    fontSize: 16,
    height: '100%',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: KyloPalette.surface,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedItem: {
    borderWidth: 1,
    borderColor: KyloPalette.primary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: KyloPalette.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkboxSelected: {
    backgroundColor: KyloPalette.primary,
    borderColor: KyloPalette.primary,
  },
  floatingCart: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: KyloPalette.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: KyloPalette.primary,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 5,
  }
});

export default SearchFoodScreen;
