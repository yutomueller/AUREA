import { create } from 'zustand';

type SessionState = {
  currentSession: any | null;
  sessions: any[];
  loading: boolean;
  setCurrentSession: (session: any) => void;
  setSessions: (sessions: any[]) => void;
  setLoading: (loading: boolean) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  currentSession: null,
  sessions: [],
  loading: false,
  setCurrentSession: (currentSession) => set({ currentSession }),
  setSessions: (sessions) => set({ sessions }),
  setLoading: (loading) => set({ loading }),
}));
