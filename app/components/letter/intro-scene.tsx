import { useRef } from "react";
import { motion } from "motion/react";
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
    <motion.section className="intro" exit={{ opacity: 0, y: reduced ? 0 : 50, scale: reduced ? 1 : 0.96 }} transition={{ duration: reduced ? 0 : 0.4 }}>
      <motion.div className="intro-copy" animate={{ opacity: stage === "closed" ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.3 }}>
        <h1>Для тебя<span className="title-dot">.</span></h1>
      </motion.div>
      <Envelope buttonRef={button} onOpen={onOpen} stage={stage} recipient={content.recipient} />
    </motion.section>
  );
}
