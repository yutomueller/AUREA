import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function SystemPage() {
  const [status, setStatus] = useState<any | null>(null);
  useEffect(() => {
    api('/system/status').then(setStatus);
  }, []);
  return <pre className="panel">{JSON.stringify(status, null, 2)}</pre>;
}
