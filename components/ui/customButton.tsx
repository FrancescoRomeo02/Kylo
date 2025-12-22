import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface CustomButtonProps {
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    text?: string;
    icon?: React.ReactNode;
    variant?: ButtonVariant;
    primaryColorOverride?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    onPress,
    loading = false,
    disabled = false,
    text = 'Default Button',
    icon = null,
    variant = 'primary',
    primaryColorOverride,
}) => {
    const tint = useThemeColor({}, 'tint');
    const surface = useThemeColor({}, 'surface');

    const { backgroundColor, contentColor, shadowColor, borderColor } = useMemo(() => {
        switch (variant) {
            case 'secondary':
                return {
                    backgroundColor: surface,
                    contentColor: tint,
                    shadowColor: tint,
                    borderColor: tint,
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    contentColor: tint,
                    shadowColor: 'transparent',
                    borderColor: tint,
                };
            default:
                return {
                    backgroundColor: primaryColorOverride ?? tint,
                    contentColor: '#fff',
                    shadowColor: primaryColorOverride ?? tint,
                    borderColor: primaryColorOverride ?? tint,
                };
        }
    }, [primaryColorOverride, surface, tint, variant]);

    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                styles.CustomButtonPrimary,
                { backgroundColor, borderColor, shadowColor },
                variant === 'ghost' && styles.Ghost,
                isDisabled && { opacity: 0.55 },
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={contentColor} />
            ) : (
                <View style={styles.Row}>
                    <Text style={[styles.CustomButtonText, { color: contentColor }]}>{text}</Text>
                    {icon}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    CustomButtonPrimary: {
        height: 56,
        borderRadius: 99,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
    },
    Ghost: {
        shadowOpacity: 0,
        elevation: 0,
    },
    CustomButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    Row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});

export default CustomButton;