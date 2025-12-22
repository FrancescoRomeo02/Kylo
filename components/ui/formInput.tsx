import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';

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
}) => {
  const fallbackMuted = useThemeColor({}, 'textMuted');
  const fallbackSurface = useThemeColor({}, 'surface');
  const fallbackText = useThemeColor({}, 'text');
  const fallbackAccent = useThemeColor({}, 'accent');

  const resolvedMuted = textMuted ?? fallbackMuted;
  const resolvedSurface = surfaceColor ?? fallbackSurface;
  const resolvedText = textColor ?? fallbackText;
  const resolvedAccent = accentColor ?? fallbackAccent;

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
          { backgroundColor: resolvedSurface, color: resolvedText, borderColor: resolvedAccent },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 0.7,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default FormInput;