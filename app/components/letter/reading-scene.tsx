import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { LetterContent } from "../../content/letter";
import { useLetterReveal } from "../../hooks/use-letter-reveal";
import { useLetterScrollLog } from "../../hooks/use-letter-scroll-log";
import LetterPaper from "./letter-paper";

type ReadingSceneProps = {
  content: LetterContent;
  showAll: boolean;
  reduced: boolean;
};

export default function ReadingScene({ content, showAll, reduced }: ReadingSceneProps) {
  const paper = useLetterScrollLog();
  const heading = useRef<HTMLHeadingElement>(null);
  const instant = showAll || reduced;
  const reveal = useLetterReveal(content.paragraphs, instant);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [instant]);

  return (
    <motion.section className="reading" initial={{ opacity: 0, y: reduced ? 0 : -32, scale: reduced ? 1 : 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: reduced ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}>
      <div ref={paper}>
        <LetterPaper content={content} headingRef={heading} visibleCount={reveal.visibleCount} endingVisible={reveal.endingVisible} instant={instant} reduced={reduced} />
      </div>
      <div className="after-letter">
        <motion.p initial={false} animate={{ opacity: reveal.complete ? 1 : 0 }} transition={{ duration: instant ? 0 : 0.9 }}>{content.finalNote}</motion.p>
      </div>
    </motion.section>
  );
}
