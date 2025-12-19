import { IconSymbol } from '@/components/ui/icon-symbol.ios';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function AuthGate() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Recuperiamo i colori definiti nel Design System
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'tint');
  const surfaceColor = useThemeColor({}, 'surface');
  const textMuted = '#9BA1A6'; // Dal tuo schema Color Palette

  async function handleSignUp() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email: email.trim(), 
      password 
    });
    if (error) Alert.alert("Errore", error.message);
    else Alert.alert('Successo', 'Controlla la tua email!');
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
          Crea un nuovo account per iniziare il tuo viaggio con Kylo
        </Text>

        <View style={styles.form}>

        <TextInput 
            placeholder="Nome Completo" 
            placeholderTextColor={textMuted}
            onChangeText={setFullName} 
            value={fullName} 
            style={[styles.input, { backgroundColor: surfaceColor, color: textColor }]}
          />

          <TextInput 
            placeholder="Email" 
            placeholderTextColor={textMuted}
            onChangeText={setEmail} 
            value={email} 
            autoCapitalize="none"
            keyboardType="email-address"
            style={[styles.input, { backgroundColor: surfaceColor, color: textColor }]}
          />
          
          <TextInput 
            placeholder="Password" 
            placeholderTextColor={textMuted}
            secureTextEntry 
            onChangeText={setPassword} 
            value={password}
            style={[styles.input, { backgroundColor: surfaceColor, color: textColor }]}
          />

          <TextInput 
            placeholder="Conferma Password" 
            placeholderTextColor={textMuted}
            secureTextEntry 
            onChangeText={setConfirmPassword} 
            value={confirmPassword}
            style={[styles.input, { backgroundColor: surfaceColor, color: textColor }]}
          />

          <TouchableOpacity 
            style={[styles.buttonPrimary, { backgroundColor: primaryColor }, loading && { opacity: 0.7 }]} 
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8} }
              >
              <Text style={styles.buttonText}>
                Accedi
              </Text>
              <IconSymbol name="arrow.right" color={surfaceColor} />
              </View>
            )}
          </TouchableOpacity>
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
    gap: 4,
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 12, // Come da Design System "Surface"
    fontSize: 16,
    marginBottom: 16,
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