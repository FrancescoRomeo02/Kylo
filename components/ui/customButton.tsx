import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
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
    const buttonText = useThemeColor({}, 'buttonText');
    const buttonDisabled = useThemeColor({}, 'buttonDisabled');

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
                    contentColor: buttonText,
                    shadowColor: primaryColorOverride ?? tint,
                    borderColor: primaryColorOverride ?? tint,
                };
        }
    }, [primaryColorOverride, surface, tint, variant, buttonText]);

    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                styles.CustomButtonPrimary,
                { backgroundColor, borderColor, shadowColor },
                variant === 'ghost' && styles.Ghost,
                isDisabled && styles.Disabled,
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
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.sm,
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
        fontSize: FontSizes.base,
        fontWeight: '600',
    },
    Row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    Disabled: {
        shadowOpacity: 0,
        elevation: 0,
        opacity: 0.6,
    },
});

export default CustomButton;