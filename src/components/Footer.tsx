import { useI18n } from '../lib/i18n';
import { useSiteConfig } from '../lib/siteConfig';
import { WhatsAppLink } from './WhatsAppLink';

export function Footer() {
  const { t } = useI18n();
  const cfg = useSiteConfig();
  return (
    <footer className="foot">
      <div className="wrap">
        <p><strong>{cfg.brand_name}</strong></p>
        <p>
          <WhatsAppLink>{t('cta.wa')}</WhatsAppLink>
          {cfg.contact_email && <a href={`mailto:${cfg.contact_email}`}>{cfg.contact_email}</a>}
        </p>
        <p className="small">{t('form.privacy')}</p>
      </div>
    </footer>
  );
}
