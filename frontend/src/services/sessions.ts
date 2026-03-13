import { api } from './api';

export type SessionCreateRequest = {
  title?: string;
  user_query: string;
  agent_mode: 'THREE' | 'FIVE';
  decision_mode: 'SIMPLE' | 'DEBATE';
  consensus_rule: 'MAJORITY' | 'UNANIMOUS';
};

export const createSession = (payload: SessionCreateRequest) => api<{ id: string; status: string; created_at: string }>('/sessions', { method: 'POST', body: JSON.stringify(payload) });
export const runSession = (id: string) => api<any>(`/sessions/${id}/run`, { method: 'POST', body: JSON.stringify({ stream: false }) });
export const getSessions = () => api<any>('/sessions');
export const getSessionDetail = (id: string) => api<any>(`/sessions/${id}`);
