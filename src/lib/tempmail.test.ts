import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAvailableDomains,
  createAccount,
  fetchMessages,
  fetchMessage,
  deleteAccount,
} from "./tempmail";

// Mock global fetch (all tempmail functions go through /api/mail proxy)
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("getAvailableDomains", () => {
  it("returns active domains from hydra:member", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        "hydra:member": [
          { domain: "example.com", isActive: true },
          { domain: "dead.com", isActive: false },
        ],
      }),
    );

    const domains = await getAvailableDomains();
    expect(domains).toEqual(["example.com"]);
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it("handles empty member list", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ "hydra:member": [] }));
    const domains = await getAvailableDomains();
    expect(domains).toEqual([]);
  });
});

describe("createAccount", () => {
  it("creates account and retrieves token", async () => {
    // First call: create account
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ id: "acc-1" }),
    );
    // Second call: get token
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ token: "jwt-abc" }),
    );

    const account = await createAccount("user@example.com", "pass123");
    expect(account).toEqual({
      id: "acc-1",
      address: "user@example.com",
      password: "pass123",
      token: "jwt-abc",
    });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe("fetchMessages", () => {
  it("returns messages from hydra:member", async () => {
    const msgs = [{ id: "msg-1", subject: "Hello" }];
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ "hydra:member": msgs }),
    );

    const result = await fetchMessages("token-123");
    expect(result).toEqual(msgs);
  });
});

describe("fetchMessage", () => {
  it("returns full message body", async () => {
    const msg = { id: "msg-1", html: ["<p>Hi</p>"] };
    mockFetch.mockResolvedValueOnce(jsonResponse(msg));

    const result = await fetchMessage("token-123", "msg-1");
    expect(result).toEqual(msg);
  });
});

describe("deleteAccount", () => {
  it("sends DELETE request", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({}));
    await deleteAccount("token-123", "acc-1");

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.endpoint).toBe("/accounts/acc-1");
    expect(body.method).toBe("DELETE");
  });
});

describe("error handling", () => {
  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response("Not found", { status: 404 }),
    );

    await expect(getAvailableDomains()).rejects.toThrow("Mail API error 404");
  });
});
