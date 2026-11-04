# Sheet layout and Apps Script contract

## Tabs (row 1 header, exact names)
- `Config`: two columns `key`, `value` (keys in architecture.md).
- `Bookings` (written only by the script):

| Col | Header | Note |
|---|---|---|
| A | timestamp | server time, Asia/Kuala_Lumpur |
| B | name | 1 to 80 chars |
| C | phone | digits only, normalised |
| D | event_type | wedding / birthday / funeral / other |
| E | event_date | yyyy-MM-dd or blank |
| F | note | up to 300 chars |
| G | lang | en / ms |
| H | status | `new` (CEO changes to contacted / booked / closed) |

Menu `Landing tools > Set up tabs`, `Check setup`.

## HTTP contract
JSON, HTTP 200, `{ status: boolean, message: string, data?: object }`. `data` only on success.

### GET `?action=config`
Returns only the public keys: brand_name, logo_url, whatsapp_number, whatsapp_msg_en, whatsapp_msg_ms, contact_email, demo_wedding_url, demo_birthday_url, demo_funeral_url, demo_other_url, show_* flags, booking_open. **Never returns `notify_email`.** Unknown keys are not returned (whitelist).

### POST `{ action:"booking", name, phone, eventType, eventDate, note, lang, website }`
Steps in order:
1. Parse JSON, else "Bad request".
2. `booking_open` TRUE, else "Bookings are closed. Please WhatsApp us."
3. Honeypot non-empty: return success, write nothing.
4. Validate: name 1 to 80; phone digits (strip spaces, +, -), 9 to 15 long; eventType in enabled list; eventDate empty or valid date not in the past; note up to 300; lang en or ms.
5. Limits: max 3 per phone per day and 100 total per day (count rows with today's date), else "Please WhatsApp us instead."
6. Sanitise text (prefix `'` if starts with `= + - @`), take lock with `tryLock(10000)`, else "Busy, please try again". Append row, release.
7. If `notify_email` set, send a short email (name, phone, type, date). Failure to email must not fail the booking.
8. Return `{ status:true, message:"Booking received" }`.

## Client rules
- Config GET adds `_t=<Date.now()>`, `cache:"no-store"`, 3 s timeout (AbortController).
- Submit disabled while in flight; one retry after 1.5 s on "Busy".
- On any failure show `form.err` and the WhatsApp button (if config loaded).
