import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

type LogoWordmarkProps = {
  size?: number;
  align?: 'left' | 'center';
};

const LogoWordmark: React.FC<LogoWordmarkProps> = ({ size = 52, align = 'center' }) => {
  const textColor = useThemeColor({}, 'text');
  const primary = useThemeColor({}, 'tint');

  return (
    <View style={[styles.container, align === 'center' ? styles.center : undefined]}>
      <View style={[styles.underline, { backgroundColor: primary }]} />
      <Text
        accessibilityRole="header"
        style={[
          styles.wordmark,
          {
            fontSize: size,
            lineHeight: size * 0.98,
            color: textColor,
            textShadowColor: primary,
          },
        ]}
      >
        Kylo
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  center: {
    alignItems: 'center',
  },
  wordmark: {
    fontWeight: '900',
    letterSpacing: 1,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  underline: {
    position: 'absolute',
    left: 6,
    right: 6,
    bottom: 4,
    height: 10,
    borderRadius: 999,
    opacity: 0.18,
  },
});

export default LogoWordmark;
