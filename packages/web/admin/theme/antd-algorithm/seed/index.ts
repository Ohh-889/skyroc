import type { SeedToken } from 'antd/lib/theme/interface';

export const defaultPresetColors: Partial<SeedToken> = {
  // Blue palette
  blue: '#3B82F6', // Tailwind blue-500
  geekblue: '#6366F1', // Indigo for better distinction from blue
  cyan: '#06B6D4', // Tailwind cyan-500

  // Purple/Pink palette
  purple: '#8B5CF6', // Tailwind violet-500
  magenta: '#D946EF', // Tailwind fuchsia-500
  pink: '#EC4899', // Tailwind pink-500

  // Red/Orange palette
  red: '#EF4444', // Tailwind red-500
  orange: '#F97316', // Tailwind orange-500
  volcano: '#DC2626', // Tailwind red-600

  // Yellow/Gold palette
  yellow: '#EAB308', // Tailwind yellow-500
  gold: '#D97706', // Tailwind amber-600

  // Green palette
  green: '#10B981', // Tailwind emerald-500
  lime: '#84CC16', // Tailwind lime-500

  // Main Colors
  colorPrimary: '#6366F1',
  colorInfo: '#0EA5E9',
  colorSuccess: '#10B981',
  colorWarning: '#F59E0B',
  colorError: '#F43F5E'
};

export const seedToken: Partial<SeedToken> = {
  ...defaultPresetColors,

  fontSize: 14,

  borderRadius: 6
};
