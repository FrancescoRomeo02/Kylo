import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type BannerType = 'info' | 'error' | 'success';

interface MessageBannerProps {
  message: string;
  type?: BannerType;
  onClose?: () => void;
}

const MessageBanner: React.FC<MessageBannerProps> = ({ message, type = 'info', onClose }) => {
  const tint = useThemeColor({}, 'tint');
  const error = useThemeColor({}, 'error');
  const accent = useThemeColor({}, 'accent');
  const text = useThemeColor({}, 'text');
  const surface = useThemeColor({}, 'surface');

  const palette = {
    info: { background: surface, border: tint },
    success: { background: surface, border: accent },
    error: { background: surface, border: error },
  } as const;

  const colors = palette[type];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}> 
      <Text style={[styles.text, { color: text }]}>{message}</Text>
      {onClose ? (
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
          <Text style={[styles.close, { color: colors.border }]}>x</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  text: {
    flex: 1,
    fontSize: FontSizes.md,
  },
  close: {
    fontSize: FontSizes.md,
    marginLeft: Spacing.md,
  },
});

export default MessageBanner;
