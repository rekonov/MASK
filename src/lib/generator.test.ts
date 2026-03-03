import { describe, it, expect } from "vitest";
import { generateIdentity, type Identity } from "./generator";

describe("generateIdentity", () => {
  it("returns all required fields", () => {
    const id = generateIdentity();
    const keys: (keyof Identity)[] = [
      "firstName", "lastName", "email", "phone",
      "dateOfBirth", "age", "street", "city", "country", "username",
    ];
    for (const key of keys) {
      expect(id[key]).toBeDefined();
    }
  });

  it("email contains @ and a domain", () => {
    const id = generateIdentity();
    expect(id.email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
  });

  it("dateOfBirth is YYYY-MM-DD format", () => {
    const id = generateIdentity();
    expect(id.dateOfBirth).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("age is between 18 and 55", () => {
    for (let i = 0; i < 50; i++) {
      const id = generateIdentity();
      expect(id.age).toBeGreaterThanOrEqual(18);
      expect(id.age).toBeLessThanOrEqual(55);
    }
  });

  it("phone starts with +", () => {
    const id = generateIdentity();
    expect(id.phone).toMatch(/^\+\d/);
  });

  it("generates unique identities", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const id = generateIdentity();
      ids.add(`${id.firstName}${id.lastName}${id.email}`);
    }
    expect(ids.size).toBeGreaterThan(1);
  });

  it("street contains a number", () => {
    const id = generateIdentity();
    expect(id.street).toMatch(/\d+/);
  });
});
