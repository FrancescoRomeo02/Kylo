import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function DietScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      {/* TOP BAR: Il padding superiore è dinamico in base al dispositivo */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <ThemedText type="subtitle" style={styles.topBarTitle}>La tua Dieta</ThemedText>
      </View>

      {/* MAIN BLOCK: Occupa tutto lo spazio rimanente */}
      <ThemedView style={styles.main}>
        <ThemedText>Benvenuto! Questo è il tuo blocco principale.</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Occupa tutto lo schermo, inclusa la zona sotto la status bar
  },
  topBar: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)', // Una linea sottile e discreta
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  main: {
    flex: 1, // Questo fa sì che il blocco main "mangi" tutto lo spazio disponibile
    padding: 20,
    // Allineamento in alto (rimosso il center che avevamo prima)
    justifyContent: 'flex-start', 
  },
});