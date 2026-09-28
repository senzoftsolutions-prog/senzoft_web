const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (value, maxLength) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const parseEmailIdentity = (value, fallbackName) => {
  const match = value.match(/^\s*(.*?)\s*<([^<>]+)>\s*$/);
  if (!match) return { address: value.trim(), name: fallbackName };
  return {
    address: match[2].trim(),
    name: match[1].trim().replace(/^['"]|['"]$/g, "") || fallbackName,
  };
};

const zeptoAuthorization = (apiKey) =>
  /^zoho-enczapikey\s+/i.test(apiKey.trim())
    ? apiKey.trim()
    : `Zoho-enczapikey ${apiKey.trim()}`;

function normalizeSubmission(body = {}) {
  return {
    name: text(body.name, 100),
    email: text(body.email, 254).toLowerCase(),
    company: text(body.company, 150),
    country: text(body.country, 2).toUpperCase(),
    phone: text(body.phone, 20),
    enquiryType: text(body.enquiryType, 50) || "Other",
    message: text(body.message, 5000),
    consent: body.consent === true,
    website: text(body.website, 200),
  };
}

function validateSubmission(submission) {
  if (submission.website) return "Unable to process this submission.";
  if (submission.name.length < 2) return "Please enter your name.";
  if (!EMAIL_PATTERN.test(submission.email)) return "Please enter a valid email address.";
  if (submission.company.length < 2) return "Please enter your company name.";
  if (!/^[A-Z]{2}$/.test(submission.country)) return "Please select your country.";
  if (submission.message.length < 10) return "Please provide a little more detail about your enquiry.";
  if (!submission.consent) return "Please confirm that we may respond to your enquiry.";
  return null;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Method not allowed." });
  }

  const submission = normalizeSubmission(request.body);
  const validationError = validateSubmission(submission);
  if (validationError) return response.status(400).json({ message: validationError });

  const apiKey = process.env.ZEPTOMAIL_API_KEY;
  if (!apiKey) {
    console.error("Contact email delivery is not configured: ZEPTOMAIL_API_KEY is missing.");
    return response.status(503).json({ message: "Email delivery is temporarily unavailable. Please email contact@senzoft.com." });
  }

  const recipient = process.env.CONTACT_RECIPIENT_EMAIL || "contact@senzoft.com";
  const from = parseEmailIdentity(
    process.env.CONTACT_FROM_EMAIL || process.env.DEFAULT_FROM_EMAIL || "SENZOFT Website <careers@senzoft.com>",
    "SENZOFT Website",
  );
  const apiUrl = process.env.ZEPTOMAIL_API_URL || "https://cpaas.zoho.in/v1.1/email";
  const rows = [
    ["Name", submission.name],
    ["Email", submission.email],
    ["Company", submission.company],
    ["Country", submission.country],
    ["Phone", submission.phone || "Not provided"],
    ["Enquiry type", submission.enquiryType],
  ];
  const details = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const htmlRows = rows.map(([label, value]) => `<tr><th align="left" style="padding:6px 16px 6px 0">${escapeHtml(label)}</th><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`).join("");

  try {
    const zeptoResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: zeptoAuthorization(apiKey),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [{ email_address: { address: recipient, name: "SENZOFT" } }],
        reply_to: [{ address: submission.email, name: submission.name }],
        subject: `[Website enquiry] ${submission.enquiryType} — ${submission.name}`,
        textbody: `${details}\n\nMessage:\n${submission.message}`,
        htmlbody: `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#13233f"><h1>New website enquiry</h1><table>${htmlRows}</table><h2>Message</h2><p style="white-space:pre-wrap">${escapeHtml(submission.message)}</p></body></html>`,
      }),
    });

    if (!zeptoResponse.ok) {
      const providerError = await zeptoResponse.text();
      console.error("ZeptoMail rejected contact email:", zeptoResponse.status, providerError.slice(0, 1000));
      return response.status(502).json({ message: "Your message could not be sent. Please try again or email contact@senzoft.com." });
    }

    return response.status(200).json({ message: "Thank you. Your enquiry has been sent to SENZOFT." });
  } catch (error) {
    console.error("Contact email delivery failed:", error);
    return response.status(502).json({ message: "Your message could not be sent. Please try again or email contact@senzoft.com." });
  }
}
