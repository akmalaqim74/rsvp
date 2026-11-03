import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import en from '../i18n/en.json';
import ms from '../i18n/ms.json';
import { LANGS, type Lang } from '../types';

const STRINGS: Record<Lang, Record<string, string>> = { en, ms };
const LANG_KEY = 'rsvp_lang';

interface I18n { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string }
const Ctx = createContext<I18n | null>(null);

function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (LANGS.includes(saved as Lang)) return saved as Lang;
  } catch { /* storage can be blocked */ }
  return /^ms/i.test(navigator.language) ? 'ms' : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);
  const t = useCallback((key: string) => STRINGS[lang][key] ?? STRINGS.en[key] ?? key, [lang]);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(LANG_KEY, l); } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t('meta.title');
  }, [lang, t]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const v = useContext(Ctx);
  if (!v) throw new Error('useI18n outside provider');
  return v;
}
