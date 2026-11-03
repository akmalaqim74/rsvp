import type { ReactNode } from 'react';
import { waHref } from '../lib/config';
import { useI18n } from '../lib/i18n';
import { useSiteConfig } from '../lib/siteConfig';

/* Renders nothing when no valid number came from the Sheet: the page never guesses a number. */
export function WhatsAppLink({ className, children }: { className?: string; children: ReactNode }) {
  const cfg = useSiteConfig();
  const { lang } = useI18n();
  const href = waHref(cfg, lang);
  if (!href) return null;
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}
