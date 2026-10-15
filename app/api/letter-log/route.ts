import { letterLogMessages } from "../../lib/letter-log";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const event = body && typeof body === "object" && "event" in body ? body.event : null;
  if (typeof event !== "string" || !Object.hasOwn(letterLogMessages, event)) {
    return new Response(null, { status: 400 });
  }

  try {
    const response = await fetch("https://margo-log.vercel.app/api/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      body: JSON.stringify({ text: letterLogMessages[event as keyof typeof letterLogMessages] }),
      signal: AbortSignal.timeout(5000),
    });
    return new Response(null, { status: response.ok ? 204 : 502 });
  } catch {
    return new Response(null, { status: 502 });
  }
}
