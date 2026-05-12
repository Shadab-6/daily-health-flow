// src/utils/theme.ts
export const COLORS = {
  primary: '#70E000',
  primaryDark: '#4CAF00',
  primaryLight: '#E8FFD0',
  primaryMid: '#A8E063',
  white: '#FFFFFF',
  black: '#000000',
  graysoft: '#E0E1DD',
  graymid: '#B0B2AD',
  graydark: '#6B6D68',
  background: '#F5F6F3',
  cardBg: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#555555',
  textMuted: '#999999',
  warning: '#FF8C00',
  warningLight: '#FFF3E0',
  error: '#E53E3E',
  info: '#3182CE',
  infoLight: '#EBF8FF',
  streakOrange: '#E67E00',
  streakLight: '#FFF5E0',
  youtubeRed: '#FF0000',
  success: '#38A169',
  border: '#E2E8F0',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    display: 28,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 8,
  },
};
