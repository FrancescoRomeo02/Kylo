import { ThemedText } from '@/components/themed-text';
import CustomButton from '@/components/ui/customButton';
import FormInput from '@/components/ui/formInput';
import { IconSymbol } from '@/components/ui/icon-symbol';
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
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function AuthGate() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const { setProfile } = useAuthStore();

  // Recuperiamo i colori definiti nel Design System
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const surfaceColor = useThemeColor({}, 'surface');
  const textMuted = useThemeColor({}, 'textMuted');
  const primaryColor = useThemeColor({}, 'tint');

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
      <View style={styles.innerContainer}>
        <ThemedText type="title">
          Ben tornato, attleta!
        </ThemedText>
        <ThemedText type="defaultSemiBold">
          Accedi all'allenamento del futuro.
        </ThemedText>

        <View style={styles.form}>
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
          />

          <FormInput 
            label="Password" 
            placeholder="La tua password" 
            onChangeText={setPassword} 
            value={password}
            secureTextEntry={true}
          />

          <CustomButton 
            onPress={handleSignIn} 
            loading={loading} 
            text="Accedi"
            disabled={!canSubmit}
            icon={<IconSymbol name="arrow.right" size={20} color="#fff" />}
          />
          <Link
            href="/(auth)/signup" 
            asChild
          >
            <TouchableOpacity 
              style={styles.buttonSecondary} 
              disabled={loading}
            >
              <Text style={[styles.buttonText, { color: primaryColor }]}>
                Sign up
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: 'red',
    borderWidth: 5,
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    borderColor: 'green',
    borderWidth: 5,
  },
  form: {
    gap: 6,
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