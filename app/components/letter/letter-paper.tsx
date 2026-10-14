import LetterPhoto from "./letter-photo";
import { motion } from "motion/react";
import type { RefObject } from "react";
import type { LetterContent } from "../../content/letter";
import { getWordStagger, revealTiming } from "../../lib/letter-playback";

type LetterPaperProps = {
  content: LetterContent;
  headingRef: RefObject<HTMLHeadingElement | null>;
  visibleCount: number;
  endingVisible: boolean;
  instant: boolean;
  reduced: boolean;
};

export default function LetterPaper({ content, headingRef, visibleCount, endingVisible, instant, reduced }: LetterPaperProps) {
  return (
    <div className="paper-rest">
    <motion.article
      className="paper"
      initial={reduced ? false : {
        rotateX: 24,
        rotate: -1.5,
        scaleY: 0.94,
        clipPath: "inset(0 0 64% 0)",
      }}
      animate={{
        rotateX: reduced ? 0 : [24, -4, 1, 0],
        rotate: reduced ? 0 : [-1.5, 0.6, -0.2, -0.35],
        scaleY: reduced ? 1 : [0.94, 1.012, 0.998, 1],
        clipPath: reduced ? "inset(0 0 0% 0)" : [
          "inset(0 0 64% 0)", "inset(0 0 31% 0)", "inset(0 0 0% 0)", "inset(0 0 0% 0)",
        ],
      }}
      transition={{ duration: reduced ? 0 : revealTiming.unfold, times: [0, 0.42, 0.82, 1], ease: [0.22, 1, 0.36, 1] }}
      aria-label="Письмо"
    >
      <motion.h1
        ref={headingRef}
        tabIndex={-1}
        className="letter-greeting"
        initial={instant ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: instant ? 0 : 0.8, delay: instant ? 0 : revealTiming.unfold }}
      >{content.greeting}</motion.h1>
      {/* Keep the complete text in the DOM; the reading rhythm is purely visual. */}
      <div className="letter-body">
        {content.paragraphs.map((paragraph, index) => {
          const words = paragraph.split(/(\s+)/);
          const wordCount = words.filter((word) => word.trim()).length;
          return (
            <motion.p
              key={index}
              initial={instant ? "visible" : "hidden"}
              animate={index < visibleCount ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    duration: instant ? 0 : 0.2,
                    delayChildren: instant ? 0 : 0.05,
                    staggerChildren: instant ? 0 : getWordStagger(wordCount),
                  },
                },
              }}
            >
              {words.map((word, wordIndex) => word.trim() ? (
                <motion.span
                  key={wordIndex}
                  className="letter-word"
                  variants={{
                    hidden: { opacity: 0, y: reduced ? 0 : 3, filter: reduced ? "blur(0px)" : "blur(2px)" },
                    visible: {
                      opacity: 1, y: 0, filter: "blur(0px)",
                      transition: { duration: instant ? 0 : revealTiming.paragraph, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >{word}</motion.span>
              ) : word)}
            </motion.p>
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
          <figcaption>{content.illustrationCaption}</figcaption>
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
    </motion.article>
    </div>
  );
}
