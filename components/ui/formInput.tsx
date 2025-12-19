import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface FormInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    textMuted: string;
    surfaceColor: string;
    textColor: string;
    accentColor: string;
    secureTextEntry?: boolean;
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
}) => {
    return (
        <View>
            <Text style={[styles.label, { color: textMuted }]}>{label}</Text>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={textMuted}
                onChangeText={onChangeText}
                value={value}
                autoCapitalize="none"
                keyboardType="email-address"
                secureTextEntry={secureTextEntry}
                style={[styles.input, { backgroundColor: surfaceColor, color: textColor, borderColor: accentColor }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default FormInput;