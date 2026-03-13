import { create } from 'zustand';

type SettingsState = {
  uiLanguage: 'ja' | 'en';
  responseLanguage: 'ja' | 'en';
  themeName: string;
  animationLevel: string;
  setUiLanguage: (value: 'ja' | 'en') => void;
  setResponseLanguage: (value: 'ja' | 'en') => void;
  hydrate: (payload: any) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  uiLanguage: 'ja',
  responseLanguage: 'ja',
  themeName: 'aurea',
  animationLevel: 'MEDIUM',
  setUiLanguage: (uiLanguage) => set({ uiLanguage }),
  setResponseLanguage: (responseLanguage) => set({ responseLanguage }),
  hydrate: (payload) => set({
    uiLanguage: payload.ui_language ?? 'ja',
    responseLanguage: payload.response_language ?? 'ja',
    themeName: payload.theme_name ?? 'aurea',
    animationLevel: payload.animation_level ?? 'MEDIUM',
  }),
}));
