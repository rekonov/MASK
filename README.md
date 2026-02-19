# M A S K

## What it does

Generates a complete fake identity in one click:
- **Name & surname** — 64 first names × 57 last names
- **Username** — random handle
- **Phone** — formatted number with country code
- **Address** — street + city (15 cities)
- **Date of birth** — random realistic DOB
- **Email** — privacy-oriented domain
- **Avatar** — unique symmetric geometric pattern from Canvas (no network)
- **Live temp email** — real inbox via [mail.tm](https://mail.tm) API, auto-refreshes every 5s

## Stack

| Tech | Version |
|------|---------|
| Next.js | 16.1.6 (App Router, Turbopack) |
| React | 19.2.3 |
| Tailwind CSS | 4 |
| TypeScript | 5 |
| mail.tm API | free, no key, 8 QPS |

## Run locally

```bash
npm i && npm run dev
```

Opens on `http://localhost:3000`

## How it works

All identity data is generated client-side — no API calls, no databases, no accounts.

The only network request is temp email creation through [mail.tm](https://mail.tm), proxied via a Next.js API route (`/api/mail`) to avoid CORS.

### Files

| File | Purpose |
|------|---------|
| `src/lib/generator.ts` | Name, surname, username, phone, address, DOB, email generation |
| `src/lib/avatar.ts` | Deterministic geometric avatar from seed via Canvas |
| `src/lib/tempmail.ts` | mail.tm client — create inbox, get token, fetch messages |
| `src/app/api/mail/route.ts` | Server proxy to mail.tm (CORS), whitelisted endpoints |
| `src/components/IdentityCard.tsx` | Main UI — all fields, "Activate Live Email", inbox, generate, copy |
| `src/components/Inbox.tsx` | Incoming emails renderer, 5s auto-refresh, HTML/text body view |
| `src/components/CopyButton.tsx` | Copy to clipboard + checkmark animation |
| `src/components/ThemeToggle.tsx` | Light/dark toggle, persists in localStorage |

## Principles

- **Zero-knowledge** — all data generated in browser
- **No API keys** — mail.tm is free and keyless
- **No database** — nothing stored server-side
- **No accounts** — no registration, no login

## License

MIT
