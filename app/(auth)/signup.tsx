import MessageBanner from '@/components/ui/messageBanner';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import CustomButton from '@/components/ui/customButton';
import FormInput from '@/components/ui/formInput';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { upsertProfile } from '@/lib/api/profiles';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthGate() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const { setProfile } = useAuthStore();

  // Recuperiamo i colori definiti nel Design System
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'tint');
  const surfaceColor = useThemeColor({}, 'surface');
  const textMuted = useThemeColor({}, 'textMuted');

  const canSubmit = useMemo(() => {
    const emailValid = /.+@.+\..+/.test(email.trim());
    const hasFullName = fullName.trim().length > 1;
    const passwordStrong = password.length >= 8;
    const passwordsMatch = password === confirmPassword;
    return emailValid && hasFullName && passwordStrong && passwordsMatch;
  }, [confirmPassword, email, fullName, password]);

  async function handleSignUp() {
    const emailTrimmed = email.trim();
    const emailValid = /.+@.+\..+/.test(emailTrimmed);
    if (!emailValid) {
      setFeedback({ type: 'error', message: 'Inserisci un indirizzo email valido.' });
      return;
    }
    if (fullName.trim().length < 2) {
      setFeedback({ type: 'error', message: 'Inserisci il tuo nome completo.' });
      return;
    }
    if (password.length < 8) {
      setFeedback({ type: 'error', message: 'La password deve avere almeno 8 caratteri.' });
      return;
    }
    if (password !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Le password non coincidono.' });
      return;
    }

    setFeedback(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: emailTrimmed,
      password,
      options: { data: { full_name: fullName.trim() } },
    });
    if (error) {
      setFeedback({ type: 'error', message: error.message });
      setLoading(false);
      return;
    }

    // Create or update the profile row in 'profiles' table for this user
    if (data?.user) {
      const upserted = await upsertProfile({
        id: data.user.id,
        full_name: fullName.trim(),
        email: emailTrimmed,
        username: emailTrimmed.split('@')[0],
      });
      setProfile(upserted);
    }

    setFeedback({ type: 'success', message: 'Controlla la tua email per confermare il tuo account.' });
    setLoading(false);
    router.replace('/(auth)');
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor }]}
    >
      <View style={styles.innerContainer}>
        <Text style={[styles.title, { color: primaryColor }]}>Kylo</Text>
        <Text style={[styles.subtitle, { color: textMuted }]}>
          Crea un nuovo account per iniziare il tuo viaggio con Kylo
        </Text>

        <View style={styles.form}>
        {feedback ? (
          <MessageBanner
            message={feedback.message}
            type={feedback.type}
            onClose={() => setFeedback(null)}
          />
        ) : null}

        <FormInput 
            label="Nome Completo" 
            placeholder="Jon Doe" 
            onChangeText={setFullName} 
            value={fullName}
            autoCapitalize="words"
            textMuted={textMuted}
            surfaceColor={surfaceColor}
            textColor={textColor}
            accentColor={primaryColor}
          />

          <FormInput 
            label="Email" 
            placeholder="jon.doe@example.com" 
            onChangeText={setEmail} 
            value={email}
            textMuted={textMuted}
            surfaceColor={surfaceColor}
            textColor={textColor}
            keyboardType="email-address"
          />  
          
          <FormInput 
            label="Password" 
            placeholder="Crea una password sicura" 
            onChangeText={setPassword} 
            value={password}
            textMuted={textMuted}
            surfaceColor={surfaceColor}
            textColor={textColor}
            accentColor={primaryColor}
            secureTextEntry={true}
          />

          <FormInput 
            label="Conferma Password" 
            placeholder="Reinserisci la tua password" 
            onChangeText={setConfirmPassword} 
            value={confirmPassword}
            secureTextEntry={true}
          />

          <CustomButton 
            onPress={handleSignUp} 
            loading={loading} 
            text="Crea Account"
            disabled={!canSubmit}
            icon={<IconSymbol name="arrow.right" size={20} color="#fff" />}
          />  
          
            <TouchableOpacity 
              style={styles.buttonSecondary} 
              disabled={loading}
              onPress={() => router.back()}
            >
              <Text style={[styles.buttonText, { color: primaryColor }]}>
                Torna al login
              </Text>
            </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 8,
  },
  form: {
    gap: 4,
  },
  buttonSecondary: {
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  }
});