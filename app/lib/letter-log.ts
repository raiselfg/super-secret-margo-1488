export const letterLogMessages = {
  open: "Марго нажала на письмо",
  scroll: "Марго начала пролистывать письмо",
  "25": "Марго пролистала письмо на 25%",
  "50": "Марго пролистала письмо на 50%",
  "75": "Марго пролистала письмо на 75%",
  "100": "Марго пролистала письмо до конца",
} as const;

export type LetterLogEvent = keyof typeof letterLogMessages;

const eventTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export function logLetterEvent(event: LetterLogEvent) {
  const occurredAt = eventTimeFormatter.format(new Date());
  void fetch("https://margo-log.vercel.app/api/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `${letterLogMessages[event]}\nВремя события: ${occurredAt} МСК (UTC+3)\nUser-Agent: ${navigator.userAgent}`,
    }),
    keepalive: true,
  }).catch(() => {
    // Logging must never interrupt the letter experience.
  });
}
