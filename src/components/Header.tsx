import { m } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { useSiteConfig } from '../lib/siteConfig';
import { LANGS } from '../types';
import { WhatsAppLink } from './WhatsAppLink';

export function Header() {
  const cfg = useSiteConfig();
  const { lang, setLang, t } = useI18n();
  return (
    <m.header className="top" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="wrap top-in">
        <a className="brand" href="#" aria-label="Home">
          {cfg.logo_url ? <img src={cfg.logo_url} alt={cfg.brand_name} /> : <span>{cfg.brand_name}</span>}
        </a>
        <div className="top-r">
          <div className="lang" role="group" aria-label="Language">
            {LANGS.map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
          <WhatsAppLink className="btn btn-wa btn-sm">{t('nav.wa')}</WhatsAppLink>
        </div>
      </div>
    </m.header>
  );
}
