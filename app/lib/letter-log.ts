import { createEventId, enqueueEvent } from "./event-outbox";

export const letterLogMessages = {
  visit: "Открыта страница с письмом",
  leave: "Страница с письмом закрыта или покинута",
  hidden: "Страница ушла в фон",
  returned: "Страница снова на экране",
  open: "Марго нажала на письмо",
  flap_opened: "Клапан конверта открыт, письмо достаётся",
  envelope_depart: "Письмо полностью достали, конверт уезжает влево",
  letter_shown: "Письмо открыто на экране",
  paragraph_shown: "Появился абзац письма",
  ending_shown: "Появились подпись и кнопка фотографий",
  reveal_complete: "Завершено появление текста письма",
  scroll: "Марго начала пролистывать письмо",
  "25": "Марго пролистала письмо на 25%",
  "50": "Марго пролистала письмо на 50%",
  "75": "Марго пролистала письмо на 75%",
  "100": "Марго пролистала письмо до конца",
  gallery_open: "Марго открыла галерею фотографий",
  photo_view: "Марго перешла к фотографии",
  gallery_end: "Марго дошла до последней фотографии",
  gallery_close: "Марго закрыла окно фотографий или вопроса",
  question_shown: "Марго открыла вопрос о встрече сегодня",
  meeting_no: "Марго попыталась нажать убегающую кнопку «нет»",
  no_disappeared: "Кнопка «нет» исчезла после пяти попыток",
  meeting_yes: "Марго нажала «да» на предложение увидеться сегодня",
  thanks_shown: "Показано сообщение благодарности и любви",
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

let sessionId: string | undefined;
let sequence = 0;

export function logLetterEvent(event: LetterLogEvent, details?: string) {
  sessionId ??= createEventId();
  sequence += 1;
  const timestamp = new Date();
  const occurredAt = eventTimeFormatter.format(timestamp);
  const text = `${letterLogMessages[event]}${details ? `\n${details}` : ""}\nВремя события: ${occurredAt} МСК (UTC+3)\nСессия: ${sessionId}\nСобытие: ${sequence}\nUser-Agent: ${navigator.userAgent}`;
  if (process.env.NEXT_PUBLIC_EVENT_STORAGE_ENABLED !== "false") {
    enqueueEvent({ event_id: createEventId(), session_id: sessionId, sequence, name: event, occurred_at: timestamp.toISOString(), text });
    return;
  }
  void fetch("https://margo-log.vercel.app/api/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
    }),
    keepalive: true,
  }).then((response) => {
    if (!response.ok) console.warn(`[letter-log] ${event}: HTTP ${response.status}`);
  }).catch(() => {
    console.warn(`[letter-log] ${event}: отправка не удалась, проверь сеть и CORS`);
  });
}
