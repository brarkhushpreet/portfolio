import { env } from "cloudflare:workers";
import { sendContactMessage, validateContactMessage, type ContactMessage, type ContactEmailBinding } from "../../contact-delivery";

const response = (body: object, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const origin = request.headers.get("Origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("Sec-Fetch-Site") === "cross-site") {
    return response({ success: false }, 403);
  }
  if (!request.headers.get("Content-Type")?.startsWith("application/json")) return response({ success: false }, 415);

  // Bound the body before parsing, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return response({ success: false }, 400);
  const decoder = new TextDecoder();
  let bytes = 0;
  let body = "";
  let data: ContactMessage;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 24576) {
        await reader.cancel();
        return response({ success: false }, 413);
      }
      body += decoder.decode(chunk.value, { stream: true });
    }
    body += decoder.decode();
    data = JSON.parse(body);
  } catch {
    return response({ success: false }, 400);
  } finally {
    reader.releaseLock();
  }
  if (!data || typeof data !== "object" || ![data.name, data.email, data.message, data.website].every((value) => typeof value === "string")) {
    return response({ success: false }, 400);
  }
  if (validateContactMessage(data) || data.website) return response({ success: false }, 422);

  try {
    const binding = (env as unknown as { CONTACT_EMAIL?: ContactEmailBinding }).CONTACT_EMAIL;
    if (!binding || typeof binding.send !== "function") return response({ success: false }, 503);
    const contactPage = new URL("/", process.env.NEXT_PUBLIC_SITE_URL || request.url).href;
    await sendContactMessage(data, contactPage, binding);
    return response({ success: true });
  } catch {
    return response({ success: false }, 502);
  }
}
