import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
/*
 ERROR  Text strings must be rendered within a <Text> component. 

Code: themed-view.tsx
  11 |   const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  12 |
> 13 |   return <View style={[{ backgroundColor }, style]} {...otherProps} />;
     |          ^
  14 | }
*/