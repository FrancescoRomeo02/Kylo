// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Disattiva l'header per tutte le pagine di default
      }}
    >
      <Stack.Screen name="login" /> 
      
      {/* Riattiva l'header solo per la registrazione perché è una modal */}
      <Stack.Screen 
        name="signup" 
        options={{ 
          presentation: 'modal',
          headerShown: true, 
          headerTitle: 'Crea Account',
          headerStyle: { backgroundColor: '#0F0E17' }, // Usa il tuo Background
          headerTintColor: '#7C3AED', // Usa il tuo Primary
        }} 
      />
    </Stack>
  );
}