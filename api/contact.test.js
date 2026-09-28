import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import handler from "./contact.js";

const validBody = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  country: "GB",
  phone: "1234567890",
  enquiryType: "Partnership",
  message: "Please contact me about a new project.",
  consent: true,
  website: "",
};

function responseMock() {
  return {
    setHeader: vi.fn(),
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
}

describe("contact email delivery", () => {
  beforeEach(() => {
    process.env.ZEPTOMAIL_API_KEY = "test-api-key";
    process.env.ZEPTOMAIL_API_URL = "https://cpaas.zoho.in/v1.1/email";
    process.env.CONTACT_RECIPIENT_EMAIL = "contact@senzoft.com";
    process.env.CONTACT_FROM_EMAIL = "SENZOFT Website <careers@senzoft.com>";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("sends the ZeptoMail API payload with reply-to details", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const response = responseMock();

    await handler({ method: "POST", body: validBody }, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://cpaas.zoho.in/v1.1/email");
    expect(options.headers.Authorization).toBe("Zoho-enczapikey test-api-key");
    expect(JSON.parse(options.body)).toMatchObject({
      from: { address: "careers@senzoft.com", name: "SENZOFT Website" },
      to: [{ email_address: { address: "contact@senzoft.com" } }],
      reply_to: [{ address: "ada@example.com", name: "Ada Lovelace" }],
    });
  });

  it("does not attempt delivery without a server-side API key", async () => {
    delete process.env.ZEPTOMAIL_API_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
    const response = responseMock();

    await handler({ method: "POST", body: validBody }, response);

    expect(response.status).toHaveBeenCalledWith(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
