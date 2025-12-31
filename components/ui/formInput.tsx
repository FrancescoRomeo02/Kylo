import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

interface FormInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  textMuted?: string;
  surfaceColor?: string;
  textColor?: string;
  accentColor?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  footerLabel?: string;
  errorMessage?: string;
  successMessage?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  textMuted,
  surfaceColor,
  textColor,
  accentColor,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = 'none',
  footerLabel,
  errorMessage,
  successMessage,
}) => {
  const fallbackMuted = useThemeColor({}, 'textMuted');
  const fallbackSurface = useThemeColor({}, 'surface');
  const fallbackText = useThemeColor({}, 'text');
  const fallbackAccent = useThemeColor({}, 'accent');
  const errorColor = useThemeColor({}, 'error');
  const warningColor = useThemeColor({}, 'warning');

  const resolvedMuted = textMuted ?? fallbackMuted;
  const resolvedSurface = surfaceColor ?? fallbackSurface;
  const resolvedText = textColor ?? fallbackText;
  const resolvedAccent = accentColor ?? fallbackAccent;

  const borderColor = errorMessage ? errorColor : successMessage ? resolvedAccent : resolvedAccent;

  return (
    <View>
      <Text style={[styles.label, { color: resolvedMuted }]}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={resolvedMuted}
        onChangeText={onChangeText}
        value={value}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          { backgroundColor: resolvedSurface, color: resolvedText, borderColor },
        ]}
      />
      {errorMessage ? (
        <Text style={[styles.validation, { color: errorColor }]}>{errorMessage}</Text>
      ) : footerLabel ? (
        <TouchableOpacity onPress={() => { /* Implement forgot password logic here */ }}>
          <Text style={[styles.footer, { color: resolvedMuted }]}>{footerLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 56,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    fontSize: FontSizes.base,
    marginBottom: Spacing.xs,
    borderWidth: 0.7,
  },

  label: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.xs,
  },

  footer: {
    fontSize: FontSizes.sm,
    textAlign: 'right',
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },

  validation: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
});
export default FormInput;