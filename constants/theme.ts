import { Platform } from 'react-native';

// Palette estratta dal tuo Design System
const KyloPalette = {
  primary: '#7C3AED',    // Primary Purple (Actions, Brand)
  accent: '#C4B5FD',     // Accent Soft (Highlights)
  background: '#0F0E17', // Background
  surface: '#1E1B2E',    // Surface (Cards, Inputs)
  error: '#EF4444',      // Error
  warning: '#FBBF24',    // Warning
  text: '#FFFFFF',       // White Text
  textMuted: '#9BA1A6',  // Gray Text
};

export const Colors = {
  light: {
    text: '#11181C',
    textMuted : '#687076',
    background: '#FFFFFF',
    tint: KyloPalette.primary,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: KyloPalette.primary,

    surface: KyloPalette.surface,
    accent: KyloPalette.accent,
    error: KyloPalette.error,
    warning: KyloPalette.warning,
  },
  dark: {
    text: KyloPalette.text,
    textMuted : KyloPalette.textMuted,
    background: KyloPalette.background,
    tint: KyloPalette.primary,
    icon: KyloPalette.textMuted,
    tabIconDefault: KyloPalette.textMuted,
    tabIconSelected: KyloPalette.primary,
    
    surface: KyloPalette.surface,
    accent: KyloPalette.accent,
    error: KyloPalette.error,
    warning: KyloPalette.warning,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
