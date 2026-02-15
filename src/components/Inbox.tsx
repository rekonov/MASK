"use client";

import { useState, useEffect, useCallback } from "react";
import {
  type TempMailAccount,
  type MailMessage,
  fetchMessages,
  fetchMessage,
} from "@/lib/tempmail";

interface InboxProps {
  account: TempMailAccount;
}

export default function Inbox({ account }: InboxProps) {
  const [messages, setMessages] = useState<MailMessage[]>([]);
  const [selected, setSelected] = useState<MailMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const msgs = await fetchMessages(account.token);
      setMessages(msgs);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, [account.token]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    refresh();
    if (!autoRefresh) return;
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh, autoRefresh]);

  const openMessage = useCallback(
    async (msg: MailMessage) => {
      try {
        const full = await fetchMessage(account.token, msg.id);
        setSelected(full);
      } catch {
        setSelected(msg);
      }
    },
    [account.token]
  );

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // ── Selected message view ───────────────────────────────────────

  if (selected) {
    return (
      <div className="mt-4">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-[var(--text-muted)] text-xs uppercase tracking-widest mb-4 hover:text-[var(--text-primary)] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        <div className="space-y-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">From</p>
            <p className="text-[14px] text-[var(--text-primary)] font-medium">
              {selected.from.name || selected.from.address}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Subject</p>
            <p className="text-[15px] text-[var(--text-primary)] font-semibold">
              {selected.subject || "(No subject)"}
            </p>
          </div>

          <div className="border-t border-[var(--border)] pt-3">
            {selected.html && selected.html.length > 0 ? (
              <div
                className="text-[14px] text-[var(--text-secondary)] leading-relaxed prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: selected.html.join(""),
                }}
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              />
            ) : selected.text ? (
              <pre className="text-[14px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap font-sans">
                {selected.text}
              </pre>
            ) : (
              <p className="text-[14px] text-[var(--text-muted)] italic">
                {selected.intro || "No content"}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Message list view ─────────────────────────────────────────────

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Inbox
        </p>
        <div className="flex items-center gap-2">
          {/* Auto-refresh toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`text-[10px] uppercase tracking-[0.1em] px-2 py-1 rounded-md border transition-colors ${
              autoRefresh
                ? "border-[var(--accent)] text-[var(--text-primary)] bg-[var(--surface-alt)]"
                : "border-[var(--border)] text-[var(--text-muted)]"
            }`}
            title={autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
          >
            Auto
          </button>

          {/* Manual refresh */}
          <button
            onClick={refresh}
            disabled={loading}
            className="mask-copy"
            title="Refresh"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={loading ? "animate-spin" : ""}
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-[12px] text-[var(--text-muted)] mb-2">
          {error}
        </p>
      )}

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[13px] text-[var(--text-muted)]">
            {loading ? "Checking..." : "No messages yet"}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1 opacity-60">
            Messages will appear here automatically
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => openMessage(msg)}
              className="w-full text-left px-3 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] hover:bg-[var(--surface-alt)] transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                  {msg.from.name || msg.from.address}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] flex-shrink-0">
                  {formatDate(msg.createdAt)}
                </span>
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] font-medium mt-0.5 truncate">
                {msg.subject || "(No subject)"}
              </p>
              {msg.intro && (
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate">
                  {msg.intro}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
