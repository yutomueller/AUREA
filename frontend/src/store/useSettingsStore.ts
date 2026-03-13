import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SettingsState = {
  uiLanguage: 'ja' | 'en';
  responseLanguage: 'ja' | 'en';
  themeName: string;
  animationLevel: string;
  agentMode: 'THREE' | 'FIVE';
  decisionMode: 'SIMPLE' | 'DEBATE';
  consensusRule: 'MAJORITY' | 'UNANIMOUS';
  setUiLanguage: (value: 'ja' | 'en') => void;
  setResponseLanguage: (value: 'ja' | 'en') => void;
  setAgentMode: (value: 'THREE' | 'FIVE') => void;
  setDecisionMode: (value: 'SIMPLE' | 'DEBATE') => void;
  setConsensusRule: (value: 'MAJORITY' | 'UNANIMOUS') => void;
  hydrate: (payload: any) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      uiLanguage: 'ja',
      responseLanguage: 'ja',
      themeName: 'aurea',
      animationLevel: 'MEDIUM',
      agentMode: 'THREE',
      decisionMode: 'DEBATE',
      consensusRule: 'MAJORITY',
      setUiLanguage: (uiLanguage) => set({ uiLanguage }),
      setResponseLanguage: (responseLanguage) => set({ responseLanguage }),
      setAgentMode: (agentMode) => set({ agentMode }),
      setDecisionMode: (decisionMode) => set({ decisionMode }),
      setConsensusRule: (consensusRule) => set({ consensusRule }),
      hydrate: (payload) => set({
        uiLanguage: payload.ui_language ?? 'ja',
        responseLanguage: payload.response_language ?? 'ja',
        themeName: payload.theme_name ?? 'aurea',
        animationLevel: payload.animation_level ?? 'MEDIUM',
      }),
    }),
    {
      name: 'aurea-settings',
      partialize: (state) => ({
        agentMode: state.agentMode,
        decisionMode: state.decisionMode,
        consensusRule: state.consensusRule,
      }),
    },
  ),
);
