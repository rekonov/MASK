// ── Identity data generator ──────────────────────────────────────────
// Runs entirely client-side. No network requests, no tracking.

export interface Identity {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  age: number;
  street: string;
  city: string;
  country: string;
  username: string;
}

// ── Random helpers ──────────────────────────────────────────────────

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDigits(n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  return s;
}

// ── Name corpus ─────────────────────────────────────────────────────

const FIRST_NAMES = [
  "Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn",
  "Avery", "Blake", "Cameron", "Dakota", "Emerson", "Finley", "Harper",
  "Jamie", "Kai", "Logan", "Parker", "Reese", "Sage", "Skyler",
  "Rowan", "Ellis", "Drew", "Hayden", "Lennox", "Arden", "Marlowe",
  "Phoenix", "Remy", "Shiloh", "Wren", "Tatum", "Rain", "Onyx",
  "Ashton", "Blair", "Corin", "Darcy", "Eden", "Francis", "Glenn",
  "Haven", "Indigo", "Jules", "Kendall", "Lane", "Micah", "Noel",
  "Oakley", "Peyton", "River", "Sterling", "Sidney", "Tristan", "Val",
  "Winter", "Yael", "Zion", "Milan", "Soren", "Lyric", "Briar",
] as const;

const LAST_NAMES = [
  "Andersen", "Bakker", "Chen", "Dubois", "Eriksson", "Fisher",
  "Garcia", "Huber", "Ivanov", "Jensen", "Kim", "Laurent", "Muller",
  "Nakamura", "Olsen", "Petrov", "Reyes", "Singh", "Torres", "Varga",
  "Weber", "Xu", "Yamamoto", "Zimmermann", "Berg", "Costa", "Dale",
  "Engel", "Frost", "Grant", "Holm", "Johansson", "Klein", "Strand",
  "Lindgren", "Maier", "Nord", "Park", "Richter", "Sato", "Tanaka",
  "Ueda", "Vogt", "Wolf", "Yun", "Zhu", "Reed", "Stone", "Blake",
  "Gray", "Hart", "Knight", "Lane", "Nash", "Cross", "Hayes", "Mercer",
] as const;

// ── Location corpus ─────────────────────────────────────────────────

interface Location {
  city: string;
  country: string;
  phonePrefix: string;
  streets: readonly string[];
}

const LOCATIONS: readonly Location[] = [
  { city: "Stockholm", country: "Sweden", phonePrefix: "+46", streets: ["Drottninggatan", "Sveavägen", "Birger Jarlsgatan", "Kungsgatan", "Strandvägen"] },
  { city: "Oslo", country: "Norway", phonePrefix: "+47", streets: ["Karl Johans gate", "Bogstadveien", "Grünerløkka", "Majorstuen Allé", "Frognerveien"] },
  { city: "Helsinki", country: "Finland", phonePrefix: "+358", streets: ["Mannerheimintie", "Aleksanterinkatu", "Esplanadi", "Hämeentie", "Fredrikinkatu"] },
  { city: "Berlin", country: "Germany", phonePrefix: "+49", streets: ["Friedrichstraße", "Torstraße", "Kastanienallee", "Oranienstraße", "Schönhauser Allee"] },
  { city: "Amsterdam", country: "Netherlands", phonePrefix: "+31", streets: ["Keizersgracht", "Prinsengracht", "Damstraat", "Leidsestraat", "Haarlemmerstraat"] },
  { city: "Zurich", country: "Switzerland", phonePrefix: "+41", streets: ["Bahnhofstrasse", "Limmatquai", "Niederdorfstrasse", "Rämistrasse", "Langstrasse"] },
  { city: "Copenhagen", country: "Denmark", phonePrefix: "+45", streets: ["Strøget", "Nørrebrogade", "Vesterbrogade", "Østerbrogade", "Gothersgade"] },
  { city: "Vienna", country: "Austria", phonePrefix: "+43", streets: ["Kärntner Straße", "Mariahilfer Straße", "Graben", "Währinger Straße", "Praterstraße"] },
  { city: "Prague", country: "Czech Republic", phonePrefix: "+420", streets: ["Národní třída", "Vinohradská", "Na Příkopě", "Celetná", "Karlova"] },
  { city: "Lisbon", country: "Portugal", phonePrefix: "+351", streets: ["Rua Augusta", "Avenida da Liberdade", "Rua da Prata", "Rua do Carmo", "Rua Garrett"] },
  { city: "Tokyo", country: "Japan", phonePrefix: "+81", streets: ["Omotesando", "Takeshita-dori", "Nakamise-dori", "Meiji-dori", "Shinjuku-dori"] },
  { city: "Seoul", country: "South Korea", phonePrefix: "+82", streets: ["Gangnam-daero", "Teheran-ro", "Itaewon-ro", "Hongdae-gil", "Insadong-gil"] },
  { city: "Toronto", country: "Canada", phonePrefix: "+1", streets: ["Queen Street", "Dundas Street", "Bloor Street", "College Street", "King Street"] },
  { city: "Melbourne", country: "Australia", phonePrefix: "+61", streets: ["Swanston Street", "Collins Street", "Bourke Street", "Flinders Lane", "Chapel Street"] },
  { city: "Reykjavik", country: "Iceland", phonePrefix: "+354", streets: ["Laugavegur", "Skólavörðustígur", "Bankastræti", "Hverfisgata", "Austurstræti"] },
] as const;

// ── Email domains (disposable-looking) ──────────────────────────────

const EMAIL_DOMAINS = [
  "proton.me", "tuta.io", "disroot.org", "riseup.net", "cock.li",
  "dnmx.org", "autistici.org", "onionmail.org", "elude.in", "ctemplar.com",
] as const;

// ── Username generation ─────────────────────────────────────────────

const USERNAME_PARTS = [
  "void", "zero", "null", "nyx", "hex", "arc", "neo", "ash", "flux",
  "dusk", "echo", "iris", "onyx", "rune", "veil", "byte", "grid",
  "mist", "node", "rift", "sync", "core", "edge", "fuse", "glow",
  "haze", "jade", "kite", "lux", "mint", "nova", "opal", "peak",
] as const;

function generateUsername(): string {
  const a = pick(USERNAME_PARTS);
  const b = pick(USERNAME_PARTS);
  const sep = pick(["_", ".", ""]);
  const num = randInt(0, 1) ? randDigits(randInt(2, 4)) : "";
  return `${a}${sep}${b}${num}`;
}

// ── Date of birth ───────────────────────────────────────────────────

function generateDOB(): { dateOfBirth: string; age: number } {
  const currentYear = new Date().getFullYear();
  const year = randInt(currentYear - 55, currentYear - 18);
  const month = randInt(1, 12);
  const maxDay = new Date(year, month, 0).getDate();
  const day = randInt(1, maxDay);

  const dob = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return { dateOfBirth: dateStr, age };
}

// ── Public API ──────────────────────────────────────────────────────

export function generateIdentity(): Identity {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const username = generateUsername();
  const loc = pick(LOCATIONS);
  const { dateOfBirth, age } = generateDOB();

  const emailUser = `${firstName.toLowerCase()}${pick([".", "_", ""])}${randDigits(randInt(2, 5))}`;
  const email = `${emailUser}@${pick(EMAIL_DOMAINS)}`;

  const phone = `${loc.phonePrefix} ${randDigits(3)} ${randDigits(3)} ${randDigits(randInt(3, 4))}`;
  const street = `${pick(loc.streets)} ${randInt(1, 200)}`;

  return {
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    age,
    street,
    city: loc.city,
    country: loc.country,
    username,
  };
}
