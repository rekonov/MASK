// ── Proxy for mail.tm API (avoids CORS issues) ──────────────────────
import { NextRequest, NextResponse } from "next/server";

const MAILTM = "https://api.mail.tm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { endpoint, method = "GET", payload, token } = body as {
      endpoint: string;
      method?: string;
      payload?: unknown;
      token?: string;
    };

    // Whitelist allowed endpoints
    const allowed = ["/domains", "/accounts", "/token", "/messages"];
    const isAllowed = allowed.some((a) => endpoint.startsWith(a));
    if (!isAllowed) {
      return NextResponse.json({ error: "Endpoint not allowed" }, { status: 403 });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const fetchOpts: RequestInit = {
      method,
      headers,
    };
    if (payload && (method === "POST" || method === "PATCH")) {
      fetchOpts.body = JSON.stringify(payload);
    }

    const res = await fetch(`${MAILTM}${endpoint}`, fetchOpts);
    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: errText },
        { status: res.status }
      );
    }

    if (contentType.includes("application/json") || contentType.includes("application/ld+json")) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    const text = await res.text();
    return new NextResponse(text, { status: res.status });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Proxy error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
