export const letterLogMessages = {
  open: "Марго нажала на письмо",
  scroll: "Марго начала пролистывать письмо",
  "25": "Марго пролистала письмо на 25%",
  "50": "Марго пролистала письмо на 50%",
  "75": "Марго пролистала письмо на 75%",
  "100": "Марго пролистала письмо до конца",
} as const;

export type LetterLogEvent = keyof typeof letterLogMessages;

export function logLetterEvent(event: LetterLogEvent) {
  void fetch("/api/letter-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event }),
    keepalive: true,
  }).catch(() => {
    // Logging must never interrupt the letter experience.
  });
}
