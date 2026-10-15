type StoredEvent = {
  event_id: string;
  session_id: string;
  sequence: number;
  name: string;
  occurred_at: string;
  text: string;
};

const prefix = "margo-event:";
const pending = new Map<string, StoredEvent>();
let initialized = false;
let sending = false;
let retryTimer: ReturnType<typeof setTimeout> | undefined;
let failures = 0;

export function createEventId() {
  return typeof crypto.randomUUID === "function" ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const value = Math.floor(Math.random() * 16);
      return (char === "x" ? value : (value & 3) | 8).toString(16);
    });
}

function restore() {
  try {
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!key?.startsWith(prefix)) continue;
      try {
        const item = JSON.parse(localStorage.getItem(key) ?? "null");
        if (item && typeof item.event_id === "string" && typeof item.text === "string") pending.set(item.event_id, item);
      } catch { /* Ignore a damaged local record. */ }
    }
  } catch { /* In-memory delivery still works when storage is unavailable. */ }
}

async function flush() {
  if (sending || !pending.size) return;
  sending = true;
  clearTimeout(retryTimer);
  try {
    for (const [id, item] of pending) {
      const response = await fetch("https://margo-log.vercel.app/api/v1/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
        keepalive: true,
        signal: AbortSignal.timeout(12000),
      });
      if (response.status !== 202) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      if (result.saved !== true || result.event_id !== id) throw new Error("Save was not confirmed");
      pending.delete(id);
      try { localStorage.removeItem(prefix + id); } catch { /* Storage may be blocked. */ }
      failures = 0;
    }
  } catch {
    failures += 1;
    console.warn("[letter-log] События ожидают подтверждения сохранения; отправка будет повторена");
  } finally {
    sending = false;
    if (pending.size) retryTimer = setTimeout(() => void flush(), Math.min(60000, 2000 * 2 ** Math.min(failures, 5)));
  }
}

export function enqueueEvent(item: StoredEvent) {
  if (!initialized) {
    initialized = true;
    restore();
    window.addEventListener("online", () => { restore(); void flush(); });
  }
  pending.set(item.event_id, item);
  try { localStorage.setItem(prefix + item.event_id, JSON.stringify(item)); } catch { /* Keep the memory copy. */ }
  void flush();
}
