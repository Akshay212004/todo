import { Priority } from '../types';

/**
 * Design tokens. Cool paper-grey background, deep teal as the single brand colour,
 * and priority colours that carry meaning (they are the only other hues in the UI).
 */
export const colors = {
  background: '#F2F5F7',
  surface: '#FFFFFF',
  ink: '#111C26',
  muted: '#5F6F7C',
  border: '#DDE4E9',
  primary: '#0E6F63',
  primaryTint: '#E1F1EE',
  onPrimary: '#FFFFFF',
  danger: '#C62F3B',
  dangerTint: '#FBE7E9',
  success: '#2F7D4F',
};

export const priorityColors: Record<Priority, { solid: string; tint: string }> = {
  Low: { solid: '#4A78A8', tint: '#E6EEF6' },
  Medium: { solid: '#B7791F', tint: '#FBF0DB' },
  High: { solid: '#C62F3B', tint: '#FBE7E9' },
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };

export const typography = {
  title: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5, color: colors.ink },
  heading: { fontSize: 17, fontWeight: '600' as const, color: colors.ink },
  body: { fontSize: 15, color: colors.ink },
  caption: { fontSize: 13, color: colors.muted },
};
