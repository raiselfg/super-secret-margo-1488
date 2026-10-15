import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { logLetterEvent } from "../../lib/letter-log";

const escapePositions = [
  { left: "34%", top: 8 },
  { left: "55%", top: 24 },
  { left: "18%", top: 55 },
  { left: "65%", top: 90 },
  { left: "0%", top: 135 },
];

export default function MeetingQuestion() {
  const [attempts, setAttempts] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const yes = useRef<HTMLButtonElement>(null);
  const thanks = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const attemptCount = useRef(0);
  const answered = useRef(false);
  const no = useRef<HTMLButtonElement>(null);
  const lastEscape = useRef(-Infinity);

  function escape(source: "курсор" | "касание" | "нажатие") {
    const now = performance.now();
    if (answered.current || attemptCount.current >= escapePositions.length || now - lastEscape.current < 500) return;
    lastEscape.current = now;
    attemptCount.current += 1;
    setAttempts(attemptCount.current);
    logLetterEvent("meeting_no", `Попытка: ${attemptCount.current} из ${escapePositions.length}\nПричина побега: ${source}`);
    if (attemptCount.current === escapePositions.length) logLetterEvent("no_disappeared");
  }

  useEffect(() => { yes.current?.focus({ preventScroll: true }); }, [attempts]);
  useEffect(() => {
    if (accepted) thanks.current?.focus({ preventScroll: true });
  }, [accepted]);

  return (
    <motion.section
      className="meeting-card"
      initial={reduced ? false : { opacity: 0, y: 24, rotate: -3 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      aria-labelledby="meeting-title"
    >
      <motion.span
        className="meeting-heart"
        aria-hidden="true"
        animate={accepted && !reduced ? { scale: [1, 1.4, 1.1, 1.25, 1], rotate: [0, -8, 8, 0] } : { scale: 1 }}
        transition={{ duration: 0.8 }}
      >♥</motion.span>
      {!accepted && <p className="meeting-eyebrow">марго я очень хочу тебя увидеть</p>}
      <h2 id="meeting-title" ref={thanks} tabIndex={-1}>
        {accepted ? "спасибо большое марго моя любимая" : "давай пожалуйста увидимся сегодня?"}
      </h2>
      {accepted ? (
        <motion.div
          className="meeting-thanks"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p>я тебя очень сильно люблю маленькая моя ♥</p>
          {!reduced && <div className="meeting-heart-burst" aria-hidden="true">
            {[-90, -55, -20, 20, 55, 90].map((x, index) => (
              <motion.span
                key={x}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0], x, y: -100 - (index % 3) * 24, scale: [0.5, 1.2, 0.6], rotate: x / 2 }}
                transition={{ duration: 1.5, delay: index * 0.06 }}
              >♥</motion.span>
            ))}
          </div>}
        </motion.div>
      ) : (
        <>
          <motion.button
            ref={yes}
            type="button"
            className="meeting-yes"
            whileHover={reduced ? undefined : { scale: 1.06 }}
            whileTap={reduced ? undefined : { scale: 0.96 }}
            onClick={() => {
              if (answered.current) return;
              answered.current = true;
              setAccepted(true);
              logLetterEvent("meeting_yes");
              logLetterEvent("thanks_shown");
            }}
          >да ♥</motion.button>
          <div
            className="meeting-escape-area"
            onPointerMove={(event) => {
              if (event.pointerType !== "mouse" || !no.current) return;
              const bounds = no.current.getBoundingClientRect();
              const dx = Math.max(bounds.left - event.clientX, 0, event.clientX - bounds.right);
              const dy = Math.max(bounds.top - event.clientY, 0, event.clientY - bounds.bottom);
              if (Math.hypot(dx, dy) < 28) escape("курсор");
            }}
          >
            <AnimatePresence>
              {attempts < escapePositions.length && (
                <motion.button
                  ref={no}
                  type="button"
                  className="meeting-no"
                  initial={false}
                  animate={{
                    ...escapePositions[attempts],
                    rotate: reduced ? 0 : attempts % 2 === 0 ? -5 : 7,
                    scale: reduced ? 1 : 1 - attempts * 0.04,
                  }}
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 340 + attempts * 35, damping: 18, mass: 0.7 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -45, scale: 0, rotate: 180, filter: "blur(8px)", transition: { duration: 0.5 } }}
                  onPointerEnter={(event) => { if (event.pointerType === "mouse") escape("курсор"); }}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    escape(event.pointerType === "touch" ? "касание" : "нажатие");
                  }}
                  onClick={() => escape("нажатие")}
                >нет</motion.button>
              )}
            </AnimatePresence>
            <motion.p
              className="meeting-tease"
              aria-live="polite"
              initial={false}
              animate={{ opacity: attempts > 0 ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.35 }}
            >
              {attempts > 0 ? "ну пожалуйста марго ♥" : ""}
            </motion.p>
          </div>
        </>
      )}
    </motion.section>
  );
}
