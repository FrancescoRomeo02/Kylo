
import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../themed-text';
import { IconSymbol } from './icon-symbol';

interface MacroCardProps {
    macroName: string;
    ammount: number;
    dailyTarget: string;
    macroColors: string;
    setMacro: (value: number) => void;
    isDark: boolean;
}

const MacroCard: React.FC<MacroCardProps> = ({ammount, dailyTarget, macroName, macroColors, setMacro, isDark }) => {
      const surfaceColor = useThemeColor({}, 'surface');
      const surfaceAlt = useThemeColor({}, 'surfaceAlt');
      const textMuted = useThemeColor({}, 'textMuted');

      const kcalFactor = macroName === 'Proteine' || macroName === 'Carboidrati' ? 4 : 9;
      const iconName = macroName === 'Proteine' ? 'fish.fill' : macroName === 'Carboidrati' ? 'bolt.fill' : 'drop.fill';
    
    return (
        <View style={[styles.macroItem, { backgroundColor: surfaceColor }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                    <View style={{ width: 32, height: 32, borderRadius: BorderRadius.lg, backgroundColor: macroColors + '33', justifyContent: 'center', alignItems: 'center' }}>
                    <IconSymbol name={iconName} size={24} color={macroColors} />
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <ThemedText type='subtitle'>{macroName}</ThemedText>
                        <ThemedText style={[styles.macroValue, { marginTop: Spacing.xs }]}>{kcalFactor} kcal/g</ThemedText>
                    </View>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', gap: Spacing.sm }}>
                    <ThemedText type='subtitle' style={{ color: macroColors }}>
                        {Math.round((ammount / 100) * parseInt(dailyTarget)/kcalFactor)}g
                    </ThemedText>
                    <ThemedText type='caption' style={{ color: textMuted }}>
                        {Math.round(ammount)}%
                    </ThemedText>
                </View>
            </View>
    
            <Slider
                style={{ height: 40 }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={ammount}
                onValueChange={setMacro}
                minimumTrackTintColor={macroColors}
                maximumTrackTintColor={surfaceAlt}
                thumbTintColor={macroColors}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    macroItem: {
        width: '100%',
        marginTop: Spacing.lg,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        gap: Spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    macroValue: {
        fontSize: FontSizes.sm,
        opacity: 0.7,
    },
});

export default MacroCard;