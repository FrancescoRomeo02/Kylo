import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'caption';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'caption' ? styles.caption : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'SplineSans-Regular',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'SplineSans-SemiBold',
  },
  title: {
    fontSize: 32,
    fontFamily: 'SplineSans-Bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 22,
    fontFamily: 'SplineSans-SemiBold',
    lineHeight: 28,
  },
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'SplineSans-Light',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    fontFamily: 'SplineSans-Medium',
    color: '#0a7ea4',
  },
});
