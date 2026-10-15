import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, useState } from "react";
import type { LetterContent } from "../../content/letter";
import MeetingQuestion from "./meeting-question";
import { logLetterEvent } from "../../lib/letter-log";

type LetterPhotoProps = {
  content: LetterContent;
  visible: boolean;
};

export default function LetterPhoto({ content, visible }: LetterPhotoProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const reducedMotion = useReducedMotion();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(tiltY, { stiffness: 220, damping: 22 });
  const photos = content.photos;
  const currentIndex = useRef(0);

  function logPhoto(next: number) {
    logLetterEvent("photo_view", `Фото: ${next + 1} из ${photos.length}`);
    if (next === photos.length - 1) logLetterEvent("gallery_end");
  }

  function turnPhoto(direction: number) {
    const next = Math.max(0, Math.min(currentIndex.current + direction, photos.length - 1));
    if (next === currentIndex.current) return;
    currentIndex.current = next;
    setIndex(next);
    logPhoto(next);
  }

  return (
    <>
      <motion.button
        type="button"
        className="photo-trigger"
        disabled={!visible}
        aria-label="Нажми марго тут наши фотки"
        aria-haspopup="dialog"
        style={{ rotateX, rotateY, transformPerspective: 700 }}
        whileHover={reducedMotion ? undefined : { scale: 1.035, y: -4 }}
        whileTap={reducedMotion ? undefined : { scale: 0.96, y: 3 }}
        onPointerMove={(event) => {
          if (reducedMotion || event.pointerType === "touch") return;
          const bounds = event.currentTarget.getBoundingClientRect();
          tiltX.set((0.5 - (event.clientY - bounds.top) / bounds.height) * 16);
          tiltY.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 20);
        }}
        onPointerLeave={() => { tiltX.set(0); tiltY.set(0); }}
        onPointerCancel={() => { tiltX.set(0); tiltY.set(0); }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => {
          currentIndex.current = 0;
          setIndex(0);
          setShowQuestion(false);
          dialog.current?.showModal();
          logLetterEvent("gallery_open");
          logPhoto(0);
        }}
      >
        <Image src={content.illustration} alt={content.illustrationAlt} width={225} height={270} sizes="(max-width: 600px) 187.5px, 217.5px" />
        <span className="photo-hint">
          <span>нажми марго<br />тут еще кое что</span>
        </span>
      </motion.button>
      <dialog
        ref={dialog}
        className="photo-dialog"
        aria-label="Наши фотографии"
        onClose={() => logLetterEvent("gallery_close", showQuestion ? "Экран: вопрос или благодарность" : `Фото: ${currentIndex.current + 1} из ${photos.length}`)}
        onKeyDown={(event) => {
          if (!showQuestion && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
            event.preventDefault();
            turnPhoto(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        {showQuestion ? (
          <div className="meeting-wrap">
            <button type="button" className="photo-close" onClick={() => dialog.current?.close()} aria-label="Закрыть">×</button>
            <MeetingQuestion />
          </div>
        ) : (
          <>
        <p className="photo-reminder">марго обязательно долистай до конца пожалуйста ♥</p>
        <div className="photo-stack">
          <button type="button" className="photo-close" autoFocus onClick={() => dialog.current?.close()} aria-label="Закрыть фотографии">×</button>
          <div className="photo-dialog-card">
            <div className="photo-viewport">
              {photos.map((memory, photoIndex) => (
                <Image
                  key={photoIndex}
                  src={memory.src}
                  alt={photoIndex === index ? memory.alt : ""}
                  aria-hidden={photoIndex !== index}
                  fill
                  loading="eager"
                  className={photoIndex === index ? "photo-slide is-active" : "photo-slide"}
                  sizes="(max-width: 600px) 85vw, 500px"
                />
              ))}
            </div>
          </div>
        </div>
          <div className="photo-navigation">
            <button type="button" disabled={index === 0} onClick={() => turnPhoto(-1)} aria-label="Предыдущее фото">←</button>
            <span aria-live="polite">{index + 1} / {photos.length}</span>
            <button type="button" onClick={() => {
              if (index === photos.length - 1) {
                setShowQuestion(true);
                logLetterEvent("question_shown");
                dialog.current?.scrollTo({ top: 0 });
              } else turnPhoto(1);
            }} aria-label={index === photos.length - 1 ? "Открыть маленькую просьбу" : "Следующее фото"}>→</button>
            <p>{index === photos.length - 1 ? "нажми еще раз марго я хочу кое что спросить →" : "смотри марго какие мы с тобой ♥"}</p>
          </div>
          </>
        )}
      </dialog>
    </>
  );
}
