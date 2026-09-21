import { describe, expect, it } from "vitest";
import {
  COUNTRY_OPTIONS,
  validateCompany,
  validateEmail,
  validateMessage,
  validateName,
  validatePhone,
} from "./contactValidation";

describe("contact form validation", () => {
  it("accepts valid names and rejects numbers", () => {
    expect(validateName("Jane Smith")).toBeNull();
    expect(validateName("O'Connor-Jones")).toBeNull();
    expect(validateName("Jane123")).toContain("letters");
    expect(validateName("J")).toBe("Name must be 2–100 characters long.");
  });

  it("accepts valid email addresses and rejects invalid ones", () => {
    expect(validateEmail("name+tag@company.com")).toBeNull();
    expect(validateEmail("name@company")).toBe("Please enter a valid work email address.");
    expect(validateEmail("invalid@@company.com")).toBe("Please enter a valid work email address.");
  });

  it("accepts standard company names and rejects punctuation-only text", () => {
    expect(validateCompany("AT&T")).toBeNull();
    expect(validateCompany("24/7.ai")).toBeNull();
    expect(validateCompany("7-Eleven")).toBeNull();
    expect(validateCompany("!!!")).toContain("letters or numbers");
  });

  it("uses country calling codes and validates India phone numbers correctly", () => {
    expect(COUNTRY_OPTIONS.some((country) => country.code === "IN" && country.callingCode === "+91")).toBe(true);
    expect(validatePhone("9876543210", "IN")).toBeNull();
    expect(validatePhone("12345", "IN")).toBe("India phone number must be exactly 10 digits.");
  });

  it("accepts short or long messages up to the maximum length", () => {
    expect(validateMessage("Hi")).toBeNull();
    expect(validateMessage("   ")).toBe("Message is required.");
    expect(validateMessage("a".repeat(5001))).toBe("Message must be 5000 characters or fewer.");
  });
});
