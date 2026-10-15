import LetterPhoto from "./letter-photo";
import { motion } from "motion/react";
import { useLayoutEffect, useRef, type CSSProperties, type RefObject } from "react";
import type { LetterContent } from "../../content/letter";
import { getWordStagger, revealTiming } from "../../lib/letter-playback";

export type LetterOrigin = { left: number; top: number; width: number; height: number };

type LetterPaperProps = {
  content: LetterContent;
  headingRef: RefObject<HTMLHeadingElement | null>;
  visibleCount: number;
  endingVisible: boolean;
  instant: boolean;
  reduced: boolean;
  origin: LetterOrigin | null;
  onUnfoldComplete: () => void;
  unfolded: boolean;
  onGreetingComplete: () => void;
};

export default function LetterPaper({ content, headingRef, visibleCount, endingVisible, instant, reduced, origin, onUnfoldComplete, unfolded, onGreetingComplete }: LetterPaperProps) {
  const sheet = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const element = sheet.current;
    if (!element) return;
    if (!origin || reduced) {
      onUnfoldComplete();
      return;
    }
    const target = element.getBoundingClientRect();
    if (!target.width || !target.height) {
      onUnfoldComplete();
      return;
    }
    const scale = origin.width / target.width;
    const foldedHeight = Math.min(target.height, origin.height / scale);
    const fold = `inset(0px 0px ${target.height - foldedHeight}px 0px)`;
    const animation = element.animate([
      { transform: `translate(${origin.left - target.left}px, ${origin.top - target.top}px) scale(${scale})`, clipPath: fold, offset: 0 },
      { transform: "translate(0, 0) scale(1)", clipPath: fold, offset: 0.65 },
      { transform: "translate(0, 0) scale(1)", clipPath: "inset(0px 0px 0px 0px)", offset: 1 },
    ], { duration: revealTiming.unfold * 1000, easing: "cubic-bezier(.45, 0, .55, 1)" });
    animation.onfinish = onUnfoldComplete;
    return () => { animation.onfinish = null; animation.cancel(); };
  }, [origin, reduced, onUnfoldComplete]);

  return (
    <div className="paper-rest" style={{ "--paper-unfold-duration": `${revealTiming.unfold}s` } as CSSProperties}>
    <article
      ref={sheet}
      className="paper"
      aria-label="Письмо"
    >
      <h1
        ref={headingRef}
        tabIndex={-1}
        className={`letter-greeting${unfolded ? " is-shown" : ""}${instant ? " is-instant" : ""}`}
        style={{ "--greeting-duration": `${revealTiming.greeting}s` } as CSSProperties}
        onAnimationEnd={(event) => {
          if (event.animationName === "letter-greeting-appear") onGreetingComplete();
        }}
      >{content.greeting}</h1>
      {/* Keep the complete text in the DOM; the reading rhythm is purely visual. */}
      <div className="letter-body">
        {content.paragraphs.map((paragraph, index) => {
          const words = paragraph.split(/(\s+)/);
          const wordCount = words.filter((word) => word.trim()).length;
          return (
            <p key={index} className={`letter-paragraph${index < visibleCount ? " is-revealed" : ""}${instant ? " is-instant" : ""}`}>
              {words.map((word, wordIndex) => word.trim() ? (
                <span
                  key={wordIndex}
                  className="letter-word"
                  style={{
                    "--word-delay": `${0.05 + Math.floor(wordIndex / 2) * getWordStagger(wordCount)}s`,
                    "--word-duration": `${revealTiming.paragraph}s`,
                  } as CSSProperties}
                >{word}</span>
              ) : word)}
            </p>
          );
        })}
      </div>
      <div className="paper-bottom">
        <motion.div
          className="letter-ending"
          initial={false}
          animate={{ opacity: endingVisible ? 1 : 0, y: endingVisible || reduced ? 0 : 5 }}
          transition={{ duration: instant ? 0 : 0.8 }}
        >
          <p>{content.closing}</p>
          <div className="letter-signature">
            <motion.span
              className="signature"
              initial={false}
              animate={{ opacity: endingVisible ? 1 : 0, clipPath: endingVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
              transition={{ duration: instant ? 0 : 1, delay: instant ? 0 : 0.25, ease: "easeInOut" }}
            >{content.signature}</motion.span>
            <svg className="signature-line" viewBox="0 0 150 35" aria-hidden="true" style={{ overflow: "visible" }}>
              <motion.path
                d="M75 31C68 26 49 16 53 8C57 0 70 2 75 10C81 1 94 2 97 9C101 18 83 27 75 31Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={false}
                animate={{ pathLength: endingVisible ? 1 : 0 }}
                transition={{ duration: instant ? 0 : revealTiming.signature, delay: instant ? 0 : revealTiming.endingLead, ease: [0.45, 0, 0.25, 1] }}
                transform="translate(75 17.5) scale(2.2) translate(-75 -17.5)"
              />
            </svg>
          </div>
        </motion.div>
        <motion.figure
          className="letter-illustration"
          initial={false}
          animate={{
            opacity: endingVisible ? 1 : 0,
            y: endingVisible || reduced ? 0 : 12,
            rotate: reduced ? 0 : endingVisible ? [ -7, 5.5, 3.5, 4 ] : -7,
          }}
          transition={{ duration: instant ? 0 : 1.5, delay: instant ? 0 : 0.35, ease: "easeInOut" }}
        >
          <LetterPhoto content={content} visible={endingVisible} />
        </motion.figure>
      </div>
      <motion.div
        className="paper-unfold-shade"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0.65, scaleY: 1 }}
        animate={{ opacity: 0, scaleY: reduced ? 1 : [1, 0.7, 0] }}
        transition={{ duration: reduced ? 0 : revealTiming.unfold, ease: "easeInOut" }}
      />
      <span className="paper-corner" aria-hidden="true" />
      <motion.div className="fold fold-one" aria-hidden="true" initial={reduced ? false : { opacity: 1 }} animate={{ opacity: 0.35 }} transition={{ duration: reduced ? 0 : 1.2, delay: reduced ? 0 : 0.4 }} />
      <motion.div className="fold fold-two" aria-hidden="true" initial={reduced ? false : { opacity: 1 }} animate={{ opacity: 0.35 }} transition={{ duration: reduced ? 0 : 1.2, delay: reduced ? 0 : 0.7 }} />
    </article>
    </div>
  );
}
