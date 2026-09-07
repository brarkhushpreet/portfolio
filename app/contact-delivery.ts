export const CONTACT_EMAIL = "khushbrar@gmail.com";
export const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

export type ContactMessage = { name: string; email: string; message: string; website: string };

export function validateContactMessage(data: ContactMessage): string | null {
  if (!data.name.trim() || data.name.trim().length > 80) return "Please enter your name (up to 80 characters).";
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) return "Please enter a valid email address.";
  if (data.message.trim().length < 10 || data.message.trim().length > 4000) return "Please write a message between 10 and 4,000 characters.";
  return null;
}

export async function sendContactMessage(data: ContactMessage, pageUrl: string, signal: AbortSignal): Promise<void> {
  const validationError = validateContactMessage(data);
  if (validationError) throw new Error(validationError);
  if (data.website) throw new Error("Unable to submit this message. Please email me directly.");

  const response = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Referer: pageUrl, Origin: new URL(pageUrl).origin },
    signal,
    body: JSON.stringify({
      name: data.name.trim(),
      email: data.email.trim(),
      message: data.message.trim(),
      _subject: "New portfolio enquiry",
      _template: "table",
      _url: pageUrl,
      _honey: data.website,
    }),
  });
  const result: { success?: boolean | string } = await response.json();
  // A resolved request can still be rejected by the delivery provider.
  if (!response.ok || (result.success !== true && result.success !== "true")) {
    throw new Error("Your message couldn’t be submitted. Please try again or email me directly.");
  }
}
