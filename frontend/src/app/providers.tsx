import { PropsWithChildren, useEffect } from 'react';
import { getUiSettings } from '../services/settings';
import { useSettingsStore } from '../store/useSettingsStore';

export function AppProviders({ children }: PropsWithChildren) {
  const uiLanguage = useSettingsStore((s) => s.uiLanguage);
  const hydrate = useSettingsStore((s) => s.hydrate);

  useEffect(() => {
    getUiSettings().then(hydrate).catch(() => undefined);
  }, [hydrate]);

  useEffect(() => {
    document.documentElement.lang = uiLanguage;
  }, [uiLanguage]);

  return children;
}
