export const CONTACT_EMAIL = "khushbrar605@gmail.com";
export const CONTACT_SENDER = "portfolio.notify@khushpreet.dev";

export type ContactEmailBinding = {
  send(message: {
    to: string;
    from: { email: string; name: string };
    replyTo: { email: string; name: string };
    subject: string;
    text: string;
  }): Promise<{ messageId: string }>;
};

export type ContactMessage = { name: string; email: string; message: string; website: string };

export function validateContactMessage(data: ContactMessage): string | null {
  if (!data.name.trim() || data.name.trim().length > 80 || /[\r\n\0]/.test(data.name)) return "Please enter your name (up to 80 characters).";
  if (data.email.length > 254 || /[\r\n\0]/.test(data.email) || !/^[^\s@<>,;:"\\]+@[^\s@<>,;:"\\]+\.[^\s@<>,;:"\\]+$/.test(data.email.trim())) return "Please enter a valid email address.";
  if (data.message.trim().length < 10 || data.message.trim().length > 4000) return "Please write a message between 10 and 4,000 characters.";
  return null;
}

export async function sendContactMessage(data: ContactMessage, pageUrl: string, binding: ContactEmailBinding): Promise<void> {
  const validationError = validateContactMessage(data);
  if (validationError) throw new Error(validationError);
  if (data.website) throw new Error("Unable to submit this message. Please email me directly.");

  const result = await binding.send({
    to: CONTACT_EMAIL,
    from: { email: CONTACT_SENDER, name: "Khushpreet Singh Portfolio" },
    replyTo: { email: data.email.trim(), name: data.name.trim() },
    subject: "New portfolio enquiry",
    text: [
      `Name: ${data.name.trim()}`,
      `Email: ${data.email.trim()}`,
      `Portfolio: ${pageUrl}`,
      "",
      data.message.trim(),
    ].join("\n"),
  });
  // Acceptance is not a guarantee of inbox delivery; do not report unconfirmed sends.
  if (!result?.messageId) {
    throw new Error("Your message couldn’t be submitted. Please try again or email me directly.");
  }
}
