import { useEffect } from 'react';
import { useTheme } from '../hooks/use-theme';
import { getInternalStorage } from '../setup';
import { toggleAuxiliaryColorModes, toggleCssDarkMode } from '../utils';

const STORAGE_KEYS = {
  darkMode: 'darkMode',
  themeColor: 'themeColor',
  themeSettings: 'themeSettings'
} as const;

const ThemeEffect = () => {
  const { colourWeaknessMode, darkMode, grayscaleMode, settings, themeColors, updateWatermarkTimer, watermark } =
    useTheme();

  function cacheThemeSettings() {
    if (import.meta.env.DEV) return;
    getInternalStorage()?.set(STORAGE_KEYS.themeSettings, settings);
  }

  // Cache theme settings when page is closed or refreshed
  useEffect(() => {
    function handleBeforeUnload() {
      cacheThemeSettings();
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Watch dark mode
  useEffect(() => {
    toggleCssDarkMode(darkMode);
    getInternalStorage()?.set(STORAGE_KEYS.darkMode, darkMode);
  }, [darkMode]);

  // Watch grayscale and colour weakness modes
  useEffect(() => {
    toggleAuxiliaryColorModes(grayscaleMode, colourWeaknessMode);
  }, [grayscaleMode, colourWeaknessMode]);

  // Watch theme colors change, update storage theme color
  useEffect(() => {
    getInternalStorage()?.set(STORAGE_KEYS.themeColor, themeColors.primary);
  }, [themeColors]);

  // Watch watermark settings to control timer
  useEffect(() => {
    updateWatermarkTimer();
  }, [watermark.visible, watermark.enableTime]);

  return null;
};

export default ThemeEffect;
