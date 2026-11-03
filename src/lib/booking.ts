import type { BookingPayload } from '../types';
import { SITE, mockMode } from './config';

const BUSY = 'Busy, please try again';

/* Resolves true when the booking was saved. Throws on network or script failure. */
export async function submitBooking(payload: BookingPayload, retried = false): Promise<boolean> {
  if (mockMode) {
    await new Promise((r) => setTimeout(r, 500));
    return mockMode !== 'fail';
  }
  if (!SITE.scriptUrl) throw new Error('no script url');
  const res: unknown = await fetch(SITE.scriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'booking', ...payload })
  }).then((r) => r.json());
  const body = typeof res === 'object' && res !== null ? (res as { status?: unknown; message?: unknown }) : {};
  if (body.message === BUSY && !retried) {
    await new Promise((r) => setTimeout(r, 1500));
    return submitBooking(payload, true);
  }
  return body.status === true;
}
