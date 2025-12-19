import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase'; // Assicurati che il percorso sia corretto
import { Session } from '@supabase/supabase-js';

export default function RootLayout() {

  const colorScheme = useColorScheme();
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Inizializza la sessione
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    // 2. Ascolta i cambiamenti
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    // Logica di reindirizzamento
    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Se non c'è sessione e non siamo nel gruppo login, vai al login
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // Se siamo loggati ma siamo ancora nel login, vai alla home
      router.replace('/(tabs)');
    }
  }, [session, initialized, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Schermi per chi NON è loggato */}
        <Stack.Screen name="(auth)/login" options={{ title: 'Accedi', headerShown: false }} />
        
        {/* Schermi per chi è loggato */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}