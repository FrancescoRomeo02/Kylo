import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CustomButton from '@/components/ui/customButton';
import FormInput from '@/components/ui/formInput';
import { IconSymbol } from '@/components/ui/icon-symbol';
import LogoWordmark from '@/components/ui/logoWordmark';
import MessageBanner from '@/components/ui/messageBanner';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getProfileByUserId } from '@/lib/api/profiles';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { Link } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

export default function AuthGate() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const { setProfile } = useAuthStore();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const surfaceColor = useThemeColor({}, 'surface');
  const textMuted = useThemeColor({}, 'textMuted');
  const primaryColor = useThemeColor({}, 'tint');

  const emailError = email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ? 'Email non valida'
    : '';
  const passwordError = password && password.length < 6
    ? 'Minimo 6 caratteri'
    : '';
  const passwordSuccess = password && password.length >= 6
    ? 'Password valida'
    : '';

  const canSubmit = useMemo(() => {
    const emailValid = /.+@.+\..+/.test(email.trim());
    return emailValid && password.length >= 6;
  }, [email, password]);

  async function handleSignIn() {
    const emailTrimmed = email.trim();
    const emailValid = /.+@.+\..+/.test(emailTrimmed);
    if (!emailValid) {
      setFeedback({ type: 'error', message: 'Inserisci un indirizzo email valido.' });
      return;
    }
    if (password.length < 6) {
      setFeedback({ type: 'error', message: 'La password deve avere almeno 6 caratteri.' });
      return;
    }

    setFeedback(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailTrimmed,
      password,
    });
    if (error) {
      setFeedback({ type: 'error', message: error.message });
    }
    if (data?.user) {
      const profile = await getProfileByUserId(data.user.id);
      setProfile(profile);
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor }]}
    >

      <ThemedView style={styles.content}>
        <LogoWordmark size={56} align="center" />
        <ThemedText type="title" style={styles.title}>Ben tornato, atleta!</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>Accedi all'allenamento del futuro.</ThemedText>

        <ThemedView style={[styles.card, { backgroundColor: surfaceColor }]}>
          {feedback ? (
            <MessageBanner
              message={feedback.message}
              type={feedback.type}
              onClose={() => setFeedback(null)}
            />
          ) : null}

          <FormInput
            label="Email"
            placeholder="athlete@example.com"
            onChangeText={setEmail}
            value={email}
            textMuted={textMuted}
            surfaceColor={surfaceColor}
            textColor={textColor}
            keyboardType="email-address"
            errorMessage={emailError}
          />

          <FormInput
            label="Password"
            placeholder="La tua password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry={true}
            footerLabel="Password dimenticata?"
            errorMessage={passwordError}
            successMessage={passwordSuccess}
          />
          <CustomButton
            onPress={handleSignIn}
            loading={loading}
            text="Accedi"
            disabled={!canSubmit}
            icon={<IconSymbol name="arrow.right" size={20} color="#fff" />}
          />

          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity style={styles.linkContainer} disabled={loading}>
              <ThemedText style={{ color: textMuted }}>Non hai un account?</ThemedText>
              <ThemedText style={{ color: primaryColor }}>Registrati</ThemedText>
            </TouchableOpacity>
          </Link>
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    marginTop: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.85,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    marginTop: 24,
    borderRadius: 24,
    padding: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },

  linkContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
});