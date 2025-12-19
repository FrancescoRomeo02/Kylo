import CustomButton from '@/components/ui/CustomButton';
import FormInput from '@/components/ui/formInput';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
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

  // Recuperiamo i colori definiti nel Design System
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'tint');
  const accentColor = useThemeColor({}, 'accent');
  const surfaceColor = useThemeColor({}, 'surface');
  const textMuted = useThemeColor({}, 'textMuted');

  async function handleSignIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ 
      email: email.trim(), 
      password 
    });
    if (error) Alert.alert("Errore", error.message);
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor }]}
    >
      <View style={styles.innerContainer}>
        <Text style={[styles.title, { color: primaryColor }]}>Kylo</Text>
        <Text style={[styles.subtitle, { color: textMuted }]}>
          Benvenuto nell'allenamento del futuro
        </Text>

        <View style={styles.form}>
          <FormInput 
            label="Email" 
            placeholder="athlete@example.com" 
            onChangeText={setEmail} 
            value={email}
            textMuted={textMuted}
            surfaceColor={surfaceColor}
            textColor={textColor}
            accentColor={accentColor}
          />

          <FormInput 
            label="Password" 
            placeholder="La tua password" 
            onChangeText={setPassword} 
            value={password}
            textMuted={textMuted}
            surfaceColor={surfaceColor}
            textColor={textColor}
            accentColor={accentColor}
            secureTextEntry={true}
          />

          <CustomButton 
            onPress={handleSignIn} 
            loading={loading} 
            primaryColor={primaryColor}
            text="Accedi"
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
                Crea un nuovo account
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
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontFamily: 'SplineSans-Bold',
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
    gap: 6,
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 12, // Come da Design System "Surface"
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 0.7,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  buttonPrimary: {
    height: 56,
    borderRadius: 99, // Bottoni a pillola come nel design
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    // Aggiungiamo un leggero effetto ombra/glow tipico del tuo stile
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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