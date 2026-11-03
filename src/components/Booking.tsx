import { useState, type FormEvent } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { reveal } from '../motion';
import { submitBooking } from '../lib/booking';
import { useI18n } from '../lib/i18n';
import { useSiteConfig } from '../lib/siteConfig';
import { EVENT_TYPES, type BookingPayload, type EventType } from '../types';
import { WhatsAppLink } from './WhatsAppLink';

interface FormState { name: string; phone: string; eventType: EventType | ''; eventDate: string; note: string; website: string }
type Errors = Partial<Record<'name' | 'phone' | 'eventType' | 'eventDate', string>>;
type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'ok' } | { kind: 'fail' };

const EMPTY: FormState = { name: '', phone: '', eventType: '', eventDate: '', note: '', website: '' };

export function Booking() {
  const { t, lang } = useI18n();
  const cfg = useSiteConfig();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const open = cfg.booking_open;
  const sending = status.kind === 'sending';

  const set = (k: keyof FormState) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate(): Errors {
    const errs: Errors = {};
    const digits = form.phone.replace(/\D/g, '');
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (!form.name.trim()) errs.name = 'err.name';
    if (digits.length < 9 || digits.length > 15) errs.phone = 'err.phone';
    if (!form.eventType) errs.eventType = 'err.type';
    if (form.eventDate && new Date(`${form.eventDate}T00:00:00`) < today) errs.eventDate = 'err.date';
    return errs;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (sending || !open) return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0 || form.eventType === '') return;
    setStatus({ kind: 'sending' });
    const payload: BookingPayload = {
      name: form.name.trim(), phone: form.phone.trim(), eventType: form.eventType,
      eventDate: form.eventDate, note: form.note.trim(), lang, website: form.website
    };
    try {
      const ok = await submitBooking(payload);
      if (ok) { setForm(EMPTY); setStatus({ kind: 'ok' }); } else setStatus({ kind: 'fail' });
    } catch {
      setStatus({ kind: 'fail' });
    }
  }

  const field = (id: keyof Errors) => `field${errors[id] ? ' bad' : ''}`;
  const err = (id: keyof Errors) => <span className="err" role="alert">{errors[id] ? t(errors[id] as string) : ''}</span>;

  return (
    <section className="band wrap book" id="book">
      <m.div {...reveal()}>
        <h2>{t('form.title')}</h2>
        <p className="lead">{t('form.sub')}</p>
        <WhatsAppLink className="btn btn-wa">{t('cta.wa')}</WhatsAppLink>
      </m.div>
      <m.form onSubmit={onSubmit} noValidate {...reveal(0.1)}>
        {!open && <p className="notice">{t('form.closed')}</p>}
        <fieldset disabled={!open || sending} style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
          <div className={field('name')}>
            <label htmlFor="f-name">{t('form.name')}</label>
            <input id="f-name" autoComplete="name" maxLength={80} value={form.name} onChange={set('name')} />
            {err('name')}
          </div>
          <div className={field('phone')}>
            <label htmlFor="f-phone">{t('form.phone')}</label>
            <input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} value={form.phone} onChange={set('phone')} />
            {err('phone')}
          </div>
          <div className={field('eventType')}>
            <label htmlFor="f-type">{t('form.type')}</label>
            <select id="f-type" value={form.eventType} onChange={set('eventType')}>
              <option value="">{t('form.type.pick')}</option>
              {EVENT_TYPES.filter((ty) => cfg.show[ty]).map((ty) => <option key={ty} value={ty}>{t(`event.${ty}.t`)}</option>)}
            </select>
            {err('eventType')}
          </div>
          <div className={field('eventDate')}>
            <label htmlFor="f-date">{t('form.date')}</label>
            <input id="f-date" type="date" value={form.eventDate} onChange={set('eventDate')} />
            {err('eventDate')}
          </div>
          <div className="field">
            <label htmlFor="f-note">{t('form.note')}</label>
            <textarea id="f-note" rows={3} maxLength={300} value={form.note} onChange={set('note')} />
          </div>
          <div className="hp" aria-hidden="true">
            <label>Website <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} /></label>
          </div>
          <m.button className="btn btn-primary btn-block" type="submit" whileTap={{ scale: 0.98 }}>
            {sending ? t('form.sending') : t('form.submit')}
          </m.button>
        </fieldset>
        <div role="status" aria-live="polite">
          <AnimatePresence mode="wait">
            {(status.kind === 'ok' || status.kind === 'fail') && (
              <m.p key={status.kind} className={`status ${status.kind === 'ok' ? 'ok' : 'fail'}`}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {status.kind === 'ok' ? t('form.ok') : t('form.err')}
              </m.p>
            )}
          </AnimatePresence>
        </div>
        <p className="small">{t('form.privacy')}</p>
      </m.form>
    </section>
  );
}
