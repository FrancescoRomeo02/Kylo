import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { getProfileByUserId } from '@/lib/api/profiles';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    'SplineSans-Regular': require('../assets/fonts/SplineSans-Regular.ttf'),
    'SplineSans-Medium': require('../assets/fonts/SplineSans-Medium.ttf'),
    'SplineSans-SemiBold': require('../assets/fonts/SplineSans-SemiBold.ttf'),
    'SplineSans-Bold': require('../assets/fonts/SplineSans-Bold.ttf'),
    'SplineSans-Light': require('../assets/fonts/SplineSans-Light.ttf'),
  });

  const colorScheme = useColorScheme();
  const { session, initialized, setSession, setProfile, setInitialized } = useAuthStore();
  
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!fontsLoaded) return;

    // Imposta il font predefinito per ogni componente Text
    Text.defaultProps = Text.defaultProps || {};
    const defaultStyle = Array.isArray(Text.defaultProps.style)
      ? Text.defaultProps.style
      : [Text.defaultProps.style].filter(Boolean);
    Text.defaultProps.style = [...defaultStyle, { fontFamily: 'SplineSans-Regular' }];

    SplashScreen.hideAsync();
  }, [fontsLoaded]);
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

    // Logica di reindirizzamento
    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, initialized, segments]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ title: 'Accedi', headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}