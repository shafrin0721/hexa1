import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGE_STORAGE_KEY = 'hexal_language_preference';
const FONT_SIZE_STORAGE_KEY = 'hexal_font_size_preference';

export function useLanguage() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setCurrentLanguage(savedLanguage);
    }
  }, [i18n]);

  const changeLanguage = useCallback(
    async (languageCode) => {
      try {
        await i18n.changeLanguage(languageCode);
        localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
        setCurrentLanguage(languageCode);
      } catch (error) {
        console.error('Failed to change language:', error);
      }
    },
    [i18n]
  );

  return {
    currentLanguage,
    changeLanguage,
    languages: i18n.languages || []
  };
}

export function useTypography() {
  const [fontScale, setFontScale] = useState(() => {
    const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
    const parsed = saved ? parseInt(saved, 10) : 100;
    return Number.isFinite(parsed) ? parsed : 100;
  });

  // Persist preference only; do not globally resize all app fonts.
  useEffect(() => {
    localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(fontScale));
  }, [fontScale]);

  const updateFontScale = useCallback((scale) => {
    // Clamp between 70% and 150%
    const clamped = Math.min(Math.max(scale, 70), 150);
    setFontScale(clamped);
  }, []);

  return {
    fontScale,
    updateFontScale,
    minScale: 70,
    maxScale: 150
  };
}