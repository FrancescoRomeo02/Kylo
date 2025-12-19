import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomButtonProps {
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    primaryColor?: string;
    text?: string;
    icon?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    onPress,
    loading = false,
    disabled = false,
    primaryColor = '#7C3AED',
    text = 'Default Button',
    icon = null, // Optional
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.CustomButtonPrimary,
                { backgroundColor: primaryColor },
                loading && { opacity: 0.7 },
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' , gap: 8 }}>
                <Text style={styles.CustomButtonText}>{text}</Text>
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
    },
    CustomButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CustomButton;