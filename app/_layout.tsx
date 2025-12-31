import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import ErrorBoundary from '@/components/ErrorBoundary';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getProfileByUserId } from '@/lib/api/profiles';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export default function RootLayout() {

  const colorScheme = useColorScheme();
  const { session, initialized, setSession, setProfile, setInitialized } = useAuthStore();
  
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      if (session?.user) {
        const profile = await getProfileByUserId(session.user.id);
        setProfile(profile);
      } else {
        setProfile(null);
      }
      setInitialized(true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        const profile = await getProfileByUserId(nextSession.user.id);
        setProfile(profile);
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [setInitialized, setProfile, setSession]);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, initialized, segments]);

  return (
    <ErrorBoundary>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ title: 'Accedi', headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="SearchFood"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
    </ErrorBoundary>
  );
}