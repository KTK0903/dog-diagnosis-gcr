// src/i18n.js (네임스페이스 설정 없이 기본 'translation'만 사용하는 버전)
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './translations/en.json';
import koTranslation from './translations/ko.json';
import jaTranslation from './translations/jp.json';
import esTranslation from './translations/es.json';

const resources = {
  en: { translation: enTranslation },
  ko: { translation: koTranslation },
  ja: { translation: jaTranslation },
  es: { translation: esTranslation }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ['en', 'ko', 'ja', 'es'],
    fallbackLng: 'en',
    // ns 와 defaultNS 옵션 제거 또는 주석 처리
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'appLanguage',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;