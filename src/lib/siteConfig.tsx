import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { SiteConfig } from '../types';
import { DEFAULT_CONFIG, loadConfig, normalizeConfig } from './config';

const Ctx = createContext<SiteConfig>(DEFAULT_CONFIG);

/* Renders at once with defaults, then swaps in the Sheet values. If the Sheet is slow or down the defaults stay. */
export function ConfigProvider({ children }: { children: ReactNode }) {
  const [cfg, setCfg] = useState<SiteConfig>(DEFAULT_CONFIG);
  useEffect(() => {
    let live = true;
    loadConfig().then((raw) => { if (live) setCfg(normalizeConfig(raw)); }).catch(() => { /* keep defaults */ });
    return () => { live = false; };
  }, []);
  return <Ctx.Provider value={cfg}>{children}</Ctx.Provider>;
}

export const useSiteConfig = (): SiteConfig => useContext(Ctx);
