/* Safe defaults. No phone number and no personal data here on purpose:
   the real values come from the Google Sheet Config tab. */
window.SITE = {
  scriptUrl: '', // paste the Apps Script web app URL here after deploying (public by design)
  configTimeoutMs: 3000,
  cacheMinutes: 10,
  config: {
    brand_name: 'RSVP invitations', logo_url: '', whatsapp_number: '',
    whatsapp_msg_en: '', whatsapp_msg_ms: '', contact_email: '', demo_url: '',
    show_wedding: true, show_birthday: true, show_funeral: false, show_other: true,
    booking_open: true
  }
};
