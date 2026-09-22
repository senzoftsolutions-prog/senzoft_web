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

  const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
  if (!apiKey) {
    console.error("Contact email delivery is not configured: RESEND_API_KEY is missing.");
    return response.status(503).json({ message: "Email delivery is temporarily unavailable. Please email contact@senzoft.com." });
  }

  const recipient = process.env.CONTACT_RECIPIENT_EMAIL || "contact@senzoft.com";
  const from = process.env.CONTACT_FROM_EMAIL || process.env.DEFAULT_FROM_EMAIL || "SENZOFT Website <careers@senzoft.com>";
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
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: submission.email,
        subject: `[Website enquiry] ${submission.enquiryType} — ${submission.name}`,
        text: `${details}\n\nMessage:\n${submission.message}`,
        html: `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#13233f"><h1>New website enquiry</h1><table>${htmlRows}</table><h2>Message</h2><p style="white-space:pre-wrap">${escapeHtml(submission.message)}</p></body></html>`,
      }),
    });

    if (!resendResponse.ok) {
      const providerError = await resendResponse.text();
      console.error("Resend rejected contact email:", resendResponse.status, providerError.slice(0, 1000));
      return response.status(502).json({ message: "Your message could not be sent. Please try again or email contact@senzoft.com." });
    }

    return response.status(200).json({ message: "Thank you. Your enquiry has been sent to SENZOFT." });
  } catch (error) {
    console.error("Contact email delivery failed:", error);
    return response.status(502).json({ message: "Your message could not be sent. Please try again or email contact@senzoft.com." });
  }
}
