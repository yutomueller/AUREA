import { api } from './api';

export const getAgentConfigs = (mode: 'THREE' | 'FIVE') => api<any>(`/agents/config?mode=${mode}`);
export const saveAgentConfigs = (payload: any) => api<any>('/agents/config', { method: 'PUT', body: JSON.stringify(payload) });
