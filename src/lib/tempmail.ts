// ── mail.tm API client ───────────────────────────────────────────────
// Disposable email via https://mail.tm — proxied through /api/mail to avoid CORS

// ── Proxy helper ────────────────────────────────────────────────────

async function mailProxy(
  endpoint: string,
  method: string = "GET",
  payload?: unknown,
  token?: string
) {
  const res = await fetch("/api/mail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint, method, payload, token }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Mail API error ${res.status}: ${err}`);
  }

  return res.json();
}

// ── Types ───────────────────────────────────────────────────────────

export interface TempMailAccount {
  id: string;
  address: string;
  password: string;
  token: string;
}

export interface MailMessage {
  id: string;
  from: { address: string; name: string };
  to: { address: string; name: string }[];
  subject: string;
  intro: string;        // preview text
  text?: string;         // plain text body
  html?: string[];       // HTML body parts
  createdAt: string;
  seen: boolean;
  hasAttachments: boolean;
}

// ── Fetch available domains ─────────────────────────────────────────

export async function getAvailableDomains(): Promise<string[]> {
  const data = await mailProxy("/domains");
  const members: { domain: string; isActive: boolean }[] =
    data["hydra:member"] ?? data.member ?? data;
  return members.filter((d) => d.isActive).map((d) => d.domain);
}

// ── Create account ──────────────────────────────────────────────────

export async function createAccount(
  address: string,
  password: string
): Promise<TempMailAccount> {
  // 1. Create account
  const account = await mailProxy("/accounts", "POST", { address, password });

  // 2. Get JWT token
  const tokenData = await mailProxy("/token", "POST", { address, password });

  return {
    id: account.id,
    address,
    password,
    token: tokenData.token,
  };
}

// ── Fetch messages ──────────────────────────────────────────────────

export async function fetchMessages(token: string): Promise<MailMessage[]> {
  const data = await mailProxy("/messages", "GET", undefined, token);
  return data["hydra:member"] ?? data.member ?? data ?? [];
}

// ── Fetch single message (full body) ────────────────────────────────

export async function fetchMessage(
  token: string,
  messageId: string
): Promise<MailMessage> {
  return mailProxy(`/messages/${messageId}`, "GET", undefined, token);
}

// ── Delete account ──────────────────────────────────────────────────

export async function deleteAccount(
  token: string,
  accountId: string
): Promise<void> {
  await mailProxy(`/accounts/${accountId}`, "DELETE", undefined, token);
}

// ── Convenience: create with random username ────────────────────────

export async function createRandomAccount(): Promise<TempMailAccount> {
  const domains = await getAvailableDomains();
  if (domains.length === 0) throw new Error("No domains available");

  const domain = domains[Math.floor(Math.random() * domains.length)];
  const user = `mask${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const address = `${user}@${domain}`;
  const password = crypto.getRandomValues(new Uint8Array(16))
    .reduce((s, b) => s + b.toString(16).padStart(2, "0"), "");

  return createAccount(address, password);
}
