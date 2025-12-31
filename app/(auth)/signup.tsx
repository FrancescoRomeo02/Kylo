import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CustomButton from '@/components/ui/customButton';
import FormInput from '@/components/ui/formInput';
import { IconSymbol } from '@/components/ui/icon-symbol';
import LogoWordmark from '@/components/ui/logoWordmark';
import MessageBanner from '@/components/ui/messageBanner';
import { useThemeColor } from '@/hooks/use-theme-color';
import { upsertProfile } from '@/lib/api/profiles';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const { setProfile } = useAuthStore();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'tint');
  const surfaceColor = useThemeColor({}, 'surface');
  const textMuted = useThemeColor({}, 'textMuted');

  const fullNameError = fullName.trim() && fullName.trim().length < 2
    ? 'Inserisci almeno 2 caratteri'
    : '';
  const fullNameSuccess = fullName.trim().length >= 2
    ? 'Nome valido'
    : '';

  const emailError = email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ? 'Email non valida'
    : '';
  const emailSuccess = email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ? 'Email valida'
    : '';

  const passwordError = password && password.length < 8
    ? 'Minimo 8 caratteri'
    : '';
  const passwordSuccess = password && password.length >= 8
    ? 'Password valida'
    : '';

  const passwordMatchError = confirmPassword && password !== confirmPassword
    ? 'Le password non coincidono'
    : '';
  const passwordMatchSuccess = confirmPassword && password === confirmPassword && password.length >= 8
    ? 'Password corrette'
    : '';

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
      <View style={[styles.decorBubbleTop, { backgroundColor: primaryColor }]} />
      <View style={[styles.decorBubbleBottom, { backgroundColor: primaryColor }]} />

      <ThemedView style={styles.content}>
        <LogoWordmark size={56} align="center" />
        <ThemedText type="title" style={styles.title}>Crea il tuo account</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>Unisciti a Kylo e inizia ora.</ThemedText>

        <ThemedView style={[styles.card, { backgroundColor: surfaceColor }]}>
          {feedback ? (
            <MessageBanner
              message={feedback.message}
              type={feedback.type}
              onClose={() => setFeedback(null)}
            />
          ) : null}

          <FormInput
            label="Nome Completo"
            placeholder="John Doe"
            onChangeText={setFullName}
            value={fullName}
            autoCapitalize="words"
            textMuted={textMuted}
            surfaceColor={surfaceColor}
            textColor={textColor}
            accentColor={primaryColor}
            errorMessage={fullNameError}
            successMessage={fullNameSuccess}
          />

          <FormInput
            label="Email"
            placeholder="john.doe@example.com"
            onChangeText={setEmail}
            value={email}
            textMuted={textMuted}
            surfaceColor={surfaceColor}
            textColor={textColor}
            keyboardType="email-address"
            errorMessage={emailError}
            successMessage={emailSuccess}
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
            errorMessage={passwordError}
            successMessage={passwordSuccess}
          />

          <FormInput
            label="Conferma Password"
            placeholder="Reinserisci la tua password"
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            textMuted={textMuted}
            surfaceColor={surfaceColor}
            textColor={textColor}
            secureTextEntry={true}
            errorMessage={passwordMatchError}
            successMessage={passwordMatchSuccess}
          />

          <CustomButton
            onPress={handleSignUp}
            loading={loading}
            text="Crea Account"
            disabled={!canSubmit}
            icon={<IconSymbol name="arrow.right" size={20} color="#fff" />}
          />

          <TouchableOpacity
            style={styles.linkContainer}
            disabled={loading}
            onPress={() => router.back()}
          >
            <ThemedText style={{ color: textMuted }}>Hai già un account?</ThemedText>
            <ThemedText style={{ color: primaryColor }}>Accedi</ThemedText>
          </TouchableOpacity>
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
  decorBubbleTop: {
    position: 'absolute',
    top: -120,
    right: -90,
    width: 220,
    height: 220,
    borderRadius: 220,
    opacity: 0.14,
  },
  decorBubbleBottom: {
    position: 'absolute',
    bottom: -140,
    left: -100,
    width: 260,
    height: 260,
    borderRadius: 260,
    opacity: 0.1,
  },
});