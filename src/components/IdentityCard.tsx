"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { type Identity, generateIdentity } from "@/lib/generator";
import { generateAvatar } from "@/lib/avatar";
import { type TempMailAccount, createRandomAccount } from "@/lib/tempmail";
import CopyButton from "@/components/CopyButton";
import Inbox from "@/components/Inbox";

// ── Field definition ────────────────────────────────────────────────

interface Field {
  label: string;
  key: keyof Identity;
  format?: (id: Identity) => string;
}

const FIELDS: Field[] = [
  { label: "Name", key: "firstName", format: (id) => `${id.firstName} ${id.lastName}` },
  { label: "Username", key: "username" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phone" },
  { label: "Born", key: "dateOfBirth", format: (id) => `${id.dateOfBirth}  (${id.age} y.o.)` },
  { label: "Address", key: "street", format: (id) => `${id.street}, ${id.city}` },
  { label: "Country", key: "country" },
];

// ── Toast hook ──────────────────────────────────────────────────────

function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  const show = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 1800);
  }, []);

  return { message, show };
}

// ── Email status ────────────────────────────────────────────────────

type EmailStatus = "idle" | "creating" | "active" | "error";

// ── Component ───────────────────────────────────────────────────────

export default function IdentityCard() {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [mailAccount, setMailAccount] = useState<TempMailAccount | null>(null);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showInbox, setShowInbox] = useState(false);
  const toast = useToast();

  // Generate identity on mount
  useEffect(() => {
    const id = generateIdentity();
    setIdentity(id);
    setAvatarSrc(generateAvatar(`${id.firstName}${id.lastName}${id.email}`, 200));
  }, []);

  // Create a real temp email account
  const activateEmail = useCallback(async () => {
    if (emailStatus === "creating") return;
    setEmailStatus("creating");
    setEmailError(null);

    try {
      const account = await createRandomAccount();
      setMailAccount(account);
      setEmailStatus("active");

      // Update identity with the real email address
      setIdentity((prev) =>
        prev ? { ...prev, email: account.address } : prev
      );

      toast.show("Live email created!");
      setShowInbox(true);
    } catch (e: unknown) {
      setEmailStatus("error");
      setEmailError(e instanceof Error ? e.message : "Failed to create email");
      toast.show("Email creation failed");
    }
  }, [emailStatus, toast]);

  const regenerate = useCallback(() => {
    const id = generateIdentity();
    setIdentity(id);
    setAvatarSrc(generateAvatar(`${id.firstName}${id.lastName}${id.email}`, 200));
    // Reset email state
    setMailAccount(null);
    setEmailStatus("idle");
    setEmailError(null);
    setShowInbox(false);
  }, []);

  const copyAll = useCallback(() => {
    if (!identity) return;
    const text = FIELDS.map((f) => {
      const val = f.format ? f.format(identity) : identity[f.key];
      return `${f.label}: ${val}`;
    }).join("\n");
    navigator.clipboard.writeText(text).then(() => toast.show("All fields copied"));
  }, [identity, toast]);

  const getFieldValue = useCallback(
    (field: Field): string => {
      if (!identity) return "";
      return field.format ? field.format(identity) : String(identity[field.key]);
    },
    [identity]
  );

  if (!identity) {
    return (
      <div className="mask-shell">
        <div className="w-8 h-8 border-2 mask-spinner rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="mask-card p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {avatarSrc && (
              <div className="mask-avatar">
                <img
                  src={avatarSrc}
                  alt="Generated avatar"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {identity.firstName} {identity.lastName}
              </h2>
              <p className="text-[12px] text-[var(--text-muted)] tracking-wide">
                @{identity.username}
              </p>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="px-1">
          {FIELDS.map((field) => (
            <div key={field.key} className="mask-field">
              <span className="mask-field-label">{field.label}</span>
              <span className="mask-field-value">
                {getFieldValue(field)}
                {/* Email status indicator */}
                {field.key === "email" && emailStatus === "active" && (
                  <span className="inline-block ml-2 w-2 h-2 rounded-full bg-green-500 align-middle" title="Live email" />
                )}
              </span>
              <CopyButton
                text={getFieldValue(field)}
                onCopied={() => toast.show(`${field.label} copied`)}
              />
            </div>
          ))}
        </div>

        {/* Email activation */}
        {emailStatus !== "active" && (
          <div className="mt-4 px-1">
            <button
              onClick={activateEmail}
              disabled={emailStatus === "creating"}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[var(--border)] text-[var(--text-secondary)] text-[13px] uppercase tracking-[0.08em] font-medium hover:bg-[var(--surface-alt)] hover:text-[var(--text-primary)] transition-all disabled:opacity-50"
            >
              {emailStatus === "creating" ? (
                <>
                  <div className="w-4 h-4 border-2 mask-spinner rounded-full animate-spin" />
                  Creating live email...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Activate Live Email
                </>
              )}
            </button>
            {emailError && (
              <p className="text-[11px] text-[var(--text-muted)] mt-2 text-center">
                {emailError}
              </p>
            )}
          </div>
        )}

        {/* Inbox toggle */}
        {emailStatus === "active" && mailAccount && (
          <div className="mt-4 px-1">
            <button
              onClick={() => setShowInbox(!showInbox)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text-primary)] text-[13px] uppercase tracking-[0.08em] font-medium hover:bg-[var(--surface-alt)] transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {showInbox ? "Hide Inbox" : "Open Inbox"}
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            </button>
          </div>
        )}

        {/* Inbox */}
        {showInbox && mailAccount && (
          <div className="px-1">
            <Inbox account={mailAccount} />
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <button onClick={regenerate} className="mask-button">
            Generate New Identity
          </button>
          <button onClick={copyAll} className="mask-button-secondary">
            Copy All
          </button>
        </div>
      </div>

      {/* Toast */}
      <div className={`mask-toast ${toast.message ? "visible" : ""}`}>
        {toast.message}
      </div>
    </>
  );
}
