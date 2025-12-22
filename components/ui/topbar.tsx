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
    return (
        <ThemedView style={styles.TopBar} onTouchEnd={onPress}>
            <IconSymbol size={28} name="person.fill" color="#7C3AED" />
            <ThemedView style={styles.TopBarTextDiv}>
                <ThemedText style={styles.TopBarSecondaryText}>Buongiorno</ThemedText>
                <ThemedText style={styles.TopBarText}>{fullName}</ThemedText>
            </ThemedView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    TopBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    TopBarTextDiv: {
        flexDirection: 'column',
    },
    TopBarText: {
        color: '#7C3AED',
        fontSize: 22,
        fontWeight: '600',
    },
    TopBarSecondaryText:{
        color: '#A78BFA',
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});

export default TopBar;