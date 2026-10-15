import { useRef } from "react";
import { motion } from "motion/react";
import { revealTiming } from "../../lib/letter-playback";
import type { LetterContent } from "../../content/letter";
import type { Stage } from "../../lib/letter-playback";
import Envelope from "./envelope";

type IntroSceneProps = {
  stage: Stage;
  content: LetterContent;
  reduced: boolean;
  onOpen: () => void;
};

export default function IntroScene({ stage, content, reduced, onOpen }: IntroSceneProps) {
  const button = useRef<HTMLButtonElement>(null);
  return (
    <motion.section
      className="intro"
      exit={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : revealTiming.unfold }}
    >
      <motion.div className="intro-copy" animate={{ opacity: stage === "closed" ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.3 }}>
        <h1>Для тебя моя маленькая<span className="title-dot">♥</span></h1>
      </motion.div>
      <Envelope buttonRef={button} onOpen={onOpen} stage={stage} recipient={content.recipient} />
      <motion.p
        className="envelope-note"
        initial={reduced ? false : { opacity: 0, y: 5 }}
        animate={{ opacity: stage === "closed" ? 1 : 0, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.6, delay: stage === "closed" && !reduced ? 0.5 : 0 }}
      >нажми марго я тут написал тебе кое что</motion.p>
    </motion.section>
  );
}
