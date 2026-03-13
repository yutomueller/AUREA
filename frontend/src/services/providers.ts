import { api } from './api';

export const getProviders = () => api<any>('/providers');
export const saveProvider = (payload: any) => api<any>('/providers/config', { method: 'PUT', body: JSON.stringify(payload) });
export const testProvider = (payload: any) => api<any>('/providers/test', { method: 'POST', body: JSON.stringify(payload) });
