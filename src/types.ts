export type EventType = 'wedding' | 'birthday' | 'funeral' | 'other';
export type Lang = 'ms' | 'en';

export const EVENT_TYPES: EventType[] = ['wedding', 'birthday', 'funeral', 'other'];
export const LANGS: Lang[] = ['ms', 'en'];

export interface SiteConfig {
  brand_name: string;
  logo_url: string;
  whatsapp_number: string;
  whatsapp_msg_en: string;
  whatsapp_msg_ms: string;
  contact_email: string;
  demo: Record<EventType, string>; // live demo link per event type, https only
  show: Record<EventType, boolean>;
  booking_open: boolean;
}

export interface BookingPayload {
  name: string;
  phone: string;
  eventType: EventType;
  eventDate: string;
  note: string;
  lang: Lang;
  website: string; // honeypot, real visitors leave it empty
}
