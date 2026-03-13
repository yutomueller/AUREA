import { api } from './api';

export const getUiSettings = () => api<any>('/settings/ui');
export const saveUiSettings = (payload: any) => api<any>('/settings/ui', { method: 'PUT', body: JSON.stringify(payload) });
