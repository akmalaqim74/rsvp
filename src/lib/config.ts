import { EVENT_TYPES, type Lang, type SiteConfig } from '../types';

/* scriptUrl is the deployed Apps Script web app URL. Public by design; the Sheet itself stays private. */
export const SITE: { scriptUrl: string; configTimeoutMs: number; cacheMinutes: number } = {
  scriptUrl: '',
  configTimeoutMs: 3000,
  cacheMinutes: 10
};

/* Safe defaults: no phone number and no personal data. Real values come from the Sheet Config tab. */
export const DEFAULT_CONFIG: SiteConfig = {
  brand_name: 'RSVP invitations',
  logo_url: '',
  whatsapp_number: '',
  whatsapp_msg_en: '',
  whatsapp_msg_ms: '',
  contact_email: '',
  show: { wedding: true, birthday: true, funeral: false, other: true },
  booking_open: true
};

/* Local-only preview without a deployed script: /?mock=1 (also funeral, closed, fail). Ignored on any real host. */
const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
export const mockMode: string | null = isLocal ? new URLSearchParams(location.search).get('mock') : null;

const CACHE_KEY = 'rsvp_cfg_v1';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}
const str = (v: unknown, fallback: string): string => (typeof v === 'string' ? v.trim() : fallback);
const bool = (v: unknown, fallback: boolean): boolean => (typeof v === 'boolean' ? v : fallback);
const httpsOnly = (u: string): string => (/^https:\/\//i.test(u) ? u : '');

/* Everything from the Sheet is untrusted text: narrow it, never assume. */
export function normalizeConfig(raw: unknown): SiteConfig {
  const d = DEFAULT_CONFIG;
  if (!isRecord(raw)) return d;
  const wa = String(raw.whatsapp_number ?? '').replace(/\D/g, '');
  const mail = str(raw.contact_email, '');
  return {
    brand_name: str(raw.brand_name, '') || d.brand_name,
    logo_url: httpsOnly(str(raw.logo_url, '')),
    whatsapp_number: wa.length >= 9 && wa.length <= 15 ? wa : '',
    whatsapp_msg_en: str(raw.whatsapp_msg_en, ''),
    whatsapp_msg_ms: str(raw.whatsapp_msg_ms, ''),
    contact_email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) ? mail : '',
    show: Object.fromEntries(EVENT_TYPES.map((t) => [t, bool(raw[`show_${t}`], d.show[t])])) as SiteConfig['show'],
    booking_open: bool(raw.booking_open, true)
  };
}

export function waHref(cfg: SiteConfig, lang: Lang): string {
  if (!cfg.whatsapp_number) return '';
  const msg = lang === 'ms' ? cfg.whatsapp_msg_ms : cfg.whatsapp_msg_en;
  return `https://wa.me/${cfg.whatsapp_number}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
}

export async function loadConfig(): Promise<unknown> {
  if (mockMode) {
    return {
      brand_name: 'Sample Brand', whatsapp_number: '60123456789', whatsapp_msg_en: 'Hi, I want to book.',
      whatsapp_msg_ms: 'Hai, saya nak tempah.', contact_email: 'hello@example.com',
      show_wedding: true, show_birthday: true, show_funeral: mockMode === 'funeral', show_other: true,
      booking_open: mockMode !== 'closed'
    };
  }
  if (!SITE.scriptUrl) throw new Error('no script url');

  try {
    const cached: unknown = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null');
    if (isRecord(cached) && typeof cached.at === 'number' && Date.now() - cached.at < SITE.cacheMinutes * 60000) return cached.data;
  } catch { /* storage can be blocked */ }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), SITE.configTimeoutMs);
  try {
    const sep = SITE.scriptUrl.includes('?') ? '&' : '?';
    const res: unknown = await fetch(`${SITE.scriptUrl}${sep}action=config&_t=${Date.now()}`, { cache: 'no-store', signal: ctrl.signal }).then((r) => r.json());
    if (!isRecord(res) || res.status !== true || !isRecord(res.data)) throw new Error('bad config');
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: res.data })); } catch { /* ignore */ }
    return res.data;
  } finally {
    clearTimeout(timer);
  }
}
