<div align="center">

# MASK

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

**Zero-knowledge identity generator.** Fake names, avatars, temp email — all in the browser. Nothing leaves your device.

</div>

---

## What it does

Generates a complete fake identity in one click:

- **Name & surname** — 64 first names x 57 last names
- **Username** — random handle
- **Phone** — formatted number with country code
- **Address** — street + city (15 cities)
- **Date of birth** — random realistic DOB
- **Email** — privacy-oriented domain
- **Avatar** — unique symmetric geometric pattern generated via Canvas (no network request)
- **Live temp email** — real inbox via [mail.tm](https://mail.tm) API, auto-refreshes every 5s

---

## Privacy

All identity data is generated **client-side** — no API calls, no database, no accounts, no tracking.

The only network request is temp email creation through [mail.tm](https://mail.tm), proxied via a Next.js API route (`/api/mail`) to avoid CORS. No data is stored server-side.

- No API keys required
- No registration or login
- No server-side persistence
- Avatars generated from Canvas — zero external image requests

---

## Screenshots

<!-- TODO: Add screenshots -->

---

## Run locally

```bash
npm i && npm run dev
```

Opens on `http://localhost:3000`.

---

## Tech stack

| Tech | Version |
|------|---------|
| Next.js | 16.1.6 (App Router, Turbopack) |
| React | 19.2.3 |
| Tailwind CSS | 4 |
| TypeScript | 5 |
| mail.tm API | free, no key, 8 QPS |

---

## Project structure

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

---

## License

MIT
