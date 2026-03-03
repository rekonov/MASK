import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateAvatar } from "./avatar";

// Minimal canvas mock
function createCanvasMock() {
  const fillRect = vi.fn();
  const beginPath = vi.fn();
  const arc = vi.fn();
  const fill = vi.fn();
  const moveTo = vi.fn();
  const lineTo = vi.fn();
  const closePath = vi.fn();

  const ctx = {
    fillStyle: "",
    globalAlpha: 1,
    fillRect,
    beginPath,
    arc,
    fill,
    moveTo,
    lineTo,
    closePath,
  };

  return { ctx, dataUrl: "data:image/png;base64,mock" };
}

beforeEach(() => {
  const { ctx, dataUrl } = createCanvasMock();
  vi.stubGlobal("document", {
    createElement: (tag: string) => {
      if (tag === "canvas") {
        return {
          width: 0,
          height: 0,
          getContext: () => ctx,
          toDataURL: () => dataUrl,
        };
      }
      return {};
    },
  });
});

describe("generateAvatar", () => {
  it("returns a data URL string", () => {
    const result = generateAvatar("test-seed");
    expect(result).toContain("data:image/png");
  });

  it("is deterministic — same seed produces same result", () => {
    const a = generateAvatar("seed123");
    const b = generateAvatar("seed123");
    expect(a).toBe(b);
  });

  it("returns empty string when canvas context unavailable", () => {
    vi.stubGlobal("document", {
      createElement: () => ({
        width: 0,
        height: 0,
        getContext: () => null,
        toDataURL: () => "",
      }),
    });
    const result = generateAvatar("no-canvas");
    expect(result).toBe("");
  });

  it("accepts custom size parameter", () => {
    const result = generateAvatar("test", 100);
    expect(result).toContain("data:image/png");
  });
});
