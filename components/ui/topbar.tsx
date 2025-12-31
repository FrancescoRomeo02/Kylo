import { FontSizes, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';
import { IconSymbol } from './icon-symbol';

interface TopBarProps {
    onPress: () => void;
    fullName: string;
    loading?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
    onPress,
    loading = false,
    fullName,
}) => {
    const tintColor = useThemeColor({}, 'tint');
    const accentColor = useThemeColor({}, 'accent');
    
    return (
        <ThemedView style={styles.TopBar} onTouchEnd={onPress}>
            <IconSymbol size={28} name="person.fill" color={tintColor} />
            <ThemedView style={styles.TopBarTextDiv}>
                <ThemedText style={[styles.TopBarSecondaryText, { color: accentColor }]}>Buongiorno</ThemedText>
                <ThemedText style={[styles.TopBarText, { color: tintColor }]}>{fullName}</ThemedText>
            </ThemedView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    TopBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    TopBarTextDiv: {
        flexDirection: 'column',
    },
    TopBarText: {
        fontSize: FontSizes.xl,
        fontWeight: '600',
    },
    TopBarSecondaryText:{
        fontSize: FontSizes.sm,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});

export default TopBar;